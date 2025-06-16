import { PutLocation, SubscribeLocation } from "#src/services/location_service.js";
import { FetchStopOfRoute } from "#src/services/tdx_service.js";
import { EmitStartTrip, SubscribeNewTrip, InsertTrip, FindTripById } from "#src/services/trip_service.js";


const tripRecords = {};
async function NewTrip(req, res) {
    try {


        console.log("new trip")
        const caretakerId = parseInt(req.params.caretakerId, 10);
        const { careReceiverId, busName, startStation, endStation, direction } = req.body;

        const newTrip = {
            caretakerId,
            careReceiverId,
            busName,
            startStation,
            endStation,
            direction
        }

        EmitStartTrip(careReceiverId, {
            busName, startStation, endStation, terminal: direction.terminal
        });

        tripRecords[careReceiverId] = newTrip;

        console.log("[New Trip] current trips:\n", tripRecords);
        res.status(201).send(newTrip);
    }
    catch (e) {
        console.error(e);
        res.status(403).send({ message: "NewTrip error" });
    }
}


async function WaitForNewTrip(req, res) {

    req.setTimeout(0);

    try {
        const careReceiverId = parseInt(req.params.careReceiverId, 10);
        const payload = await SubscribeNewTrip(careReceiverId);
        res.status(200).send(payload);
    }
    catch (e) {
        console.error(e);
        res.status(400).send({ message: "WaitForNewTrip failed" });
    }
}

async function GetTrip(req, res) {

    try {

        const tripId = req.params.tripId;

        const data = await FindTripById(parseInt(tripId, 10));
        res.status(200).send(data);
    }
    catch (e) {
        console.error(e);
        res.status(400).send({ message: "GetTrip error" });
    }
}



// TODO : Next
async function UpdateLocation(req, res) {
    try {
        const { tripId, carereceiverId } = req.params;
        const { lat, lng, timestamp } = req.body;

        if (!tripId) {
            res.status(400).send({ message: "tripId is required" });
        }

        if (!carereceiverId) {
            res.status(400).send({ message: "carereceiverId is required" });
        }

        const location = { lat, lng, timestamp };
        PutLocation(parseInt(tripId), location);
        // 用 204 表示已接收但不回傳資料
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}


function GetCareReceiverLocation(req, res) {
    try {
        const { tripId } = req.params;
        SubscribeLocation(tripId, res);
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: "GetLocation error" });
    }
}
export {
    NewTrip,
    WaitForNewTrip,
    GetTrip,
    GetCareReceiverLocation,
    UpdateLocation,

}
