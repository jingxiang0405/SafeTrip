import { api } from '@/utils/apiConfig';

const SendCreateTrip = async (userId: number, partnerId: number | undefined | null, busName: string, startStop: string, endStop: string, direction: number, terminal: string) => {
    // console.log("SendCreateTrip: ");
    // console.log(partnerId, busName, startStop, endStop, direction, terminal);
    // return [];
    try {
        const response = await api.post(`/trip/start`, {
            "careTakerId": userId,
            "careReceiverId": partnerId,
            "busName": busName,
            "startStation": startStop,
            "endStation": endStop,
            "direction": {
                "id": direction,
                "terminal": terminal
            },
        });
        console.log("SendCreateTrip response:", response.data);
        return response.data;
    } catch (e) {
        console.error("SendCreateTrip failed:", e);
    }
}

async function GetAllBuses() {
    // TODO: backend
    // response: 
    //   [string, string, ...]
    
    // fakedata
    // return ['262', '307', '205', '藍1', '綠16'];

    try {
        const response = await api.get(`/bus/route/all`);
        return response.data;
    } catch (e) {
        console.error("GetAllBuses failed:", e);
    }
}

async function GetBusAllStops(busId: string){
    // TODO: backend
    // response: 
    // {
    //      direction : [
    //
    //          {
    //             name: string,
    //             locaation:{
    //                 lat: number,
    //                 lng: number
    //             }
    //          },
    //          
    //      ]
    // }
    // 
    // fakedata
    // return {
    //     0: [
    //         {
    //             name: "台大醫院",
    //             location: { lat: 25.042233, lng: 121.516002 }
    //         },
    //         {
    //             name: "台北車站",
    //             location: { lat: 25.047708, lng: 121.517055 }
    //         },
    //         {
    //             name: "善導寺",
    //             location: { lat: 25.0451, lng: 121.5235 }
    //         }
    //     ],
    //     1: [
    //         {
    //             name: "南港展覽館",
    //             location: { lat: 25.0689, lng: 121.6135 }
    //         },
    //         {
    //             name: "昆陽",
    //             location: { lat: 25.0505, lng: 121.5808 }
    //         }
    //     ]
    // }
    try {
        const response = await api.get(`/bus/route/${busId}`);
        // console.log("GetBusAllStops response:", response.data);
        return response.data;
    } catch (e) {
        console.error("GetAllBuses failed:", e);
    }
}
async function GetBusPos(busId: string) {
        // TODO: backend
    // response: 
    // {
    //      p
    // {
    //     "PlateNumb": "EAL-1061",
    //     "BusPosition": {
    //         "PositionLon": 121.542438,
    //         "PositionLat": 25.001403,
    //         "GeoHash": "wsqqjz2e8"
    //     }
    // },
    // }
    // 
    // fakedata
    return [
    {
        "PlateNumb": "EAL-0037",
        "BusPosition": {
            "PositionLon": 121.615732,
            "PositionLat": 24.999095,
            "GeoHash": "wsqqpqvy7"
        }
    },
    {
        "PlateNumb": "EAL-1061",
        "BusPosition": {
            "PositionLon": 121.542438,
            "PositionLat": 25.001403,
            "GeoHash": "wsqqjz2e8"
        }
    },
    {
        "PlateNumb": "EAL-1062",
        "BusPosition": {
            "PositionLon": 121.543632,
            "PositionLat": 25.000195,
            "GeoHash": "wsqqjz1ke"
        }
    },
    {
        "PlateNumb": "EAL-1063",
        "BusPosition": {
            "PositionLon": 121.568748,
            "PositionLat": 24.988465,
            "GeoHash": "wsqqnm58m"
        }
    },
    {
        "PlateNumb": "EAL-1073",
        "BusPosition": {
            "PositionLon": 121.573727,
            "PositionLat": 24.992272,
            "GeoHash": "wsqqnmxq9"
        }
    }
    ]
}
async function GetBusRouteShape(busId: string, direction: number) {
        // TODO: backend
    // response: 
    // {
    //      Route : [
    //
    //             {
    //                 number, number
    //             }
    //             {
    //                 number, number
    //             }    
    //             {
    //                 number, number
    //             }
    //           ...
    //      ]
    // }
    // 
    // fakedata
    // return [
    //         { lat: 25.042233, lng: 121.516002 },
    //         { lat: 25.047708, lng: 121.517055 },
    //         { lat: 25.0451, lng: 121.5235 },
    //         { lat: 25.0689, lng: 121.6135 },
    //         { lat: 25.0505, lng: 121.5808 },
    //         { lat: 25.0001, lng: 121.5412 },
    //         { lat: 25.0146, lng: 121.5331 },
    //         { lat: 25.0223, lng: 121.5285 }
    //     ]
    try {
        const response = await api.get(`/bus/route/shape/${busId}/direction/${direction}`);
        return response.data;
    } catch (e) {
        console.error("GetBusRouteShape failed:", e);
    }
}

// const GetBusAllDirections = async (): Promise<{ label: string; value: string }[]> => {
//   // 模擬 API 回傳
//   return [
//     { label: '去程', value: 'forward' },
//     { label: '回程', value: 'backward' }
//   ];
// };

// async function  
export {
    GetAllBuses,
    GetBusAllStops,
    SendCreateTrip,
    GetBusRouteShape,
    GetBusPos
    // GetBusAllDirections
}
