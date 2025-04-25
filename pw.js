import generator from "generate-password";

import bcrypt from "bcryptjs";

import { getHashedPassword } from "./db.js";

import { sendMail } from "./mail.js";

export async function createHashedPassword(email, name, surname) {
  try {
    const salt = await bcrypt.genSalt(10);

    const password = generator.generate({
      length: 10,
      numbers: true,
    });

    await sendMail(email, name, surname, password);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
}

export async function checkPassword(email, password) {
  const hashedPassword = await getHashedPassword(email);

  return await bcrypt.compare(password, hashedPassword);
}
