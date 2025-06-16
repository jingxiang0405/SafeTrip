import { api } from '@/utils/apiConfig';

async function GetAllBuses() {
    // TODO: backend
    // response: 
    //   [string, string, ...]
    
    // fakedata
    return ["530", "羅斯福路幹線", "262", "307", "205"];

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
    //                 lon: number}
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

export {
    GetAllBuses,
    GetBusAllStops,
    // GetBusAllDirections
}
