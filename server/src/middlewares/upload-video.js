import multer from "multer";

const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage });

export default upload;

// Auto change for Fri Oct 25 2024 03:00:00 GMT+0300 (East Africa Time)