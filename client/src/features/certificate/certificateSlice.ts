// src/redux/slices/certificateSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL
const API_BASE = "http://localhost:8000/api/certificate";

// Fetch all certificates for the logged-in user
export const fetchCertificates = createAsyncThunk(
  "certificates/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/my-certificates`, {
        withCredentials: true,
      });
      return res.data.data; // array of certificates
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Download or view a single certificate PDF
export const downloadCertificate = createAsyncThunk(
  "certificates/download",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/${courseId}/certificate`, {
        responseType: "blob", // expect PDF file
        withCredentials: true,
      });

      // Create blob URL
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Automatically download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${courseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Return blob URL in case you want to view
      return { courseId, url };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const certificateSlice = createSlice({
  name: "certificates",
  initialState: {
    items: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch certificates
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Download certificate
      .addCase(downloadCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadCertificate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default certificateSlice.reducer;
