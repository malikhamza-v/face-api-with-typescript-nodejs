// [info]: imports
import canvas from "canvas";
import { validationResult } from "express-validator";
const faceapi = require("face-api.js");
import { Request, Response } from "express";

// [types]
type Descriptor = { [key: string]: number };

// [info]: helpers
async function getImageDescriptor(images: Blob[], label: string) {
  try {
    const descriptions = [];
    for (let i = 0; i < images.length; i++) {
      const img = await convertBlobToHtmlImageElement(images[i]);

      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (detections) {
        descriptions.push(detections.descriptor);
      }
    }
    return descriptions;
  } catch (_) {
    return false;
  }
}

async function compareDescriptors(
  image: Blob,
  descriptions: Descriptor[],
  label: string
) {
  try {
    const alteredDescriptors: Float32Array[] = [];
    for (let i = 0; i < descriptions.length; i++) {
      const descriptorArray = Object.values(descriptions[i]).map(
        (value: number) => parseFloat(value.toString())
      );
      const descriptor = new Float32Array(descriptorArray);
      alteredDescriptors.push(descriptor);
    }

    const faceDescriptors = new faceapi.LabeledFaceDescriptors(
      label,
      alteredDescriptors
    );

    const faceMatcher = new faceapi.FaceMatcher(faceDescriptors, 0.6);

    const img = await convertBlobToHtmlImageElement(image);

    let temp = faceapi.createCanvasFromMedia(img);
    const displaySize = { width: img.width, height: img.height };
    faceapi.matchDimensions(temp, displaySize);

    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const results = resizedDetections.map((d: any) =>
      faceMatcher.findBestMatch(d.descriptor)
    );
    return results;
  } catch (err) {
    return false;
  }
}

const base64ToBlob = (base64Data: string) => {
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
  } catch (_) {
    return false;
  }
};

const convertBlobToHtmlImageElement = async (blob: Blob): Promise<any> => {
  try {
    const imgBuffer = await blob.arrayBuffer();
    const imgData = Buffer.from(imgBuffer);
    return await canvas.loadImage(imgData);
  } catch (error) {
    throw error;
  }
};

// [info]: controllers
const check_face_controller = async (req: Request, res: Response) => {
  // [info]: return validation error message
  const errors = validationResult(req);
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
  let result = await compareDescriptors(blob, description, label);
  if (result) {
    res.json({ error: false, result });
  } else {
    res.json({
      error: true,
      message: "Something went wrong comparing your descriptor.",
    });
  }
};

const post_face_controller = async (req: Request, res: Response) => {
  try {
    // [info]: return validation error message
    const errors = validationResult(req);
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
    let result = await getImageDescriptor([blob], label);
    if (result) {
      return res.status(200).json({ error: false, description: result });
    } else {
      return res.status(200).json({
        error: true,
        message: "No descriptors found for the provided image.",
      });
    }
  } catch (error) {
    return res
      .status(200)
      .json({ error: true, message: `Something went wrong! ${error}.` });
  }
};

export { post_face_controller, check_face_controller };
