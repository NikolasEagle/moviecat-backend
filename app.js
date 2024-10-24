import express from "express";

let app = express();

app.get("/backend/", async (req, res) => {
  await res.send({ data: "Lili" });
});

app.listen(5000, () =>
  console.log("Server is running on http://localhost:5000")
);
