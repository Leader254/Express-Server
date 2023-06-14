import express from "express";
import peopleRoutes from "./routes/peopleRoutes.js";
import config from "./db/config.js";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// jwt middleware
app.use((req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(" ")[0] === "JWT") {
    jwt.verify(req.headers.authorization.split(" ")[1], config.jwt_secret, (err, decode) => {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

app.use(peopleRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(config.port, () => {
  console.log(`Server running on ${config.url}`);
});
