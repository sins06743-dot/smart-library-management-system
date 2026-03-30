import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchRecommendations = createAsyncThunk(
  "recommendations/fetchPersonalized",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/recommendations");
      return data.recommendations;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch recommendations");
    }
  }
);

export const fetchPopularBooks = createAsyncThunk(
  "recommendations/fetchPopular",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/recommendations/popular");
      return data.books;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch popular books");
    }
  }
);

export const fetchTrendingBooks = createAsyncThunk(
  "recommendations/fetchTrending",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/recommendations/trending");
      return data.books;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch trending books");
    }
  }
);

const recommendationSlice = createSlice({
  name: "recommendations",
  initialState: {
    recommendations: [],
    popular: [],
    trending: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRecommendations.fulfilled, (state, action) => { state.loading = false; state.recommendations = action.payload; })
      .addCase(fetchRecommendations.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchPopularBooks.pending, (state) => { state.loading = true; })
      .addCase(fetchPopularBooks.fulfilled, (state, action) => { state.loading = false; state.popular = action.payload; })
      .addCase(fetchPopularBooks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchTrendingBooks.pending, (state) => { state.loading = true; })
      .addCase(fetchTrendingBooks.fulfilled, (state, action) => { state.loading = false; state.trending = action.payload; })
      .addCase(fetchTrendingBooks.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default recommendationSlice.reducer;
