import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendations } from "../../redux/slices/recommendationSlice";
import { issueBook } from "../../redux/slices/borrowSlice";
import toast from "react-hot-toast";
import { FiBookOpen, FiStar } from "react-icons/fi";

const RecommendedBooks = () => {
  const dispatch = useDispatch();
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

  if (loading) {
    return (
      <div className="animate-pulse grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {recommendations.map((book) => (
          <div
            key={book._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-28 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
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
            <div className="p-3">
              <span className="text-xs text-indigo-600 font-medium">
                {book.category}
              </span>
              <h4 className="text-sm font-bold text-gray-800 leading-tight mt-0.5 line-clamp-2">
                {book.title}
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">by {book.author}</p>
              {book.averageRating > 0 && (
                <p className="text-xs text-yellow-500 mt-0.5">
                  ★ {book.averageRating.toFixed(1)}
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
