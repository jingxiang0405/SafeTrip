import { SocketExample } from "#src/controllers/example_controller.js";

export default function setupSocket(socket) {

    socket.on('example', SocketExample);



    socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`));
}
