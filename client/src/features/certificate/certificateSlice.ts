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
// Fetch PDF blob and return URL for viewing; do NOT auto-download.
export const downloadCertificate = createAsyncThunk(
  "certificates/fetchPdf",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/${courseId}/certificate`, {
        responseType: "blob",
        withCredentials: true,
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      return { courseId, url };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Explicitly download the certificate file (forces a download in the browser)
export const downloadCertificateFile = createAsyncThunk(
  "certificates/downloadFile",
  async (
    payload: { courseId: string; filename?: string },
    { rejectWithValue }
  ) => {
    const { courseId, filename } = payload;
    try {
      // Call endpoint with download=true so server sets Content-Disposition: attachment
      const response = await axios.get(`${API_BASE}/${courseId}/certificate?download=true`, {
        responseType: "blob",
        withCredentials: true,
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      // if client provided a filename use it, otherwise default to certificate-<id>.pdf
      const downloadName = filename
        ? filename
        : `certificate-${courseId}.pdf`;
      link.setAttribute("download", downloadName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Return URL for any display if needed
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
      // explicit download thunk
      builder
        .addCase(downloadCertificateFile.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(downloadCertificateFile.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(downloadCertificateFile.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
  },
});

export default certificateSlice.reducer;
