// @ts-nocheck
require("@tensorflow/tfjs-node");
const express = require("express");
const faceapi = require("face-api.js");
import routes from "./routes";
const { Canvas, Image } = require("canvas");
// const fileUpload = require("express-fileupload");
const { json, urlencoded } = require("body-parser");
faceapi.env.monkeyPatch({ Canvas, Image });

const port = process.env.PORT || 3000;
const app = express();
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  console.log("CHECK");
});

async function LoadModels() {
  await faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/models");
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/models");
}

LoadModels().then(() => {
  app.listen(port);
});
