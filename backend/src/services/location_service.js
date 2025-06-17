function EmitLocationChange(careReceiverId, payload) {
    const eventKey = `location:${careReceiverId}`;
    console.log("Location Event:", eventKey)
    emitter.emit(eventKey, payload);
}


function SubscribeLocation(careReceiverId, timeoutMs) {
    const eventKey = `location:${careReceiverId}`;
    console.log("Subscribing to event:", eventKey);
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

function GetDistanceMeter(location1, location2) {
    const R = 6371e3; // 地球半徑（公尺）
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(location2.lat - location1.lat); // 緯度差;
    const dLon = toRad(location2.lng - location1.lng); // 經度差;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(location1.lat)) * Math.cos(toRad(location2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export {
    GetDistanceMeter
}
