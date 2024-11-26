import pg from "pg";

import dotenv from "dotenv";
import moment from "moment";

dotenv.config();

export const db = new pg.Pool({
  user: process.env.USER_DATABASE,

  host: process.env.HOST_DATABASE,

  database: process.env.NAME_DATABASE,

  password: process.env.PASSWORD_DATABASE,

  port: process.env.PORT_DATABASE,
});

export async function addUser(id, email, name, surname, hashedPassword) {
  const query = `INSERT INTO users (id, email, name, surname, password) VALUES ('${id}', '${email}', '${name}', '${surname}', '${hashedPassword}')`;

  try {
    await db.query(query);
  } catch (error) {
    console.log(error);
  }
}

export async function checkUser(email) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;

  try {
    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

export async function getHashedPassword(email) {
  const query = `SELECT password FROM users WHERE email = '${email}'`;

  try {
    const { rows } = await db.query(query);

    return rows[0].password;
  } catch (error) {
    console.log(error);
  }
}

export async function addSession(id, date, userId, ip, userAgent) {
  const query = `INSERT INTO sessions (id, expires_at, user_id, ip, user_agent) VALUES ('${id}', '${date}', '${userId}', '${ip}', '${userAgent}')`;

  try {
    await db.query(query);
  } catch (error) {
    console.log(error);
  }
}

export async function checkSession(sessionId, ip, userAgent) {
  const query = `SELECT expires_at FROM sessions WHERE id = '${sessionId}' AND ip = '${ip}' AND user_agent = '${userAgent}'`;

  console.log(await db.query(query));

  try {
    const { rowCount, rows } = await db.query(query);

    if (rowCount) {
      const currentDate = moment().format("YYYY-MM-DD hh:mm:ss");

      const expires = rows[0].expires_at;

      if (currentDate > expires) {
        await deleteSession(sessionId);

        return false;
      } else {
        return true;
      }
    } else {
      return rowCount;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSession(sessionId) {
  const query = `DELETE FROM sessions WHERE id = '${sessionId}'`;

  try {
    await db.query(query);
  } catch (error) {
    console.log(error);
  }
}
