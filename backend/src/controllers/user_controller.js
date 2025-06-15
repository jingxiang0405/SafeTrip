import { EmitPair, GenerateCode, PairWithCode, WaitForPair, CheckPairStatus } from "#src/services/pair_service.js";
import {
    Signup as QuerySignup,
    Login as QueryLogin,
    FindUserById,
    UpdatePartner,
    UpdateRole
} from "#src/services/user_service.js";

/**
 * Create a new user (caretaker or carereceiver)
 */
async function Signup(req, res) {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).send({ message: "Missing required fields" });
        }
        const result = await QuerySignup(name, password);
        // Generate a simple token - in production you'd use JWT
        const token = Buffer.from(`${name}:${new Date().getTime()}`).toString('base64');
        return res.status(201).send({
            ...result,
            token
        });
    } catch (e) {
        console.error('Signup error:', e);
        res.status(400).send({ message: "Signup error" });
    }
}

/**
 * Authenticate a user and return session/token info
 */
async function Login(req, res) {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).send({ message: "Missing required fields" });
        }
        const result = await QueryLogin(name, password);
        // Generate a simple token - in production you'd use JWT
        const token = Buffer.from(`${name}:${new Date().getTime()}`).toString('base64');

        const partner_name = await FindUserById(result.partner_id).name;
        return res.status(200).send({
            ...result,
            partner_name,
            token
        });
    } catch (e) {
        console.error('Login error:', e);
        res.status(401).send({ message: "Invalid credentials" });
    }
}

/**
 * Get user data by user ID
 */
async function GetUserData(req, res) {
    try {
        const id = req.params.userId;
        const user = await FindUserById(parseInt(id, 10));
        res.status(200).send(user);
    } catch (e) {
        console.error('GetUserData error:', e);
        res.status(404).send({ message: "User not found" });
    }
}


async function CarereceiverStartPairing(req, res) {
    try {
        const carereceiverId = parseInt(req.params.carereceiverId, 10);
        const caretakerData = await FindUserById(carereceiverId);
        if (!caretakerData) {
            res.status(404).send({ message: "user not found" })
            return;
        }

        const code = GenerateCode(carereceiverId);

        res.status(200).send({ code });
    } catch (e) {

        console.error(e);
        res.status(400).send({ message: "start pairing error" });
    }
}

async function CarereceiverPairingSubscribe(req, res) {
    try {

        const carereceiverId = parseInt(req.params.carereceiverId, 10);
        const payload = await WaitForPair(carereceiverId);
        res.status(200).send(payload);
    } catch (e) {
        console.error(e);
        res.status(408).send({ message: "Pairing time out" })
    }
}
async function CaretakerPair(req, res) {
    try {
        const code = req.params.code;
        const caretakerId = parseInt(req.params.caretakerId, 10);
        const caretakerName = await FindUserById(caretakerId).name;
        const carereceiverId = PairWithCode(code);
        const carereceiverName = await FindUserById(carereceiverId).name;

        if (!carereceiverId) {
            res.status(404).send({ message: "pairing failed" })
            return;
        }

        UpdatePartner(caretakerId, carereceiverId);
        UpdatePartner(carereceiverId, caretakerId);
        UpdateRole(caretakerId, "caretaker");
        UpdateRole(carereceiverId, "careReceiver");

        EmitPair(carereceiverId, { success: true, caretakerId, caretakerName });
        res.status(200).send({ message: "pairing success", partnerId: carereceiverId, partnerName: carereceiverName });

    } catch (e) {
        console.error(e);
        res.status(400).send({ message: "pairing error" });
    }

}

async function CheckPairing(req, res) {
    try {
        const userId = parseInt(req.params.userId, 10);
        const isPaired = CheckPairStatus(userId);
        const user = await FindUserById(userId);

        if (isPaired && user.partner_id) {
            res.status(200).send({
                success: true,
                message: "pairing success",
                partnerId: user.partner_id
            });
        } else {
            res.status(200).send({
                success: false,
                message: "not paired"
            });
        }
    } catch (e) {
        console.error(e);
        res.status(400).send({ message: "check pairing error" });
    }
}

export {
    Signup,
    Login,
    GetUserData,
    CarereceiverStartPairing,
    CarereceiverPairingSubscribe,
    CaretakerPair,
    CheckPairing
};

