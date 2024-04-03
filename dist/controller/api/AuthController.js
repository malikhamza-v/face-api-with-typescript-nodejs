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
exports.check_face_controller = exports.post_face_controller = void 0;
// [info]: imports
const canvas_1 = __importDefault(require("canvas"));
const express_validator_1 = require("express-validator");
const faceapi = require("face-api.js");
// [info]: helpers
function getImageDescriptor(images, label) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const descriptions = [];
            for (let i = 0; i < images.length; i++) {
                const img = yield convertBlobToHtmlImageElement(images[i]);
                const detections = yield faceapi
                    .detectSingleFace(img)
                    .withFaceLandmarks()
                    .withFaceDescriptor();
                if (detections) {
                    descriptions.push(detections.descriptor);
                }
            }
            return descriptions;
        }
        catch (_) {
            return false;
        }
    });
}
function compareDescriptors(image, descriptions, label) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const alteredDescriptors = [];
            for (let i = 0; i < descriptions.length; i++) {
                const descriptorArray = Object.values(descriptions[i]).map((value) => parseFloat(value.toString()));
                const descriptor = new Float32Array(descriptorArray);
                alteredDescriptors.push(descriptor);
            }
            const faceDescriptors = new faceapi.LabeledFaceDescriptors(label, alteredDescriptors);
            const faceMatcher = new faceapi.FaceMatcher(faceDescriptors, 0.6);
            const img = yield convertBlobToHtmlImageElement(image);
            let temp = faceapi.createCanvasFromMedia(img);
            const displaySize = { width: img.width, height: img.height };
            faceapi.matchDimensions(temp, displaySize);
            const detections = yield faceapi
                .detectAllFaces(img)
                .withFaceLandmarks()
                .withFaceDescriptors();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
            return results;
        }
        catch (err) {
            return false;
        }
    });
}
const base64ToBlob = (base64Data) => {
    try {
        const contentType = base64Data
            .split(",")[0]
            .replace(/^data:([a-z]+)\/([a-z]+);base64,/, "");
        const byteString = atob(base64Data.split(",")[1]);
        const mimeArray = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            mimeArray[i] = byteString.charCodeAt(i);
        }
        return new Blob([mimeArray], { type: contentType });
    }
    catch (_) {
        return false;
    }
};
const convertBlobToHtmlImageElement = (blob) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imgBuffer = yield blob.arrayBuffer();
        const imgData = Buffer.from(imgBuffer);
        return yield canvas_1.default.loadImage(imgData);
    }
    catch (error) {
        throw error;
    }
});
// [info]: controllers
const check_face_controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // [info]: return validation error message
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ error: true, errorMessage: errors.array() });
    }
    const { label, image, description } = req.body;
    const blob = base64ToBlob(image);
    if (!blob) {
        return res.json({
            error: true,
            message: "Something went wrong, converting your base64 into blob.",
        });
    }
    let result = yield compareDescriptors(blob, description, label);
    if (result) {
        res.json({ error: false, result });
    }
    else {
        res.json({
            error: true,
            message: "Something went wrong comparing your descriptor.",
        });
    }
});
exports.check_face_controller = check_face_controller;
const post_face_controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // [info]: return validation error message
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(200)
                .json({ error: true, errorMessage: errors.array() });
        }
        const { label, image } = req.body;
        const blob = base64ToBlob(image);
        if (!blob) {
            return res.status(200).json({
                error: true,
                message: "Something went wrong converting your base64 into blob.",
            });
        }
        let result = yield getImageDescriptor([blob], label);
        if (result) {
            return res.status(200).json({ error: false, description: result });
        }
        else {
            return res.status(200).json({
                error: true,
                message: "No descriptors found for the provided image.",
            });
        }
    }
    catch (error) {
        return res
            .status(200)
            .json({ error: true, message: `Something went wrong! ${error}.` });
    }
});
exports.post_face_controller = post_face_controller;
