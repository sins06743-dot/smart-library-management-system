import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBookById } from "../redux/slices/bookSlice";
import { issueBook } from "../redux/slices/borrowSlice";
import BookReviews from "../components/books/BookReviews";
import { BookQRCode } from "../components/books/QRScanner";
import WaitlistButton from "../components/books/WaitlistButton";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, Star } from "lucide-react";
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
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Cover */}
            <div className="h-64 md:h-auto bg-gradient-to-br from-violet-500/10 to-cyan-500/10 flex items-center justify-center">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <BookOpen className="w-16 h-16 text-violet-400/50" />
              )}
            </div>

            {/* Info */}
            <div className="md:col-span-2 p-8">
              <span className="inline-block bg-violet-500/10 text-violet-400 text-xs font-medium px-3 py-1 rounded-full border border-violet-500/20 mb-3">
                {book.category}
              </span>
              <h1 className="font-heading text-2xl font-bold text-white mb-1">{book.title}</h1>
              <p className="text-gray-400 mb-2">by <span className="font-medium text-gray-300">{book.author}</span></p>

              {/* Rating */}
              {book.totalReviews > 0 && (
                <div className="flex items-center gap-1.5 text-sm mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-yellow-400">{book.averageRating?.toFixed(1)}</span>
                  <span className="text-gray-500">({book.totalReviews} review{book.totalReviews !== 1 ? "s" : ""})</span>
                </div>
              )}

              <p className="text-xs text-gray-500 mb-4">ISBN: {book.ISBN}</p>

              {book.description && (
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{book.description}</p>
              )}

              {/* Availability & actions */}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
                    book.availability
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {book.availability ? "✓ Available" : "✗ Not Available"}
                </span>

                {isAuthenticated && user?.role === "member" && book.availability && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleBorrow}
                    disabled={borrowLoading}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50 font-medium shadow-glow-sm"
                  >
                    {borrowLoading ? "Processing…" : "Borrow Now"}
                  </motion.button>
                )}

                <WaitlistButton bookId={book._id} availability={book.availability} />

                {isAuthenticated && user?.role === "admin" && (
                  <BookQRCode book={book} />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reviews section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 glass-card p-8"
        >
          <BookReviews bookId={book._id} />
        </motion.div>
      </div>
    </div>
  );
};

export default BookDetail;
