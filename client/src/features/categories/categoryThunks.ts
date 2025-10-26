import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Category {
  _id?: string;
  name: string;
  description?: string;
  subcategories?: string[];
}

const API_URL = "http://localhost:8000/api/categories"; // Adjust as needed

// ✅ Fetch all categories
export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.data; // assuming { success, data }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
    }
  }
);

// ✅ Fetch single category by ID
export const fetchCategoryById = createAsyncThunk<Category, string>(
  "categories/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch category");
    }
  }
);

// ✅ Create new category
export const createCategory = createAsyncThunk<Category, Category>(
  "categories/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create category");
    }
  }
);

// ✅ Update existing category (including subcategories)
export const updateCategory = createAsyncThunk<
  Category,
  { id: string; updates: Partial<Category> }
>(
  "categories/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(`${API_URL}/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update category");
    }
  }
);

// ✅ Delete category
export const deleteCategory = createAsyncThunk<string, string>(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete category");
    }
  }
);
