import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchBookReviews = createAsyncThunk(
  "reviews/fetchBookReviews",
  async ({ bookId, page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reviews/${bookId}?page=${page}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async ({ bookId, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/reviews/${bookId}`, { rating, comment });
      return data.review;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add review");
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ reviewId, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/reviews/${reviewId}`, { rating, comment });
      return data.review;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update review");
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return reviewId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete review");
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    total: 0,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookReviews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBookReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchBookReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews = [action.payload, ...state.reviews];
        state.total += 1;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.map((r) =>
          r._id === action.payload._id ? action.payload : r
        );
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
        state.total -= 1;
      });
  },
});

export default reviewSlice.reducer;
