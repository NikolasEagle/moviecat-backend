import pg from "pg";

import dotenv from "dotenv";

dotenv.config();

export const db = new pg.Pool({
  user: process.env.POSTGRES_USER,

  host: process.env.POSTGRES_HOST,

  database: process.env.POSTGRES_DB,

  password: process.env.POSTGRES_PASSWORD,

  port: process.env.POSTGRES_PORT,
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
