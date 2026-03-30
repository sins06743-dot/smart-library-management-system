import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchMyStats = createAsyncThunk(
  "analytics/fetchMyStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/my-stats");
      return data.stats;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch stats");
    }
  }
);

export const fetchMonthlyData = createAsyncThunk(
  "analytics/fetchMonthly",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/my-monthly");
      return data.monthlyData;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch monthly data");
    }
  }
);

export const fetchCategoryData = createAsyncThunk(
  "analytics/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/my-categories");
      return data.categoryData;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch category data");
    }
  }
);

export const fetchStreakData = createAsyncThunk(
  "analytics/fetchStreak",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/my-streak");
      return data.streakData;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch streak data");
    }
  }
);

export const fetchTopAuthors = createAsyncThunk(
  "analytics/fetchTopAuthors",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/my-authors");
      return data.authors;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch top authors");
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    stats: null,
    monthlyData: [],
    categoryData: [],
    streakData: {},
    topAuthors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyStats.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
      .addCase(fetchMyStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMonthlyData.fulfilled, (state, action) => { state.monthlyData = action.payload; })
      .addCase(fetchCategoryData.fulfilled, (state, action) => { state.categoryData = action.payload; })
      .addCase(fetchStreakData.fulfilled, (state, action) => { state.streakData = action.payload; })
      .addCase(fetchTopAuthors.fulfilled, (state, action) => { state.topAuthors = action.payload; });
  },
});

export default analyticsSlice.reducer;
