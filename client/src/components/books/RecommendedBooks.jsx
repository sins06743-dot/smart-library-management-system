import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendations } from "../../redux/slices/recommendationSlice";
import { issueBook } from "../../redux/slices/borrowSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiBookOpen, FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRef } from "react";

const RecommendedBooks = () => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const { recommendations, favouriteCategories, loading } = useSelector(
    (state) => state.recommendations
  );
  const { loading: borrowLoading } = useSelector((state) => state.borrow);

  useEffect(() => {
    dispatch(getRecommendations());
  }, [dispatch]);

  const handleBorrow = async (bookId) => {
    const result = await dispatch(issueBook(bookId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Book borrowed successfully!");
      dispatch(getRecommendations());
    } else {
      toast.error(result.payload || "Failed to borrow book");
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse flex gap-4 overflow-hidden mt-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="min-w-[220px] h-64 bg-gray-100 rounded-xl flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiStar className="text-yellow-500 text-xl" />
          <h2 className="text-xl font-bold text-gray-800">
            Recommended for You
          </h2>
          {favouriteCategories.length > 0 && (
            <span className="text-sm text-gray-400 ml-2">
              based on: {favouriteCategories.slice(0, 3).join(", ")}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll left"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll right"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Horizontal scroll carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {recommendations.map((book) => (
          <div
            key={book._id}
            className="min-w-[220px] max-w-[220px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex-shrink-0 relative"
          >
            {/* Match % badge */}
            {book.matchScore > 0 && (
              <div className="absolute top-2 right-2 z-10 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                {book.matchScore}% match
              </div>
            )}

            <Link to={`/books/${book._id}`}>
              <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiBookOpen className="text-3xl text-indigo-400" />
                )}
              </div>
            </Link>

            <div className="p-3">
              <span className="text-xs text-indigo-600 font-medium">
                {book.category}
              </span>
              <h4 className="text-sm font-bold text-gray-800 leading-tight mt-0.5 line-clamp-2">
                <Link to={`/books/${book._id}`} className="hover:text-indigo-600">
                  {book.title}
                </Link>
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">by {book.author}</p>

              {book.averageRating > 0 && (
                <p className="text-xs text-yellow-500 mt-0.5">
                  ★ {book.averageRating.toFixed(1)}
                </p>
              )}

              {/* "Why recommended" label */}
              {book.whyRecommended && (
                <p className="text-[10px] text-purple-500 mt-1 italic leading-tight line-clamp-2">
                  💡 {book.whyRecommended}
                </p>
              )}

              {book.availability && (
                <button
                  onClick={() => handleBorrow(book._id)}
                  disabled={borrowLoading}
                  className="mt-2 w-full bg-indigo-600 text-white text-xs py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  Borrow
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedBooks;
