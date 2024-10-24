import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export default upload;

// Auto change for Thu Oct 24 2024 03:00:00 GMT+0300 (East Africa Time)