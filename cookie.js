import { nanoid } from "nanoid";

import { addSession, checkSession } from "./db.js";
import moment from "moment";

const sessionName = "session_movie_cat";

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

export async function checkCookie(cookies, ip, userAgent) {
  const sessionId = cookies[sessionName];

  const session = await checkSession(sessionId, ip, userAgent);

  return session;
}
