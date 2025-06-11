import { PostLocation, SubscribeLocation } from "#src/services/location_service.js";
import { FindTripById } from "#src/services/trip_service.js";
async function NewTrip(req, res) {
    try {


        const { caregiver_id, caretaker_id, bus_id, bus_name, start_station, dest_station } = req.body;
        const newTrip = await CreateTrip({
            caregiver_id,
            caretaker_id,
            bus_id,
            bus_name,
            start_station,
            dest_station,
            status: 'pending',
            start_time: new Date(),
            end_time: null,
        });

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
        const { tripId } = req.params;
        const { lat, lng, timestamp, role } = req.body;

        if (role != 'caretaker') {
            console.error("非被照顧者呼叫UpdateLocation. role=", role);
            return;
        }
        const location = { lat, lng, timestamp };
        PostLocation(tripId, location);
        // 用 204 表示已接收但不回傳資料
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}


function GetLocation(req, res) {
    try {
        const { tripId } = req.params;
        SubscribeLocation(tripId, res);
        // 不在這裡呼叫 next()，讓連線保持 open
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: "GetLocation error" });
    }
}
export {
    NewTrip,
    GetTrip,
    GetLocation,
    UpdateLocation,

}
