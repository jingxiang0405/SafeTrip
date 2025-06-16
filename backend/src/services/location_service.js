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


export {
    EmitLocationUpdate,
    WaitForLocationUpdate,
}
