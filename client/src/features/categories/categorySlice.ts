import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from "./categoryThunks";

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    setSelectedCategory: (state, action: PayloadAction<Category>) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.categories = state.categories.map((cat) =>
          cat._id === action.payload._id ? action.payload : cat
        );
        if (state.selectedCategory && state.selectedCategory._id === action.payload._id) {
          state.selectedCategory = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.categories = state.categories.filter((cat) => cat._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedCategory, setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
