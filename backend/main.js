import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { createServer } from 'http';
import { Server } from 'socket.io'
import SetupSocket from '#src/routers/socket_router.js';

// Initialize environment variables
dotenv.config();

// Start initializing express server
const app = express();
const PORT = process.env.PORT;

// Socket IO 
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
    }
})

io.on("connection", socket => SetupSocket(socket));

// Middle Ware
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
}));


// Routes start here
import exampleRouter from '#src/routers/example_router.js';

app.use("/example", exampleRouter);


//



// Global error handler
app.use((err, req, res) => {
    console.error(err);
    res.status(err.status || 500).send("something is wrong...\n detected in global error handler");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
