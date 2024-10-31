import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "lessons";
    if (file.mimetype.startsWith("image/")) folder += "/images";
    if (file.mimetype.startsWith("video/")) folder += "/videos";

    return {
      folder: folder,
      resource_type: file.mimetype.startsWith("video/") ? "video" : "auto",
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

export const parser = multer({ storage });
// Auto change for Thu Oct 24 2024 03:00:00 GMT+0300 (East Africa Time)
// Auto change for Thu Oct 31 2024 03:00:00 GMT+0300 (East Africa Time)