let token = null;

const TOKEN_URL = 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token';
const API_BASE = 'https://tdx.transportdata.tw/api/basic/v2';
let cachedToken = null;
let tokenExpiry = 0;

/**
 * 取得或更新 Access Token
 */
async function fetchAccessToken() {
    const now = Date.now();
    // 如果 Token 尚未過期 (預留 60 秒緩衝)
    if (cachedToken && now < tokenExpiry - 60000) {
        return cachedToken;
    }

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

async function GetBusPosition(busId) {
    try {
        const result = await callApi(`/Bus/RealTimeByFrequency/City/Taipei/${busId}`);
        return result;
    }
    catch (e) {
        console.error(e);
    }

}


export {
    GetBusPosition
}
