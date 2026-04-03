import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRecords,
  getOverdueRecords,
  returnBook,
  clearBorrowState,
} from "../../redux/slices/borrowSlice";
import Sidebar from "../../components/layout/Sidebar";
import BorrowTable from "../../components/borrow/BorrowTable";
import toast from "react-hot-toast";

const BorrowRecords = () => {
  const dispatch = useDispatch();
  const { records, overdueRecords, loading, error, message } = useSelector(
    (state) => state.borrow
  );
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getAllRecords());
    dispatch(getOverdueRecords());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBorrowState());
    }
    if (message) {
      toast.success(message);
      dispatch(clearBorrowState());
    }
  }, [error, message, dispatch]);

  const handleReturn = async (borrowId) => {
    const result = await dispatch(returnBook(borrowId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(`Book returned! Fine: ₹${result.payload.fine}`);
      dispatch(getAllRecords());
      dispatch(getOverdueRecords());
    }
  };

  const getFilteredRecords = () => {
    const today = new Date();
    switch (filter) {
      case "borrowed":
        return records.filter((r) => r.status === "borrowed");
      case "returned":
        return records.filter((r) => r.status === "returned");
      case "overdue":
        return records.filter(
          (r) => r.status === "borrowed" && new Date(r.returnDate) < today
        );
      default:
        return records;
    }
  };

  const filteredRecords = getFilteredRecords();

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="font-heading text-2xl font-bold text-white mb-6">Borrow Records</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "all", label: `All (${records.length})` },
            { key: "borrowed", label: `Borrowed (${records.filter((r) => r.status === "borrowed").length})` },
            { key: "returned", label: `Returned (${records.filter((r) => r.status === "returned").length})` },
            { key: "overdue", label: `Overdue (${overdueRecords.length})`, danger: true },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === tab.key
                  ? tab.danger
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                  : tab.danger
                  ? "bg-red-500/5 text-red-400/60 hover:bg-red-500/10 border border-white/5"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Borrow Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <BorrowTable
            records={filteredRecords}
            onReturn={handleReturn}
            showUser={true}
            isAdmin={true}
          />
        )}
      </div>
    </div>
  );
};

export default BorrowRecords;
