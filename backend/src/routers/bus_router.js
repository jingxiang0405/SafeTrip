import express from 'express';
const router = express.Router();
import { GetAllRoutes, GetAllStops, GetBusShape } from '#src/controllers/bus_controller.js';
// the route address start from:
// http://localhost:PORT/bus

router.get("/route/all", GetAllRoutes);
router.get("/route/:busId", GetAllStops);
router.get("/route/shape/:busId/direction/:dir", GetBusShape);
export default router;
