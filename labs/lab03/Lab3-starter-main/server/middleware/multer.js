import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allowed file types (images only)
const allowedFileTypes = /jpeg|jpg|png|gif/;

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, JPG, PNG, GIF) are allowed"), false);
  }
};

// Multer upload instance with limits and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

export default upload;
