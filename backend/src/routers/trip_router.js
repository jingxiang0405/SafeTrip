import express from 'express';
const router = express.Router();

import {
    NewTrip,
    WaitForNewTrip,
    GetTrip,
    WaitForLocationUpdate,
    UpdateLocation,
} from '#src/controllers/trip_controller.js';

// the route address start from:
// http://localhost:PORT/trip

// 照顧者建立 Trip
router.post("/start/:caretakerId", NewTrip);

// 被照顧者等待 Trip 被建立 
router.get("/wait/:careReceiverId", WaitForNewTrip)

router.get("/:tripId", GetTrip);

// 照顧者等待位置更新
router.get("/location/:careReceiverId/subscribe", WaitForLocationUpdate);

// 被照顧者更新位置
router.put("/location/:careReceiverId", UpdateLocation);

export default router;
