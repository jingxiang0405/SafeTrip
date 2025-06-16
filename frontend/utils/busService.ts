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
    try {
        const response = await api.get(`/bus/route/${busId}`);
        return response.data;
    } catch (e) {
        console.error("GetAllBuses failed:", e);
    }
}

const GetBusAllDirections = async (): Promise<{ label: string; value: string }[]> => {
  // 模擬 API 回傳
  return [
    { label: '去程', value: 'forward' },
    { label: '回程', value: 'backward' }
  ];
};

export {
    GetAllBuses,
    GetBusAllStops,
    GetBusAllDirections
}
