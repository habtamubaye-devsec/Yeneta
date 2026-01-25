import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api";

export interface Category {
  _id?: string;
  name: string;
  description?: string;
  subCategories?: string[];
}

const API_URL = "/api/categories";

// ✅ Fetch all categories
export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL);
      return response.data.data; // { success, data }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
    }
  }
);

// ✅ Fetch category by ID
export const fetchCategoryById = createAsyncThunk<Category, string>(
  "categories/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch category");
    }
  }
);

// ✅ Create category
export const createCategory = createAsyncThunk<Category, Category>(
  "categories/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(API_URL, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log(categoryData)
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create category");
    }
  }
);

// ✅ Update category
export const updateCategory = createAsyncThunk<
  Category,
  { id: string; updates: Partial<Category> }
>("categories/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.patch(`${API_URL}/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to update category");
  }
});

// ✅ Delete category
export const deleteCategory = createAsyncThunk<string, string>(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete category");
    }
  }
);
