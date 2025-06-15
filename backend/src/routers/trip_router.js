import express from 'express';
const router = express.Router();

import { GetLocation, GetTrip, NewTrip, UpdateLocation } from '#src/controllers/trip_controller.js';

// the route address start from:
// http://localhost:PORT/trip

router.post("/", NewTrip);
router.get("/:tripId", GetTrip);
// location
router.get("/:tripId/location/subscribe", GetLocation);
router.post("/:tripId/location", UpdateLocation);
export default router;
