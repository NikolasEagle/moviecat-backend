import express from "express";

const app = express();

app.use(express.json());

import cookieParser from "cookie-parser";

app.use(cookieParser());

import bodyParser from "body-parser";

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

import { nanoid } from "nanoid";

import { addUser, checkUser } from "./db.js";

import { createHashedPassword, checkPassword } from "./pw.js";

import { createCookie, checkCookie } from "./cookie.js";

import path from "path";

import fs from "fs";

import https from "https";

const port = 443;

const httpsOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/moviecat.online/privkey.pem"),

  cert: fs.readFileSync("/etc/letsencrypt/live/moviecat.online/fullchain.pem"),
};

app.use(express.static(path.resolve("public")));

app.use("/*", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

app.post("/register", async (req, res) => {
  const id = nanoid();

  const { email, name, surname } = req.body;

  try {
    const user = await checkUser(email);

    if (!user) {
      const hashedPassword = await createHashedPassword(email, name, surname);

      await addUser(id, email, name, surname, hashedPassword);

      res.status(201).json(req.body);
    } else {
      res.status(409).json(req.body);
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  const cookies = req.cookies;

  const ip = req.ip;

  const userAgent = req.headers["user-agent"];

  try {
    const sessionToken = await checkCookie(cookies, ip, userAgent);

    if (sessionToken) {
      res.status(201).json();
    } else {
      const { email, password } = req.body;

      let user = await checkUser(email);

      if (user) {
        const correctPassword = await checkPassword(email, password);

        if (correctPassword) {
          const { sessionName, sessionId, expires } = await createCookie(
            user.id,
            ip,
            userAgent
          );

          res
            .cookie(sessionName, sessionId, { expires: expires })
            .status(201)
            .json();
        } else {
          res.status(401).json();
        }
      } else {
        res.status(401).json();
      }
    }
  } catch (error) {
    console.log(error);
  }
});

https
  .createServer(httpsOptions, app)
  .listen(port, () => console.log(`Server is running`));

export { app };
