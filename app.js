import express from "express";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

/*import cookieParser from "cookie-parser";

app.use(cookieParser());*/

import bodyParser from "body-parser";

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

import session from "express-session";

import { RedisStore } from "connect-redis";

import redis from "redis";

const redisClient = redis.createClient();

await redisClient.connect();

app.use(
  session({
    store: new RedisStore({
      host: process.env.HOST_REDIS,

      port: process.env.PORT_REDIS,

      client: redisClient,

      ttl: 60000 * 60,
    }),

    name: process.env.SESSION_NAME,

    secret: process.env.SESSION_SECRET_KEY,

    resave: true,

    saveUninitialized: false,

    cookie: { maxAge: 60 * 1000 * 60 * 24 * 7 },
  })
);

import { nanoid } from "nanoid";

import { addUser, checkUser } from "./db.js";

import { createHashedPassword, checkPassword } from "./pw.js";

/*import { createCookie, checkCookie } from "./cookie.js";*/

import path from "path";

import fs from "fs";

import https from "https";

const port = 443;

const httpsOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/moviecat.online/privkey.pem"),

  cert: fs.readFileSync("/etc/letsencrypt/live/moviecat.online/fullchain.pem"),
};

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
  try {
    const session = await redisClient.get(`sess:${req.sessionID}`);

    if (session) {
      res.status(201).json(JSON.parse(session)["data"]);
    } else {
      const { email, password } = req.body;

      let user = await checkUser(email);

      if (user) {
        const correctPassword = await checkPassword(email, password);

        if (correctPassword) {
          req.session.data = {
            email: user.email,
            name: user.name,
            surname: user.surname,
          };

          res.status(201).json(req.session.data);
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

app.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie(process.env.SESSION_NAME, { path: "/" });
  });
});

app.use(express.static(path.resolve("public")));

app.use("/", (req, res) => {
  if (req.method === "GET") {
    res.sendFile(path.resolve("public/index.html"));
  }
});

https
  .createServer(httpsOptions, app)
  .listen(port, () => console.log(`Server is running`));

export { app };
