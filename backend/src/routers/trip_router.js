import express from 'express';
const router = express.Router();

import {
    NewTrip,
    CheckForNewTrip,
    GetTrip,
    CheckLocationUpdate,
    UpdateLocation,
} from '#src/controllers/trip_controller.js';

// the route address start from:
// http://localhost:PORT/trip

// 照顧者建立 Trip
router.post("/start", NewTrip);

// 被照顧者確認是否有Trip 被建立 
router.get("/check/:careReceiverId", CheckForNewTrip)

router.get("/:tripId", GetTrip);

// 照顧者確認是否有位置更新
router.get("/location/:careReceiverId/check", CheckLocationUpdate);

// 被照顧者更新位置
router.put("/location/:careReceiverId", UpdateLocation);

export default router;
