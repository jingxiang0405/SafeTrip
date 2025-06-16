import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// Start initializing express server
const app = express();

// Middle Ware
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// Routes start here
import exampleRouter from '#src/routers/example_router.js';
import tripRouter from '#src/routers/trip_router.js';
import userRouter from '#src/routers/user_router.js';
import busRouter from '#src/routers/bus_router.js';

app.use("/example", exampleRouter);
app.use("/user", userRouter);
app.use("/trip", tripRouter);
app.use("/bus", busRouter);
const PORT = process.env.PORT;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
