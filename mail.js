import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  sendmail: true,
  newline: "unix",
  path: "/usr/sbin/sendmail",
  secure: true,
  dkim: {
    domainName: process.env.DOMAIN,
    keySelector: "dkim", // The key you used in your DKIM TXT DNS Record
    privateKey: "/etc/opendkim/keys/moviecat.online/dkim.private", // Content of you private key
  },
});

export async function sendMail(email, name, surname, password) {
  try {
    await transporter.sendMail({
      from: `"Admin" <root@${process.env.DOMAIN}>`,

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
