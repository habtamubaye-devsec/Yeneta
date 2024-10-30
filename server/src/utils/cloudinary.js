import { v2 as cloudinary } from "cloudinary";

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("✅ Cloudinary configured successfully");
} catch (error) {
  console.error("❌ Cloudinary configuration error:", error.message);
}

export default cloudinary;
// Auto change for Wed Oct 30 2024 03:00:00 GMT+0300 (East Africa Time)