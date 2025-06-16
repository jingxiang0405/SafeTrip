import { PutLocation, SubscribeLocation } from "#src/services/location_service.js";
import { FetchBusData } from "#src/services/tdx_service.js";
import { FindTripById } from "#src/services/trip_service.js";


const tripRecords = [];
async function NewTrip(req, res) {
    try {


        const { caretaker_id, carereceiver_id, bus_id, bus_name, start_station, dest_station, lat, lng } = req.body;

        const newTrip = await CreateTrip({
            caretaker_id,
            carereceiver_id,
            bus_id,
            bus_name,
            start_station,
            dest_station,
            status: 'pending',
            start_time: new Date(),
            end_time: null,
        });

        const busData = FetchBusData(parseInt(bus_id));
        console.log("[New Trip] busData:\n", busData);
        tripRecords.push({

            ...newTrip,
            location: [lat, lng],
            // direction: 
        });

        console.log("[New Trip] current trips:\n", tripRecords);
        res.status(201).send(newTrip);
    }
    catch (e) {
        console.error(e);
        res.status(403).send({ message: "NewTrip error" });
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
    GetTrip,
    GetCareReceiverLocation,
    UpdateLocation,

}
