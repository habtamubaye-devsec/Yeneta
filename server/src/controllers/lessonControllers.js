import Lesson from "../models/lesson.js";
import Course from "../models/Course.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

// Create Lesson (text + file resources)
export const createLesson = async (req, res) => {
  try {
    console.log("📩 Incoming createLesson request:", req.body);

    const course = req.params.courseId;
    const { title, position, textResources } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Lesson title is required",
      });
    }

    // Parse text resources if sent as JSON string
    let parsedTextResources = [];
    if (textResources) {
      parsedTextResources = Array.isArray(textResources)
        ? textResources
        : JSON.parse(textResources);
    }

    let fileResources = [];

    if (req.files && req.files.length > 0) {
      console.log(`📂 Uploading ${req.files.length} files to Cloudinary...`);

      for (const file of req.files) {
        try {
          // auto handles image/video/pdf
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: "lessons",
          });

          // Safely delete temporary file
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }

          fileResources.push({
            title: file.originalname,
            subtitle: "",
            content: uploadResult.secure_url,
            type: file.mimetype.startsWith("video/")
              ? "video"
              : file.mimetype.startsWith("image/")
              ? "image"
              : "pdf",
            position: fileResources.length + 1,
          });
        } catch (uploadErr) {
          console.error("⚠️ Cloudinary upload failed:", uploadErr.message);
          throw uploadErr;
        }
      }
    }

    // Combine text and file resources
    const allResources = [...fileResources];
    parsedTextResources.forEach((tr, index) => {
      allResources.push({
        content: tr.content,
        type: "text",
        position: allResources.length + 1,
      });
    });

    const lesson = new Lesson({
      course,
      title,
      position: position || 0,
      resources: allResources,
    });

    await lesson.save();

    await Course.findByIdAndUpdate(course, { $push: { lessons: lesson._id } });

    res.status(201).json({ success: true, lesson });
  } catch (error) {
    console.error("💥 Error in createLesson:", error.stack || error.message || error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// Get all lessons by course
export const getAllLessons = async (req, res) => {
  try {
    const filter = req.params.courseId ? { course: req.params.courseId } : {};
    const lessons = await Lesson.find(filter).sort("position");
    res.status(200).json({ success: true, lessons });
  } catch (error) {
    console.error("Error in getAllLessons:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single lesson
export const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson)
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    res.status(200).json({ success: true, lesson });
  } catch (error) {
    console.error("Error in getLesson:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update lesson
export const updateLesson = async (req, res) => {
  try {
    const { title, position, textResources } = req.body;

    let parsedTextResources = [];
    if (textResources) {
      parsedTextResources = Array.isArray(textResources)
        ? textResources
        : JSON.parse(textResources);
    }

    let fileResources = [];
    if (req.files && req.files.length > 0) {
      fileResources = req.files.map((file, index) => ({
        title: file.originalname,
        subtitle: "",
        content: file.path,
        type: file.mimetype.startsWith("video/")
          ? "video"
          : file.mimetype.startsWith("image/")
          ? "image"
          : "other",
        position: index + 1,
      }));
    }

    const allResources = [...fileResources];
    parsedTextResources.forEach((tr, index) => {
      allResources.push({
        title: tr.title || `Text Resource ${index + 1}`,
        subtitle: tr.subtitle || "",
        content: tr.content,
        type: "text",
        position: allResources.length + 1,
      });
    });

    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { title, position, resources: allResources },
      { new: true }
    );

    if (!lesson)
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });

    res.status(200).json({ success: true, lesson });
  } catch (error) {
    console.error("Error in updateLesson:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete lesson
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson)
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    res.status(200).json({ success: true, message: "Lesson deleted" });
  } catch (error) {
    console.error("Error in deleteLesson:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
