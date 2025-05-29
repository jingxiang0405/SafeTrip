import { Example } from "#src/services/example_service.js";

// rest
async function GetExampleData(req, res) {
    let result = await Example();

    res.status(200).send(result);
}

// socket
async function SocketExample() {

    console.log('socket example');
}
export {
    GetExampleData,
    SocketExample
}
