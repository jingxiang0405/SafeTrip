import express from 'express';
const router = express.Router();
import {
    Signup,
    Login,
    GetUserData,
    CarereceiverStartPairing,
    CaretakerPair,
    CarereceiverPairingSubscribe,
    CheckPairing

} from "#src/controllers/user_controller.js";

// the route address start from:
// http://localhost:PORT/user

router.get("/:userId", GetUserData);

router.post("/login", Login);
router.post("/signup", Signup);

// 配對照顧者與被照顧者

// 產生驗證碼
router.get("/pair/:carereceiverId", CarereceiverStartPairing);

// 等待配對
router.get("/pair/:carereceiverId/subscribe", CarereceiverPairingSubscribe);

// 檢查配對狀態
router.get("/pair/:userId/status", CheckPairing);

// 配對
router.put("/:caretakerId/pair/code/:code", CaretakerPair);


export default router;
