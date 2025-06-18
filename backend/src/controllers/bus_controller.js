import { FetchAllBusRoutes, FetchStopOfRoute, FetchBusShape, FetchBusRealTimeFrequency } from "#src/services/tdx_service.js";

const cache = {}

async function GetAllRoutes(req, res) {

    try {
        if (cache?.allBusRoutes) {
            console.log("[GetAllBusRoutes] Get from cache:", cache.allBusRoutes);
            res.status(200).send(cache.allBusRoutes);
            return;
        }

        const data = await FetchAllBusRoutes();
        const result = data.map(route => route.RouteName.Zh_tw)

        cache.allBusRoutes = result;

        res.status(200).send(result);

    }
    catch (e) {
        console.error('GetAllBusRoutes error:', e);

        res.status(400).send("GetAllBusRoutes error");
    }
}

async function GetAllStops(req, res) {

    try {

        const busId = req.params.busId;

        const data = await FetchStopOfRoute(busId);

        let result = {}

        data.forEach((dirData) => {
            const stops = [];
            dirData.Stops.forEach((stop) => {
                stops.push({ name: stop.StopName.Zh_tw, location: { lng: stop.StopPosition.PositionLon, lat: stop.StopPosition.PositionLat } });
            })

            result[dirData.Direction] = stops;
        })

        res.status(200).send(result);

    } catch (e) {
        console.error(e);

        res.status(400).send("GetBusStopNames error");
    }
}

async function GetBusShape(req, res) {

    const { dir, busId } = req.params;

    console.log("GetBusShape")
    const data = await FetchBusShape(busId);

    const dirData = data.find((d) => d.Direction == dir);
    const result = dirData.Geometry.replace("LINESTRING (", "").replace(")", "").split(", ").map(coord => {
        const [lng, lat] = coord.split(" ").map(Number);
        return { lat, lng };
    });

    res.status(200).send(result);
}

async function GetBusFrequency(req, res) {
    try {

        const { busId } = req.params;
        const data = await FetchBusRealTimeFrequency(busId);
        const result = data.map(bus => ({ PlateNumb: bus.PlateNumb, BusPosition: bus.BusPosition }))
        res.status(200).send(result);
    }
    catch (e) {
        console.error(e);
        res.status(400).send({ message: "GetBusFrequency error" });
    }
}
export {
    GetAllRoutes,
    GetAllStops,
    GetBusShape,
    GetBusFrequency
}
