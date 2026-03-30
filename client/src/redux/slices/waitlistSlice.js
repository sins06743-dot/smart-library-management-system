import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const joinWaitlist = createAsyncThunk(
  "waitlist/join",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/waitlist/${bookId}`);
      return data.entry;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to join waitlist");
    }
  }
);

export const leaveWaitlist = createAsyncThunk(
  "waitlist/leave",
  async (bookId, { rejectWithValue }) => {
    try {
      await api.delete(`/waitlist/${bookId}`);
      return bookId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to leave waitlist");
    }
  }
);

export const fetchMyWaitlist = createAsyncThunk(
  "waitlist/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/waitlist/my");
      return data.entries;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch waitlist");
    }
  }
);

export const fetchBookWaitlistPosition = createAsyncThunk(
  "waitlist/fetchPosition",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/waitlist/${bookId}/position`);
      return { bookId, ...data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch position");
    }
  }
);

const waitlistSlice = createSlice({
  name: "waitlist",
  initialState: {
    myWaitlist: [],
    positions: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyWaitlist.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyWaitlist.fulfilled, (state, action) => { state.loading = false; state.myWaitlist = action.payload; })
      .addCase(fetchMyWaitlist.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(joinWaitlist.fulfilled, (state, action) => {
        if (action.payload) state.myWaitlist.push(action.payload);
      })
      .addCase(leaveWaitlist.fulfilled, (state, action) => {
        state.myWaitlist = state.myWaitlist.filter(
          (e) => e.book?._id !== action.payload
        );
        delete state.positions[action.payload];
      })
      .addCase(fetchBookWaitlistPosition.fulfilled, (state, action) => {
        state.positions[action.payload.bookId] = action.payload;
      });
  },
});

export default waitlistSlice.reducer;
