import Lesson from "../models/lesson.js";
import Course from "../models/Course.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

// Create Lesson (text + file resources)
/**
 * @desc Create a new lesson under a specific course
 * @route POST /api/courses/:courseId/lessons
 * @access Private (Instructor, Admin)
 */
export const createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, position } = req.body;
    const file = req.file; // "resources" file from upload.single("resources")

    console.log("🎬 Incoming createLesson:", { courseId, title, description, position });
    console.log("📁 Uploaded file:", file?.originalname);

    // ✅ Validate
    if (!title || !description || !position || !file) {
      return res.status(400).json({
        success: false,
        message: "All fields (title, description, position, video) are required.",
      });
    }

    // ✅ Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "video", folder: "lessons_videos" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const result = await uploadPromise;
    console.log("✅ Cloudinary upload success:", result.secure_url);

    // ✅ Save lesson to DB
    const lesson = await Lesson.create({
      course: courseId,
      title,
      description,
      position,
      videoUrl: result.secure_url,
      videoPublicId: result.public_id,
      videoDuration: result.duration,
    });

    // ✅ Push lesson ID to the course.lessons array
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { lessons: lesson._id } },
      { new: true, useFindAndModify: false }
    );
    
    res.status(201).json({
      success: true,
      message: "Lesson created successfully.",
      data: lesson,
      duration: result.duration,
    });
  } catch (error) {
    console.error("❌ createLesson error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating lesson.",
      error: error.message,
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
