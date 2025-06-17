import EventEmitter from 'events';

const emitter = new EventEmitter();

function EmitLocationChange(careReceiverId, payload) {
    emitter.emit(`location:${careReceiverId}`, payload);
}


function SubscribeLocation(careReceiverId, timeoutMs) {
    const eventKey = `location:${careReceiverId}`;
    const listenerPromise = new Promise((resolve) => {
        emitter.once(eventKey, (payload) => {
            resolve(payload);
        });
    });

    if (typeof timeoutMs === 'number') {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Location update timed out')), timeoutMs);
        });
        return Promise.race([listenerPromise, timeoutPromise]);
    }

    return listenerPromise;
}



export {
    EmitLocationChange,
    SubscribeLocation
}
