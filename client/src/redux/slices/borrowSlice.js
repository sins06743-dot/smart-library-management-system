import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Async thunks for borrow operations

export const issueBook = createAsyncThunk(
  "borrow/issue",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/borrow/issue", { bookId });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to issue book");
    }
  }
);

export const returnBook = createAsyncThunk(
  "borrow/return",
  async (borrowId, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/borrow/return/${borrowId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to return book");
    }
  }
);

export const getMyRecords = createAsyncThunk(
  "borrow/myRecords",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/borrow/my-records");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch records");
    }
  }
);

export const getAllRecords = createAsyncThunk(
  "borrow/allRecords",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/borrow/records");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch all records");
    }
  }
);

export const getOverdueRecords = createAsyncThunk(
  "borrow/overdueRecords",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/borrow/overdue");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch overdue records");
    }
  }
);

export const returnByQR = createAsyncThunk(
  "borrow/returnByQR",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/borrow/return-by-qr", { bookId });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to return book");
    }
  }
);

// Borrow slice
const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    records: [],
    myRecords: [],
    overdueRecords: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearBorrowState: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Issue Book
    builder
      .addCase(issueBook.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(issueBook.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.myRecords.unshift(action.payload.borrow);
      })
      .addCase(issueBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Return Book
    builder
      .addCase(returnBook.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(returnBook.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // Update record status in myRecords
        state.myRecords = state.myRecords.map((rec) =>
          rec._id === action.payload.borrow._id ? action.payload.borrow : rec
        );
        state.records = state.records.map((rec) =>
          rec._id === action.payload.borrow._id ? action.payload.borrow : rec
        );
      })
      .addCase(returnBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get My Records
    builder
      .addCase(getMyRecords.pending, (state) => { state.loading = true; })
      .addCase(getMyRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.myRecords = action.payload.records;
      })
      .addCase(getMyRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get All Records
    builder
      .addCase(getAllRecords.pending, (state) => { state.loading = true; })
      .addCase(getAllRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.records;
      })
      .addCase(getAllRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Overdue Records
    builder
      .addCase(getOverdueRecords.pending, (state) => { state.loading = true; })
      .addCase(getOverdueRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.overdueRecords = action.payload.records;
      })
      .addCase(getOverdueRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Return by QR
    builder
      .addCase(returnByQR.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(returnByQR.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(returnByQR.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBorrowState } = borrowSlice.actions;
export default borrowSlice.reducer;
