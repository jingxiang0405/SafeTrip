import dotenv from 'dotenv';

dotenv.config();

const TOKEN_URL = 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token';
const API_BASE = 'https://tdx.transportdata.tw/api/basic/v2';
const TDX_CLIENT_ID = process.env.TDX_CLIENT_ID;
const TDX_CLIENT_SECRET = process.env.TDX_CLIENT_SECRET;
let cachedToken = null;
let tokenExpiry = 0;

/**
 * 取得或更新 Access Token
 */
async function fetchAccessToken() {
    const now = Date.now();

    if (cachedToken && now < tokenExpiry - 80000_000) {
        return cachedToken;
    }
    console.log(`${now} 重新取得 Access Token`);
    // 使用 URLSearchParams 組成 x-www-form-urlencoded body
    const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: TDX_CLIENT_ID,
        client_secret: TDX_CLIENT_SECRET,
    });

    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`TDX Token 取得失敗: ${res.status} ${res.statusText} – ${text}`);
    }
    const { access_token, expires_in } = await res.json();

    cachedToken = access_token;
    tokenExpiry = Date.now() + expires_in * 1000;
    return access_token;
}

/**
 * 通用呼叫 TDX API
 * @param {string} path  例如 '/Rail/TRA/LiveTrainDelay'
 * @param {object} opts  Query 參數物件，例如 { $top: 30, $format: 'JSON' }
 * @returns {Promise<any>} 回傳 API JSON
 */
async function callApi(path, opts = {}) {
    const token = await fetchAccessToken();
    const qs = new URLSearchParams(opts).toString();
    const url = `${API_BASE}${path}?${qs}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`TDX API 呼叫失敗: ${res.status} ${res.statusText} – ${text}`);
    }
    return res.json();
}

async function FetchBusData(busId) {
    try {
        const result = await callApi(`/Bus/RealTimeByFrequency/City/Taipei/${busId}`);
        console.log(result);
        return result;
    }
    catch (e) {
        console.error(e);
    }

}

async function FetchStopOfRoute(busId) {
    try {

        return await callApi(`/Bus/StopOfRoute/City/Taipei/${busId}`);
    }
    catch (e) {

        console.error(e);
    }
}

async function FetchAllBusRoutes() {
    try {
        return await callApi('/Bus/Route/City/Taipei');
    }

    catch (e) {
        console.error(e);
    }
}
/**
 * @param {Number} busId 
 * @param {string} startStation 
 * @param {string} endStation}
 * @returns {Promise<Number>} 回傳 0 or 1 
 */
async function DirectionOfBus(busId, startStation, endStation) {
    try {
        const data = await callApi(`/Bus/StopOfRoute/City/Taipei/${busId}`);
        let startIndex;
        let endIndex;

        data[0].Stops.forEach((stop, index) => {
            if (stop.StopName.Zh_tw === startStation) {
                startIndex = index;
            }
            if (stop.StopName.Zh_tw === endStation) {
                endIndex = index;
            }
        })

        data[1].Stops.forEach((stop, index) => {
            if (stop.StopName.Zh_tw === startStation) {
                startIndex = index;
            }
            if (stop.StopName.Zh_tw === endStation) {
                endIndex = index;
            }
        })


        if (startIndex === undefined || endIndex === undefined) {
            console.log("找不到站牌");
            return;
        }
        console.log(startIndex);

    }
    catch (e) {
        console.error(e);
    }
}
export {
    FetchBusData,
    FetchStopOfRoute,
    FetchAllBusRoutes
}
