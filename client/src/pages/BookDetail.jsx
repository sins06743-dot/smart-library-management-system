import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBookById } from "../redux/slices/bookSlice";
import { issueBook } from "../redux/slices/borrowSlice";
import BookReviews from "../components/books/BookReviews";
import { BookQRCode } from "../components/books/QRScanner";
import WaitlistButton from "../components/books/WaitlistButton";
import toast from "react-hot-toast";
import { FiBookOpen, FiArrowLeft, FiStar } from "react-icons/fi";
import Loader from "../components/common/Loader";

const BookDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { book, loading } = useSelector((state) => state.books);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { loading: borrowLoading } = useSelector((state) => state.borrow);

  useEffect(() => {
    dispatch(getBookById(id));
  }, [dispatch, id]);

  const handleBorrow = async () => {
    const result = await dispatch(issueBook(book._id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Book borrowed successfully!");
      dispatch(getBookById(id));
    } else {
      toast.error(result.payload || "Failed to borrow book");
    }
  };

  if (loading) return <Loader />;
  if (!book) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-indigo-600 hover:underline mb-6 text-sm"
      >
        <FiArrowLeft /> Back to Catalog
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Cover */}
          <div className="h-64 md:h-auto bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <FiBookOpen className="text-7xl text-indigo-400" />
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-2 p-8">
            <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
              {book.category}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{book.title}</h1>
            <p className="text-gray-500 mb-2">by <span className="font-medium">{book.author}</span></p>

            {/* Rating */}
            {book.totalReviews > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-yellow-500 mb-3">
                <FiStar className="fill-yellow-400" />
                <span className="font-bold">{book.averageRating?.toFixed(1)}</span>
                <span className="text-gray-400">({book.totalReviews} review{book.totalReviews !== 1 ? "s" : ""})</span>
              </div>
            )}

            <p className="text-xs text-gray-400 mb-4">ISBN: {book.ISBN}</p>

            {book.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{book.description}</p>
            )}

            {/* Availability & actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
                  book.availability
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {book.availability ? "✓ Available" : "✗ Not Available"}
              </span>

              {isAuthenticated && user?.role === "member" && book.availability && (
                <button
                  onClick={handleBorrow}
                  disabled={borrowLoading}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {borrowLoading ? "Processing…" : "Borrow Now"}
                </button>
              )}

              {/* WaitlistButton handles join/position/urgent-claim */}
              <WaitlistButton bookId={book._id} availability={book.availability} />

              {/* QR for admin */}
              {isAuthenticated && user?.role === "admin" && (
                <BookQRCode book={book} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <BookReviews bookId={book._id} />
      </div>
    </div>
  );
};

export default BookDetail;
