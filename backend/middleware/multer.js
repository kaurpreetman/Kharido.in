import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // Specify the folder where files will be stored
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    // Use original file name with a timestamp to avoid conflicts
    const uniqueName = `${Date.now()}-${file.originalname}`;
    callback(null, uniqueName);
  },
});

const fileFilter = (req, file, callback) => {
  // Accept only specific file types (e.g., images)
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    callback(null, true); // Accept file
  } else {
    callback(new Error("Unsupported file type"), false); // Reject file
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter,
});

export default upload;
