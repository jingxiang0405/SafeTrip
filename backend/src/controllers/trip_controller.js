import { EmitLocationChange, SubscribeLocation } from "#src/services/location_service.js";
import { EmitStartTrip, SubscribeNewTrip, FindTripById } from "#src/services/trip_service.js";

const tripRecords = {};
async function NewTrip(req, res) {
    try {


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

async function UpdateLocation(req, res) {
    try {
        const { careReceiverId } = req.params;
        const { lat, lng } = req.body;

        if (!careReceiverId) {
            res.status(400).send({ message: "carereceiverId is required" });
        }

        const location = { lat, lng };
        const record = tripRecords[careReceiverId];
        if (!record) {
            console.error("Trip is not created");
            res.status(404).send({ message: "Trip is not created" });
            return;
        }
        console.log("record:", record)

        record["location"] = location;
        // first update
        if (!record?.location) {

        }

        // TODO: Alert message
        EmitLocationChange(parseInt(careReceiverId), location);

        res.status(200).send(location);
    } catch (e) {
        console.error(e);
        res.status(400).send({ message: "UpdateLocation error" });
    }
}


async function WaitForLocationUpdate(req, res) {
    try {
        const { careReceiverId } = req.params;


        if (!careReceiverId) {
            res.status(400).send({ message: "carereceiverId is required" });
        }

        const record = tripRecords[careReceiverId];
        if (!record) {
            console.error("Trip is not created");
            res.status(404).send({ message: "Trip is not created" });
            return;
        }

        console.log(`Wait for ${careReceiverId} to update location`);
        const payload = await SubscribeLocation(parseInt(careReceiverId, 10), res);

        return payload;
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: "GetLocation error" });
    }
}
export {
    NewTrip,
    WaitForNewTrip,
    GetTrip,
    WaitForLocationUpdate,
    UpdateLocation,

}
