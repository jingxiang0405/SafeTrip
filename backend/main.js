import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io'
import SetupSocket from '#src/routers/socket_router.js';

// Initialize environment variables
dotenv.config();

// Start initializing express server
const app = express();

// Socket IO 
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer
    , {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    }
)

io.on("connection", async (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    SetupSocket(io, socket);
});

// Middle Ware
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// Routes start here
import exampleRouter from '#src/routers/example_router.js';

app.use("/example", exampleRouter);


//


const PORT = process.env.PORT;

// Start server
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
