import express from "express";

import https from "https";

import path from "path";

import fs from "fs";

const port = 5000;

/*const httpsOptions = {
  key: fs.readFileSync("privkey.pem"),

  cert: fs.readFileSync("fullchain.pem"),
};*/

let app = express();

app.get("/api/films/:page", async (req, res) => {
  try {
    let response = await fetch(
      `https://kinobd.xyz/api/films?page=${req.params.page}`
    );

    let body = await response.json();

    res.send(body);
  } catch (error) {
    res.send({});
  }
});

app.get("/api/films/search/:q", async (req, res) => {
  try {
    let response = await fetch(
      `https://kinobd.xyz/api/films/search/title?q=${req.params.q}`
    );

    let body = await response.json();

    res.send(body);
  } catch (error) {
    res.send({});
  }
});

app.listen(port, () => console.log(`Server is running on ${port}`));

export { app };

//https.createServer(httpsOptions, app).listen(443);
