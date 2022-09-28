import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.FLIPR_DB_CONN_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("Error connecting to muxdb" + err.stack);
  });

const port = process.env.PORT || 8000;
const app = express();
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.options("*", cors());

var api = express.Router();
api.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
require("./src/routes/api.js")(api);
app.use("/api", api);
var auth = express.Router();
auth.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
require("./src/routes/auth.js")(auth);
app.use("/auth", auth);
// const __dirname=
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

app.listen(port, () => {
  console.log(`server listening on PORT ${port}`);
});