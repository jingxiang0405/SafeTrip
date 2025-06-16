import db from "../database.js";
import { hashPassword, comparePasswords } from "../utils/passwordUtils.js";


async function FindUserById(userId) {
    const sql = `
    SELECT id, name, role, partner_id
    FROM users
    WHERE id = $1
  `;
    const { rows } = await db.query(sql, [userId]);
    if (rows.length === 0) {
        console.error('User not found');
        return null;
    }
    return rows[0];
}

async function Signup(name, password) {
    // First check if user already exists
    const checkSql = `
    SELECT id FROM users WHERE name = $1
    `;
    const existingUser = await db.query(checkSql, [name]);
    if (existingUser.rows.length > 0) {
        throw new Error('Username already taken');
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    const sql = `
    INSERT INTO users
      (sos_phone_number, role, partner_id, name, password)
    VALUES
      (null, null, null, $1, $2)
    RETURNING id, name, role, partner_id
  `;
    const vals = [name, hashedPassword];
    const { rows } = await db.query(sql, vals);
    return rows[0];
}

async function Login(name, password) {
    const sql = `
    SELECT id, name, role, partner_id, password
    FROM users
    WHERE name = $1
  `;
    const { rows } = await db.query(sql, [name]);
    if (rows.length === 0) {
        throw new Error('Invalid account or password');
    }

    const user = rows[0];
    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid account or password');
    }

    // Don't return the password hash
    delete user.password;
    return user;
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
