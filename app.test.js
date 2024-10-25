import { app } from "./app.js";

import request from "supertest";

import fs from "fs";

import path from "path";

import assert from "assert";

it("Отправка index.html", function (done) {
  request(app)
    .get("/")
    .expect((response) => {
      assert.deepEqual(
        response.text,
        fs.readFileSync(path.resolve("public/index.html"), "utf-8")
      );
    })
    .end(done);
});
