import { api } from '@/utils/apiConfig';
import * as Location from 'expo-location';

const SendCareReceiverLoc = async (userId: number, location: { lat: number; lng: number }) => {
    console.log("SendCareReceiverLoc: ", userId, location);
    try {
        const response = await api.put(`/trip/location/${userId}`, location);
        return response.data;
    } catch (e) {
        console.error("SendCareReceiverLoc failed:", e);
    }
};

const getCareReceiverLoc = async (careReceiverId: number | null | undefined) => {
    console.log("getCareReceiverLoc: ", careReceiverId);
    try{
        const response = await api.get(`/trip/location/${careReceiverId}/check`);
        if (response.status === 204) {
            console.log("getCareReceiverLoc: Trip not found:", response.status);
            return null;
        }
        return response.data;
    } catch (e) {
        console.error("getCareReceiverLoc failed:", e);
    }
};




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

const CheckTripStatus = async (careReceiverId: number | null | undefined) => {
    if (careReceiverId === null || careReceiverId === undefined) {
        console.error("CheckTripStatus: no careReceiverId");
    }
    try {
        const response = await api.get(`/trip/check/${careReceiverId}`);
        if (response.status === 204) {
            console.log("CheckTripStatus: Trip not found:", response.status);
            return null;
        }
        return response.data;
    } catch (e: any) {
        console.error("CheckTripStatus failed:", e);
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
    if (busId.length === 0) {
        return [{}];
    }
    
    try {
        const response = await api.get(`/bus/route/${busId}`);
        // console.log("GetBusAllStops response:", transformedData.);
        return response.data;
    } catch (e) {
        console.error("GetAllBuses failed:", e);
    }
}
async function GetBusInfo(busId: string) {
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
    try{
        const response = await api.get(`/bus/route/frequency/${busId}`);
        return response.data;
    } catch (e) {
        console.error("GetBusPos failed:", e);
    }

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
    GetBusInfo,
    CheckTripStatus,
    SendCareReceiverLoc,
    getCareReceiverLoc
    // GetBusAllDirections
}
