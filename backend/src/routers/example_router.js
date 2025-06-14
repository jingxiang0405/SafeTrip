import express from 'express';
const router = express.Router();

import { GetExampleData } from '#src/controllers/example_controller.js';

// the route address start from:
// http://localhost:PORT/example

router.get("/", GetExampleData);
export default router;
