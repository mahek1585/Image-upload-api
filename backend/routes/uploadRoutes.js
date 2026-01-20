const express = require("express");
const multer = require("multer");
const path = require("path");
const File = require("../models/File");

const router = express.Router();

/* ---------- Multer Storage ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

/* ---------- File Filter (Only Images) ---------- */
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

/* ---------- Multer Upload ---------- */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
});

/* ---------- Upload API ---------- */
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newFile = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });

    await newFile.save();

    res.status(201).json({
      message: "Image uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    res.status(500).json({
      message: "File upload failed",
      error: error.message,
    });
  }
});

module.exports = router;
