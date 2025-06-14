import db from "#src/database.js";

/**
 * Create a new Trip record including status and timestamps
 * @param {Object} params
 * @param {number} params.caregiver_id
 * @param {number} params.caretaker_id
 * @param {string} params.bus_id
 * @param {string} params.bus_name
 * @param {string} params.start_station
 * @param {string} params.dest_station
 * @param {string} params.status
 * @param {Date}   params.start_time
 * @param {Date}   params.end_time
 * @returns {Object} The created Trip
 */
async function CreateTrip({ caregiver_id, caretaker_id, bus_id, bus_name, start_station, dest_station, status, start_time, end_time }) {
    const sql = `
    INSERT INTO trips
      (caregiver_id, caretaker_id, bus_id, bus_name, start_station, dest_station, status, start_time, end_time)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, caregiver_id, caretaker_id, bus_id, bus_name, start_station, dest_station, status, start_time, end_time;
  `;

    const vals = [
        caregiver_id,
        caretaker_id,
        bus_id,
        bus_name,
        start_station,
        dest_station,
        status,
        start_time,
        end_time
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
      caregiver_id,
      caretaker_id,
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
    CreateTrip,
    FindTripById
};

