import express from "express";
import peopleRoutes from "./routes/peopleRoutes.js";
import config from "./db/config.js";

const app = express();
app.use(express.json());

app.use(peopleRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(config.port, () => {
  console.log(`Server running on ${config.url}`);
});
