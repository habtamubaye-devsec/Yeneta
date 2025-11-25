import Category from "../models/catagory.js";

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name, description, subCategories } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      description,
      subCategories: Array.isArray(subCategories) ? subCategories : [],
    });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/categories/:id
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const { name, description, subCategories } = req.body;
    
    const updatedData = {};
    if (name) updatedData.name = name;
    if (description) updatedData.description = description;
    if (Array.isArray(subCategories)) updatedData.subCategories = subCategories;

    const category = await Category.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
