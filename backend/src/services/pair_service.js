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
 * Generate a 6-digit pairing code for a caretaker
 * @param {number} carereceiverId 
 * @returns {string} code
 */
function GenerateCode(carereceiverId) {
    cleanupExpiredCodes();

    const index = pairing_lists.findIndex((p) => p.ctId === carereceiverId);
    if (index !== -1) {
        pairing_lists.splice(index, 1);
    }

    const code = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
    console.log(`Generated code ${code} for carereceiver id=[${carereceiverId}]`);
    pairing_lists.push({ ctId: carereceiverId, code, createdAt: Date.now() });
    return code;
}

/**
 * Pair a carereceiver with a caretaker using the provided code
 * @param {string} code
 * @returns {number} carereceiverId 
 */
function PairWithCode(code) {
    cleanupExpiredCodes();
    const index = pairing_lists.findIndex((p) => p.code === code);


    // code invalid or expired
    if (index === -1) {
        console.error("Code not found:", code)
        return;
    }
    const carereceiverId = pairing_lists[index].ctId;

    pairing_lists.splice(index, 1);

    return carereceiverId;
}



import EventEmitter from 'events';
import { once } from 'events';

const emitter = new EventEmitter();

function EmitPair(carereceiverId, payload) {
    emitter.emit(`paired:${carereceiverId}`, payload);
}

function WaitForPair(carereceiverId, timeout = 60000) {
    const eventKey = `paired:${carereceiverId}`;
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

/**
 * Check if a user has been paired
 * @param {number} userId 
 * @returns {boolean} isPaired
 */
function CheckPairStatus(userId) {
    // If the user's code is not in the pairing list, they have been paired
    return !pairing_lists.some(p => p.ctId === userId);
}

export {
    GenerateCode,
    PairWithCode,
    EmitPair,
    WaitForPair,
    CheckPairStatus,
};

