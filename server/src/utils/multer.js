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