const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Middleware imports (ensure path is correct)
const { verifyToken } = require("../middlewares/verifyToken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images")); // Stores in project_root/images
  },
  filename: function (req, file, cb) {
    // FIX: Use file.originalname instead of file.filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedOriginalname = file.originalname.replace(
      /[^a-zA-Z0-9\.]/g,
      "-"
    ); // Sanitize special chars
    cb(null, uniqueSuffix + "-" + sanitizedOriginalname);
  },
});

const upload = multer({ storage });

// Add middleware for authentication (example using verifyToken)
router.post("/", upload.single("image"), (req, res) => {
  res.json({ message: "Image uploaded successfully" });
});

module.exports = router;
