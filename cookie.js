import { nanoid } from "nanoid";

import { addSession, checkSession } from "./db.js";
import moment from "moment";

import dotenv from "dotenv";

dotenv.config();

export async function createCookie(userId, ip, userAgent) {
  const sessionId = nanoid();

  const expires = moment().add(6, "days").toDate();

  const date = moment(expires).format("YYYY-MM-DD hh:mm:ss");

  await addSession(sessionId, date, userId, ip, userAgent);

  return {
    sessionName: sessionName,
    sessionId: sessionId,
    expires: expires,
  };
}

export async function checkCookie(cookies, userAgent) {
  const sessionId = cookies[process.env.SESSION_TOKEN];

  const session = await checkSession(sessionId, userAgent);

  return session;
}
