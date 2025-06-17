import { FetchAllBusRoutes, FetchStopOfRoute } from "#src/services/tdx_service.js";

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

export {
    GetAllRoutes,
    GetAllStops,
}
