"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const AuthController_1 = require("../controller/api/AuthController");
// Validations
const validatePostFace = [
    (0, express_validator_1.check)("label").notEmpty().withMessage("label is required"),
    (0, express_validator_1.check)("image").notEmpty().withMessage("image is required"),
];
const validateCheckFace = [
    (0, express_validator_1.check)("label").notEmpty().withMessage("label is required"),
    (0, express_validator_1.check)("image").notEmpty().withMessage("image is required"),
    (0, express_validator_1.check)("description")
        .notEmpty()
        .withMessage("description is required")
        .isArray()
        .withMessage("description must be an array"),
];
// Auth Routes
router.post("/post-face", validatePostFace, AuthController_1.post_face_controller);
router.post("/check-face", validateCheckFace, AuthController_1.check_face_controller);
exports.default = router;
