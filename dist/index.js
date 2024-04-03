"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
require("@tensorflow/tfjs-node");
const express = require("express");
const faceapi = require("face-api.js");
const routes_1 = __importDefault(require("./routes"));
const { Canvas, Image } = require("canvas");
// const fileUpload = require("express-fileupload");
const { json, urlencoded } = require("body-parser");
faceapi.env.monkeyPatch({ Canvas, Image });
const port = process.env.PORT || 3000;
const app = express();
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.json());
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    console.log("CHECK");
});
function LoadModels() {
    return __awaiter(this, void 0, void 0, function* () {
        yield faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/models");
        yield faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/models");
        yield faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/models");
    });
}
LoadModels().then(() => {
    app.listen(port);
});
