import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { issueBook } from "../../redux/slices/borrowSlice";
import { joinWaitlist, leaveWaitlist, getWaitlistPosition } from "../../redux/slices/waitlistSlice";
import toast from "react-hot-toast";
import { FiBookOpen, FiStar, FiClock } from "react-icons/fi";
import { BookQRCode } from "./QRScanner";

// Individual book display card
const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.borrow);
  const { positions, loading: wlLoading } = useSelector((state) => state.waitlist);

  const position = positions[book._id];

  useEffect(() => {
    if (isAuthenticated && user?.role === "member" && !book.availability) {
      dispatch(getWaitlistPosition(book._id));
    }
  }, [dispatch, book._id, book.availability, isAuthenticated, user]);

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

  const handleJoinWaitlist = async () => {
    const result = await dispatch(joinWaitlist(book._id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(result.payload.message);
    } else {
      toast.error(result.payload || "Failed to join waitlist");
    }
  };

  const handleLeaveWaitlist = async () => {
    const result = await dispatch(leaveWaitlist(book._id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Removed from waitlist");
    } else {
      toast.error(result.payload || "Failed to leave waitlist");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Book cover image - links to detail page */}
      <Link to={`/books/${book._id}`} className="block">
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
      </Link>

      <div className="p-4">
        {/* Category badge */}
        <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full mb-2">
          {book.category}
        </span>

        <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 line-clamp-2">
          <Link to={`/books/${book._id}`} className="hover:text-indigo-600 transition-colors">
            {book.title}
          </Link>
        </h3>
        <p className="text-gray-500 text-sm mb-1">by {book.author}</p>

        {/* Star rating */}
        {book.totalReviews > 0 && (
          <div className="flex items-center gap-1 text-xs text-yellow-500 mb-2">
            <FiStar className="fill-yellow-400" />
            <span className="font-semibold">{book.averageRating?.toFixed(1)}</span>
            <span className="text-gray-400">({book.totalReviews})</span>
          </div>
        )}

        {/* ISBN */}
        <p className="text-xs text-gray-400 mb-3">ISBN: {book.ISBN}</p>

        {/* Availability badge */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              book.availability
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {book.availability ? "Available" : "Borrowed"}
          </span>

          {/* Borrow button for available books */}
          {isAuthenticated && user?.role === "member" && book.availability && (
            <button
              onClick={handleBorrow}
              disabled={loading}
              className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Borrow"}
            </button>
          )}

          {/* Waitlist buttons for unavailable books */}
          {isAuthenticated && user?.role === "member" && !book.availability && (
            <>
              {position?.onWaitlist ? (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                    <FiClock /> #{position.position} in queue
                  </span>
                  <button
                    onClick={handleLeaveWaitlist}
                    disabled={wlLoading}
                    className="text-xs text-red-500 hover:underline disabled:opacity-50"
                  >
                    Leave waitlist
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleJoinWaitlist}
                  disabled={wlLoading}
                  className="bg-orange-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {wlLoading ? "..." : "Join Waitlist"}
                </button>
              )}
            </>
          )}
        </div>

        {/* QR code for admins */}
        {isAuthenticated && user?.role === "admin" && (
          <BookQRCode book={book} />
        )}
      </div>
    </div>
  );
};

export default BookCard;
