import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyRecords,
  returnBook,
  clearBorrowState,
} from "../../redux/slices/borrowSlice";
import { getMyWaitlist, leaveWaitlist } from "../../redux/slices/waitlistSlice";
import BorrowCard from "../../components/borrow/BorrowCard";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import { Link } from "react-router-dom";
import { Clock, Trash2 } from "lucide-react";

const MyBooks = () => {
  const dispatch = useDispatch();
  const { myRecords, loading, error, message } = useSelector((state) => state.borrow);
  const { myWaitlist } = useSelector((state) => state.waitlist);

  useEffect(() => {
    dispatch(getMyRecords());
    dispatch(getMyWaitlist());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBorrowState());
    }
    if (message) {
      toast.success(message);
      dispatch(clearBorrowState());
      dispatch(getMyRecords());
    }
  }, [error, message, dispatch]);

  const handleReturn = async (borrowId) => {
    if (window.confirm("Are you sure you want to return this book?")) {
      const result = await dispatch(returnBook(borrowId));
      if (result.meta.requestStatus === "fulfilled") {
        const fine = result.payload.fine;
        if (fine > 0) {
          toast.success(`Book returned! A fine of ₹${fine} has been charged.`);
        } else {
          toast.success("Book returned successfully! No fine charged.");
        }
      }
    }
  };

  const handleLeaveWaitlist = async (bookId) => {
    const result = await dispatch(leaveWaitlist(bookId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Removed from waitlist");
      dispatch(getMyWaitlist());
    } else {
      toast.error(result.payload || "Failed to leave waitlist");
    }
  };

  const activeBorrows = myRecords.filter((r) => r.status === "borrowed");
  const returnedBooks = myRecords.filter((r) => r.status === "returned");

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-2xl font-bold text-white mb-8">My Books</h1>

        {/* Currently Borrowed */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            Currently Borrowed ({activeBorrows.length})
          </h2>
          {activeBorrows.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBorrows.map((record) => (
                <BorrowCard key={record._id} record={record} onReturn={handleReturn} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center text-gray-500">
              You have no books currently borrowed.
            </div>
          )}
        </section>

        {/* Waitlist */}
        {myWaitlist.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              My Waitlist ({myWaitlist.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myWaitlist.map((entry) => (
                <div
                  key={entry._id}
                  className="glass-card p-4 flex items-center gap-4 border-amber-500/10"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/books/${entry.book?._id}`}
                      className="font-semibold text-white hover:text-violet-400 text-sm line-clamp-2 transition-colors"
                    >
                      {entry.book?.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">
                      by {entry.book?.author}
                    </p>
                    <p className="text-xs text-amber-400 font-semibold mt-1">
                      Queue position: #{entry.position}
                    </p>
                  </div>
                  <button
                    onClick={() => handleLeaveWaitlist(entry.book?._id)}
                    className="text-red-400 hover:text-red-300 flex-shrink-0 transition-colors"
                    title="Leave waitlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Return History */}
        <section>
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            Return History ({returnedBooks.length})
          </h2>
          {returnedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {returnedBooks.map((record) => (
                <BorrowCard key={record._id} record={record} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center text-gray-500">
              No return history yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyBooks;
