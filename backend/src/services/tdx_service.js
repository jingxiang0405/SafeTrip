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

async function FetchBusRealTimeFrequency(busId) {
    try {
        const result = await callApi(`/Bus/RealTimeByFrequency/City/Taipei/${busId}`);
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

async function FetchBusShape(busId) {
    try {
        return await callApi(`/Bus/Shape/City/Taipei/${busId}`);
    }
    catch (e) {
        console.error(e);
    }
}
export {
    FetchBusRealTimeFrequency,
    FetchStopOfRoute,
    FetchAllBusRoutes,
    FetchBusShape
}
