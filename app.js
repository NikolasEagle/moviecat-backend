import { Express } from "express";

let app = express();

app.get("/", async (req, res) => {
  await res.send("Lili");
});

app.listen(5000, () =>
  console.log("Server is running on http://localhost:5000")
);
