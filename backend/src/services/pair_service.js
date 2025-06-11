const CODE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
let pairing_lists = [];

/**
 * Remove expired codes from the pool
 */
function cleanupExpiredCodes() {
    const now = Date.now();

    console.log(`[${new Date(now)}] cleanup expired codes`);
    pairing_lists = pairing_lists.filter(({ createdAt }) => now - createdAt < CODE_EXPIRY_MS);
    console.log("pairing list is now : ", pairing_lists)
}

/**
 * Generate a 6-digit pairing code for a caregiver
 * @param {number} caretakerId 
 * @returns {string} code
 */
function GenerateCode(caretakerId) {
    cleanupExpiredCodes();

    const index = pairing_lists.findIndex((p) => p.ctId === caretakerId);
    if (index !== -1) {
        pairing_lists.splice(index, 1);
    }

    const code = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
    console.log(`Generated code ${code} for caretaker id=[${caretakerId}]`);
    pairing_lists.push({ ctId: caretakerId, code, createdAt: Date.now() });
    return code;
}

/**
 * Pair a caretaker with a caregiver using the provided code
 * @param {string} code
 * @returns {number} caretakerId 
 */
function PairWithCode(code) {
    cleanupExpiredCodes();
    const index = pairing_lists.findIndex((p) => p.code === code);


    // code invalid or expired
    if (index === -1) {
        console.error("Code not found:", code)
        return;
    }
    const caretakerId = pairing_lists[index].ctId;

    pairing_lists.splice(index, 1);

    return caretakerId;
}



import EventEmitter from 'events';
import { once } from 'events';

const emitter = new EventEmitter();

function EmitPair(caretakerId, payload) {
    emitter.emit(`paired:${caretakerId}`, payload);
}

function WaitForPair(caretakerId, timeout = 60000) {
    const eventKey = `paired:${caretakerId}`;
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
    GenerateCode,
    PairWithCode,
    EmitPair,
    WaitForPair,
};

