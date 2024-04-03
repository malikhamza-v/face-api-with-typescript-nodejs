import express from "express";
import { check } from "express-validator";
const router = express.Router();
import {
  post_face_controller,
  check_face_controller,
} from "../controller/api/AuthController";

// Validations
const validatePostFace = [
  check("label").notEmpty().withMessage("label is required"),
  check("image").notEmpty().withMessage("image is required"),
];

const validateCheckFace = [
  check("label").notEmpty().withMessage("label is required"),
  check("image").notEmpty().withMessage("image is required"),
  check("description")
    .notEmpty()
    .withMessage("description is required")
    .isArray()
    .withMessage("description must be an array"),
];

// Auth Routes
router.post("/post-face", validatePostFace, post_face_controller);
router.post("/check-face", validateCheckFace, check_face_controller);

export default router;
