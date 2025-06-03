// middleware/multer.js
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    callback(null, true);
  } else {
    callback(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

export default upload;
