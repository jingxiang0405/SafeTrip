import express from 'express';
const router = express.Router();
import { GetAllRoutes, GetAllStops } from '#src/controllers/bus_controller.js';
// the route address start from:
// http://localhost:PORT/bus

router.get("/route/all", GetAllRoutes);
router.get("/route/:busId", GetAllStops);

export default router;
