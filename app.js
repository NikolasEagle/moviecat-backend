import express from "express";

import https from "https";

import path from "path";

import fs from "fs";

const port = 443;

const httpsOptions = {
  key: fs.readFileSync("privkey.pem"),

  cert: fs.readFileSync("fullchain.pem"),
};

let app = express();

app.get("/", async (req, res) => {
  res.redirect("/pages/1");
});

app.get("/pages/:page", async (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

app.get("/search/:query/pages/:page", async (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

app.get("/search/:query/pages/:page", async (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

app.use(express.static(path.resolve("public")));

/*app.listen(3000, () =>
  console.log("Testing server is running on http://localhost:8000")
);*/

https
  .createServer(httpsOptions, app)
  .listen(port, () => console.log(`Server is running`));

export { app };
