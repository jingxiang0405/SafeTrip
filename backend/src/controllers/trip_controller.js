import { GetDistanceMeter } from "#src/services/location_service.js";
import { FindTripById } from "#src/services/trip_service.js";
import { FetchBusRealTimeFrequency } from "#src/services/tdx_service.js";
const tripRecords = {};
async function NewTrip(req, res) {
    try {


        const { caretakerId, careReceiverId, busName, startStation, endStation, direction } = req.body;

        const careReceiverIdi = parseInt(careReceiverId, 10);
        const caretakerIdi = parseInt(caretakerId, 10);
        const newTrip = {
            caretakerIdi,
            careReceiverIdi,
            busName,
            startStation,
            endStation,
            direction
        }

        tripRecords[careReceiverIdi] = newTrip;

        console.log("Trip Created:", tripRecords);
        res.status(201).send(newTrip);
    }
    catch (e) {
        console.error(e);
        res.status(403).send({ message: "NewTrip error" });
    }
}


async function CheckForNewTrip(req, res) {

    req.setTimeout(0);

    try {
        const careReceiverId = parseInt(req.params.careReceiverId, 10);
        if (!tripRecords[careReceiverId]) {
            res.status(204).send({});
        }

        res.status(200).send(tripRecords[careReceiverId]);
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
        console.log(`CareReceiverId:${careReceiverId} UpdateLocation: ${lat}, ${lng}`);
        if (!careReceiverId) {
            res.status(400).send({ message: "carereceiverId is required" });
        }

        const location = { lat, lng, checked: false };
        const record = tripRecords[careReceiverId];
        if (!record) {
            console.error("Trip is not created");
            res.status(204).send({});
            return;
        }
        console.log("(trip record)", record)

        const oldLocation = record["location"];

        const messages = [];
        // not first update
        if (record?.location) {
            // if (GetDistanceMeter(oldLocation, location) > 300) {
            //     messages.push("被照顧者偏離行程")
            // }
            // TODO: Alert message
        }

        // Find Nearby Bus
        const busData = (await FetchBusRealTimeFrequency(record.busName)).map(bus => ({ BusPosition: bus.BusPosition, PlateNumb: bus.PlateNumb }))
        let minDistance = 100;
        let nearbyBusIndex = -1;
        busData.forEach((bus, index) => {
            const dist = GetDistanceMeter(location, { lat: bus.BusPosition.PositionLat, lng: bus.BusPosition.PositionLon });
            if (dist < minDistance) {
                nearbyBusIndex = index;
                minDistance = dist;
            }
        });
        const nearbyBus = (nearbyBusIndex === -1) ? {} : busData[nearbyBusIndex];
        record["location"] = location;
        record["messages"] = messages;
        record["nearbyBus"] = nearbyBus;
        const result = {
            location,
            messages,
            nearbyBus
        }

        res.status(200).send(result);
    } catch (e) {
        console.error(e);
        res.status(400).send({ message: "UpdateLocation error" });
    }
}


async function CheckLocationUpdate(req, res) {
    try {
        const { careReceiverId } = req.params;

        console.log(`CheckLocationUpdate: ${careReceiverId}`);

        if (!careReceiverId) {
            res.status(400).send({ message: "carereceiverId is required" });
        }

        const record = tripRecords[careReceiverId];
        if (!record) {
            console.error("Trip is not created");
            res.status(204).send({});
            return;
        }

        const location = record.location;

        if (!location) {
            console.log("No location created yet");
            res.status(204).send({})
            return;
        }

        if (location.checked) {
            console.log("No latest location update");

            res.status(204).send({})
            return;
        }

        tripRecords[careReceiverId].location.checked = true;
        res.status(200).send({ location, messages: record?.messages || [], nearbyBus: record.nearbyBus });
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: "GetLocation error" });
    }
}
export {
    NewTrip,
    CheckForNewTrip,
    GetTrip,
    CheckLocationUpdate,
    UpdateLocation,

}
