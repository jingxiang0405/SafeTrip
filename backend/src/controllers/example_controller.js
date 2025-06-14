import { ExampleServiceMethod } from "#src/services/example_service.js";

// rest
async function GetExampleData(req, res) {
    let result = await ExampleServiceMethod();

    res.status(200).send(result);
}

export {
    GetExampleData
}
