import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "postfix",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,

    pass: process.env.SMTP_PASSWORD,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  dkim: {
    domainName: process.env.DOMAIN,
    keySelector: "dkim",
    privateKey: `/etc/opendkim/keys/${process.env.DOMAIN}.private`,
  },
});

export async function sendMail(email, name, surname, password) {
  try {
    await transporter.sendMail({
      from: `MovieCat <${process.env.SMTP_USER}>`,

      to: process.env.EMAIL,

      subject: "Заявка на регистрацию пользователя",

      html: `
      
        <h1>NEW USER</h1>
        <p>Name: ${name}</p>
        <p>Surname: ${surname}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Password:</b> ${password}</p>
      `,
    });
  } catch (error) {
    console.log(error);
  }
}
