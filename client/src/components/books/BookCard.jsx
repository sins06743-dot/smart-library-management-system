import { useDispatch, useSelector } from "react-redux";
import { issueBook } from "../../redux/slices/borrowSlice";
import toast from "react-hot-toast";
import { FiBookOpen } from "react-icons/fi";

// Individual book display card
const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.borrow);

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to borrow books");
      return;
    }
    const result = await dispatch(issueBook(book._id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Book borrowed successfully!");
    } else {
      toast.error(result.payload || "Failed to borrow book");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Book cover image */}
      <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <FiBookOpen className="text-5xl text-indigo-400" />
        )}
      </div>

      <div className="p-4">
        {/* Category badge */}
        <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full mb-2">
          {book.category}
        </span>

        <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-gray-500 text-sm mb-3">by {book.author}</p>

        {/* ISBN */}
        <p className="text-xs text-gray-400 mb-3">ISBN: {book.ISBN}</p>

        {/* Availability badge */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              book.availability
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {book.availability ? "Available" : "Borrowed"}
          </span>

          {/* Borrow button - shown to logged-in members */}
          {isAuthenticated && user?.role === "member" && book.availability && (
            <button
              onClick={handleBorrow}
              disabled={loading}
              className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Borrow"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
