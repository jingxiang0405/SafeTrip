import { EmitPair, GenerateCode, PairWithCode, WaitForPair } from "#src/services/pair_service.js";
import {
    Signup as QuerySignup,
    Login as QueryLogin,
    FindUserById,
    UpdatePartner,
    UpdateRole
} from "#src/services/user_service.js";

/**
 * Create a new user (caregiver or caretaker)
 */
async function Signup(req, res) {
    try {
        const result = await QuerySignup(req.body);
        return res.status(201).send(result);
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
        const result = await QueryLogin(req.body);
        return res.status(200).send(result);
    } catch (e) {
        console.error('Login error:', e);
        res.status(401).send({ message: "Login error" });
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


async function CaretakerStartPairing(req, res) {
    try {
        const caretakerId = parseInt(req.params.caretakerId, 10);
        const caregiverData = await FindUserById(caretakerId);
        if (!caregiverData) {
            res.status(404).send({ message: "user not found" })
            return;
        }

        const code = GenerateCode(caretakerId);

        res.status(200).send({ code });
    } catch (e) {

        console.error(e);
        res.status(400).send({ message: "start pairing error" });
    }
}

async function CaretakerPairingSubscribe(req, res) {
    try {

        const caretakerId = parseInt(req.params.caretakerId, 10);
        const payload = await WaitForPair(caretakerId);
        res.status(200).send(payload);
    } catch (e) {
        console.error(e);
        res.status(408).send({ message: "Pairing time out" })
    }
}
async function CaregiverPair(req, res) {
    try {
        const code = req.params.code;
        const caregiverId = parseInt(req.params.caregiverId, 10);
        const caretakerId = PairWithCode(code);

        if (!caretakerId) {
            res.status(404).send({ message: "pairing failed" })
            return;
        }

        UpdatePartner(caregiverId, caretakerId);
        UpdatePartner(caretakerId, caregiverId);
        UpdateRole(caregiverId, "caretaker");
        UpdateRole(caretakerId, "caregiver");

        EmitPair(caretakerId, { success: true, caregiverId });
        res.status(200).send({ message: "pairing success", partnerId: caretakerId });

    } catch (e) {
        console.error(e);
        res.status(400).send({ message: "pairing error" });
    }

}
export {
    Signup,
    Login,
    GetUserData,
    CaretakerStartPairing,
    CaretakerPairingSubscribe,
    CaregiverPair
};

