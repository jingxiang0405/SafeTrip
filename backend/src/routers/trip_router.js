import express from 'express';
const router = express.Router();

import {
    GetCareReceiverLocation, GetTrip, NewTrip, UpdateLocation
} from '#src/controllers/trip_controller.js';

// the route address start from:
// http://localhost:PORT/trip

router.post("/", NewTrip);
router.get("/:tripId", GetTrip);
// location
router.get("/:tripId/location/:carereceiverId/subscribe", GetCareReceiverLocation);

// 被照顧者更新位置
router.put("/:tripId/location/:careReceiverId", UpdateLocation);

export default router;
