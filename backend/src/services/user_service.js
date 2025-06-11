import db from "../database.js";


async function FindUserById(userId) {
    const sql = `
    SELECT id, account, name, role, partner_id
    FROM users
    WHERE id = $1
  `;
    const { rows } = await db.query(sql, [userId]);
    if (rows.length === 0) {
        throw new Error('User not found');
    }
    return rows[0];
}

async function Signup({ name, phone_number, role, partner_id = null, account, password }) {
    const sql = `
    INSERT INTO users
      (name, phone_number, role, partner_id, account, password)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, account, role, partner_id
  `;
    const vals = [name, phone_number, role, partner_id, account, password];
    const { rows } = await db.query(sql, vals);
    return rows[0];
}

async function Login(account, password) {
    const sql = `
    SELECT id, account, name, role, partner_id
    FROM users
    WHERE account = $1
      AND password = $2
  `;
    const { rows } = await db.query(sql, [account, password]);
    if (rows.length === 0) {
        throw new Error('Invalid account or password');
    }
    return rows[0];
}

// SetRole：更新使用者角色
async function UpdateRole(userId, newRole) {
    const sql = `
    UPDATE users
    SET role = $2
    WHERE id = $1
    RETURNING id, role
  `;
    const { rows } = await db.query(sql, [userId, newRole]);
    if (rows.length === 0) {
        throw new Error('User not found');
    }
    return rows[0];
}

// SetPartner：更新 partner_id
async function UpdatePartner(userId, partnerId) {
    const sql = `
    UPDATE users
    SET partner_id = $2
    WHERE id = $1
    RETURNING id, partner_id
  `;
    const { rows } = await db.query(sql, [userId, partnerId]);
    if (rows.length === 0) {
        throw new Error('User not found');
    }
    return rows[0];
}


export {
    Signup,
    Login,
    FindUserById,
    UpdatePartner,
    UpdateRole
}
