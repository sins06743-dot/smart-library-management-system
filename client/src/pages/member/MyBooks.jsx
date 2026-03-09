import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyRecords,
  returnBook,
  clearBorrowState,
} from "../../redux/slices/borrowSlice";
import BorrowCard from "../../components/borrow/BorrowCard";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";

const MyBooks = () => {
  const dispatch = useDispatch();
  const { myRecords, loading, error, message } = useSelector((state) => state.borrow);

  useEffect(() => {
    dispatch(getMyRecords());
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

  const activeBorrows = myRecords.filter((r) => r.status === "borrowed");
  const returnedBooks = myRecords.filter((r) => r.status === "returned");

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">My Books</h1>

      {/* Currently Borrowed */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Currently Borrowed ({activeBorrows.length})
        </h2>
        {activeBorrows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBorrows.map((record) => (
              <BorrowCard key={record._id} record={record} onReturn={handleReturn} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400">
            You have no books currently borrowed.
          </div>
        )}
      </section>

      {/* Return History */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Return History ({returnedBooks.length})
        </h2>
        {returnedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {returnedBooks.map((record) => (
              <BorrowCard key={record._id} record={record} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400">
            No return history yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default MyBooks;
