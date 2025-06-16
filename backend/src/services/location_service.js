const pendingRequests = new Map();   // tripId -> [{ res, timer }]
const latestLocations = new Map();   // tripId -> { lat, lng, timestamp }

const TIMEOUT_MS = 30000; // 30秒逾時

import EventEmitter from 'events';
import { once } from 'events';

const emitter = new EventEmitter();

function EmitLocationUpdate(carereceiverId, payload) {
    emitter.emit(`location:${carereceiverId}`, payload);
}

function WaitForLocationUpdate(carereceiverId, timeout = 60000) {
    const eventKey = `location:${carereceiverId}`;
    return new Promise((resolve, reject) => {
        // set up one-time listener
        emitter.once(eventKey, payload => {
            clearTimeout(timer);
            resolve(payload);
        });
        // timeout to avoid hanging
        const timer = setTimeout(() => {
            emitter.removeAllListeners(eventKey);
            reject(new Error('Pairing timed out'));
        }, timeout);
    });
}
function SubscribeLocation(tripId, res) {
    // 設定 no-cache header
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (!pendingRequests.has(tripId)) {
        pendingRequests.set(tripId, []);
    }

    // 建立逾時機制
    const timer = setTimeout(() => {
        // 逾時後回傳空資料或最新位置
        const loc = latestLocations.get(tripId) || null;
        res.json({ location: loc });
        removePending(tripId, res);
    }, TIMEOUT_MS);

    // 記錄正在等待的 response
    pendingRequests.get(tripId).push({ res, timer });
}

function PutLocation(tripId, location) {
    // 更新最新位置快取
    latestLocations.set(tripId, location);

    // 立即回應所有掛起的訂閱
    const pendings = pendingRequests.get(tripId) || [];
    for (const { res, timer } of pendings) {
        clearTimeout(timer);
        res.json({ location });
    }

    // 清除該 tripId 的 pending list
    pendingRequests.delete(tripId);
}

function removePending(tripId, res) {
    const list = pendingRequests.get(tripId) || [];
    const filtered = list.filter(item => item.res !== res);
    if (filtered.length > 0) {
        pendingRequests.set(tripId, filtered);
    } else {
        pendingRequests.delete(tripId);
    }
}


export {
    SubscribeLocation,
    WaitForLocationUpdate,
    PutLocation
}
