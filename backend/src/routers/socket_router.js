import { SocketExample } from "#src/controllers/example_controller.js";


async function SetupSocket(io, socket) {

    socket.on('example', async () => SocketExample(io, socket));

    socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`));


    console.log("Socket set up")
}

export default SetupSocket;
