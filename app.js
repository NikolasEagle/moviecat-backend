import express from "express";

import https from "https";

import path from "path";

import fs from "fs";

let httpsOptions = {
  key: fs.readFileSync("privkey.pem"),

  cert: fs.readFileSync("fullchain.pem"),
};

let app = express();

app.get("/", async (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

https.createServer(httpsOptions, app).listen(443);
