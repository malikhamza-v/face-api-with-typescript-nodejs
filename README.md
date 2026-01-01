# Face API with TypeScript & Node.js

A Face Recognition API server built with TypeScript, Node.js, and Express. Provides face detection and recognition capabilities using pre-trained machine learning models.

## Features

- **Face Registration** - Extract and store face descriptors from images
- **Face Verification** - Verify if a face matches registered descriptors
- **Pre-trained ML Models** - Uses SSD MobileNet, Face Landmark 68, and Face Recognition models
- **REST API** - Simple JSON-based API endpoints
- **TypeScript** - Fully typed codebase for better developer experience

## Tech Stack

| Component | Library |
|-----------|---------|
| Web Framework | Express.js |
| Language | TypeScript |
| Face Recognition | face-api.js v0.22.2 |
| ML Backend | TensorFlow.js (Node.js) |
| Image Processing | canvas v2.11.2 |
| Validation | express-validator |

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd face-api-with-typescript-nodejs
```

2. Install dependencies:
```bash
npm install
```

3. Ensure the `models` directory exists with pre-trained models:
```
src/models/
├── face_recognition_model-weights_manifest.json
├── face_landmark_68_model-weights_manifest.json
└── ssd_mobilenetv1_model-weights_manifest.json
```

## Usage

### Development

Run with hot-reload using nodemon:
```bash
npm run dev
```

### Production

Build the TypeScript code:
```bash
npm run build
```

Run the compiled server:
```bash
npm run serve
```

Or directly with ts-node:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Register a Face

Extract and store a face descriptor from an image.

**Endpoint:** `POST /api/post-face`

**Request Body:**
```json
{
  "label": "John Doe",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
}
```

**Response:**
```json
{
  "error": false,
  "description": [[0.1, 0.2, 0.3, ...]] // 128-dimensional descriptor
}
```

### Verify a Face

Check if a face matches registered descriptors.

**Endpoint:** `POST /api/check-face`

**Request Body:**
```json
{
  "label": "John Doe",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...",
  "description": [
    [0.1, 0.2, 0.3, ...], // descriptor 1
    [0.15, 0.25, 0.35, ...] // descriptor 2
  ]
}
```

**Response:**
```json
{
  "error": false,
  "result": [
    {
      "label": "John Doe",
      "distance": 0.35
    }
  ]
}
```

**Matching Threshold:** Faces with a distance <= 0.6 are considered a match.

## How It Works

1. **Image Processing** - Base64 images are converted to Canvas-compatible format
2. **Face Detection** - SSD MobileNet v1 detects faces in the image
3. **Landmark Detection** - Identifies 68 facial points (eyes, nose, mouth, jawline)
4. **Descriptor Extraction** - Neural network generates a 128-dimensional feature vector
5. **Face Matching** - Uses Euclidean distance to compare descriptors

## Project Structure

```
face-api-with-typescript-nodejs/
├── src/
│   ├── index.ts                    # Main entry point & server setup
│   ├── routes/
│   │   └── index.ts                # API route definitions
│   ├── controller/
│   │   └── api/
│   │       └── AuthController.ts   # Core business logic
│   └── models/                     # Pre-trained ML models (~13MB)
├── dist/                           # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── biome.json                      # Linting configuration
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run with ts-node |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run serve` | Run compiled code |
| `npm run dev` | Run with nodemon (auto-restart) |
| `npm run check` | Lint code with Biome |
| `npm run format` | Format code with Biome |

## Use Cases

- User authentication via facial recognition
- Attendance tracking systems
- Access control systems
- Photo organization/tagging
- Identity verification services

## Configuration

- **Port:** 3000 (configurable in `src/index.ts`)
- **Body Limit:** 50MB (for large base64 images)
- **Match Threshold:** 0.6 Euclidean distance

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
