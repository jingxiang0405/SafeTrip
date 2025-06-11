import express from 'express';
const router = express.Router();
import {
    Signup,
    Login,
    GetUserData,
    CaretakerStartPairing,
    CaregiverPair,
    CaretakerPairingSubscribe


} from "#src/controllers/user_controller.js";

// the route address start from:
// http://localhost:PORT/user

router.get("/:userId", GetUserData);

router.post("/login", Login);
router.post("/signup", Signup);

// 配對照顧者與被照顧者

// 產生驗證碼
router.get("/pair/:caretakerId", CaretakerStartPairing);

// 等待配對
router.get("/pair/:caretakerId/subscribe", CaretakerPairingSubscribe)

// 配對
router.put("/:caregiverId/pair/code/:code", CaregiverPair);


export default router;
