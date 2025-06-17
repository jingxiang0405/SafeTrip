import { api } from '@/utils/apiConfig';

async function GetAllBuses() {
    // TODO: backend
    // response: 
    //   [string, string, ...]
    
    // fakedata
    return ['262', '307', '205', '藍1', '綠16'];

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
    //                 lon: number
    //             }
    //          },
    //          
    //      ]
    // }
    // 
    // fakedata
    return {
        0: [
            {
                name: "台大醫院",
                location: { lat: 25.042233, lon: 121.516002 }
            },
            {
                name: "台北車站",
                location: { lat: 25.047708, lon: 121.517055 }
            },
            {
                name: "善導寺",
                location: { lat: 25.0451, lon: 121.5235 }
            }
        ],
        1: [
            {
                name: "南港展覽館",
                location: { lat: 25.0689, lon: 121.6135 }
            },
            {
                name: "昆陽",
                location: { lat: 25.0505, lon: 121.5808 }
            }
        ]
    }
    try {
        const response = await api.get(`/bus/route/${busId}`);
        return response.data;
    } catch (e) {
        console.error("GetAllBuses failed:", e);
    }
}

// const GetBusAllDirections = async (): Promise<{ label: string; value: string }[]> => {
//   // 模擬 API 回傳
//   return [
//     { label: '去程', value: 'forward' },
//     { label: '回程', value: 'backward' }
//   ];
// };

const SendCreateTrip = async (userId: number, partnerId: number | undefined | null, busName: string, startStop: string, endStop: string, direction: number, terminal: string) => {
    // console.log("SendCreateTrip: ");
    // console.log(partnerId, busName, startStop, endStop, direction, terminal);
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
        return response.data;
    } catch (e) {
        console.error("SendCreateTrip failed:", e);
    }
}

// async function  
export {
    GetAllBuses,
    GetBusAllStops,
    SendCreateTrip
    // GetBusAllDirections
}
