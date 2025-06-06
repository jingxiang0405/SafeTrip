import { ExampleServiceMethod } from "#src/services/example_service.js";

// rest
async function GetExampleData(req, res) {
    let result = await ExampleServiceMethod();

    res.status(200).send(result);
}

// socket
async function SocketExample(io, socket) {

    const data = await ExampleServiceMethod();
    console.log('socket example');
    io.emit('example', { data: data })
}
export {
    GetExampleData,
    SocketExample
}
