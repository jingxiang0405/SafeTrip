import db from "#src/database.js";

/**
 * Create a new Trip record including status and timestamps
 * @param {Object} params
 * @param {number} params.caretaker_id
 * @param {number} params.carereceiver_id
 * @param {string} params.bus_name
 * @param {string} params.start_station
 * @param {string} params.dest_station
 * @param {string} params.status
 * @param {Date}   params.start_time
 * @param {Date}   params.end_time
 * @returns {Object} The created Trip
 */
async function InsertTrip({ caretakerId, careReceiverId, busName, startStation, destStation, status, startTime, endTime }) {
    const sql = `
    INSERT INTO trips
      (caretaker_id, carereceiver_id, bus_name, start_station, dest_station, status, start_time, end_time)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, caretaker_id, carereceiver_id, bus_name, start_station, dest_station, status, start_time, end_time;
  `;

    const vals = [
        caretakerId,
        careReceiverId,
        busName,
        startStation,
        destStation,
        status,
        startTime,
        endTime
    ];

    const { rows } = await db.query(sql, vals);
    return rows[0];
}

/**
 * Find a Trip by its ID, including status and timestamps
 * @param {number} tripId
 * @returns {Object} The Trip record
 */
async function FindTripById(tripId) {
    const sql = `
    SELECT
      id,
      caretaker_id,
      carereceiver_id,
      bus_id,
      bus_name,
      start_station,
      dest_station,
      status,
      start_time,
      end_time
    FROM trips
    WHERE id = $1;
  `;

    const { rows } = await db.query(sql, [tripId]);
    if (rows.length === 0) {
        throw new Error('Trip not found');
    }
    return rows[0];
}

export {
    InsertTrip,
    FindTripById
};

