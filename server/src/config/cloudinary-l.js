import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Create a storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lessons", // folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "mp4"],
  },
});

// ✅ Multer upload middleware
const upload = multer({ storage });

export { cloudinary, upload };

// Auto change for Sat Nov 02 2024 03:00:00 GMT+0300 (East Africa Time)