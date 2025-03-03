import express from "express";
import fs from "fs";
import path from "path";
import _ from "lodash";
import { fileURLToPath } from "url"; // for file path

const router = express.Router();

// Grab the current directory for this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
const upload_directory = path.join(__dirname, "../uploads");

router.get("/single", (req, res) => {
  let files_array = fs.readdirSync(upload_directory);
  
  if (files_array.length === 0) {
    return res.status(503).send({ message: "No images" });
  }

  let filename = _.sample(files_array);
  res.sendFile(path.join(upload_directory, filename));
});

router.get("/multiple", (req, res) => {
  let files_array = fs.readdirSync(upload_directory);
  
  if (files_array.length === 0) {
    return res.status(503).send({ message: "No images" });
  }

  let filenames = _.sampleSize(files_array, 3);

  // Instead of sendFile (which only works for one file), send a JSON response with file URLs
  res.json({
    message: "Images retrieved successfully",
    filePaths: filenames.map(file => `/uploads/${file}`),
  });
});

// Route to retrieve a specific file by filename
router.get("/file/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(upload_directory, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send({ message: "File not found" });
  }

  res.sendFile(filePath);
});

export default router;
