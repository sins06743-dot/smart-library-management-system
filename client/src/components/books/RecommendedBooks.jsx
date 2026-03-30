import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecommendations,
  fetchPopularBooks,
} from "../../redux/slices/recommendationSlice";
import { FiBookOpen, FiInfo } from "react-icons/fi";
import StarRating from "./StarRating";

const BookCard = ({ book, showReason = false }) => (
  <div className="flex-shrink-0 w-44 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
    <div className="h-36 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative">
      {book.coverImage ? (
        <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
      ) : (
        <FiBookOpen className="text-4xl text-indigo-400" />
      )}
      {book.matchPercentage !== undefined && (
        <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">
          {book.matchPercentage}%
        </span>
      )}
    </div>
    <div className="p-3">
      <span className="text-xs bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full">
        {book.category}
      </span>
      <h4 className="font-bold text-gray-800 text-sm mt-1 line-clamp-2 leading-tight">
        {book.title}
      </h4>
      <p className="text-gray-500 text-xs mt-0.5">by {book.author}</p>
      {book.averageRating > 0 && (
        <div className="flex items-center gap-1 mt-1">
          <StarRating rating={book.averageRating} size="sm" />
          <span className="text-xs text-gray-400">({book.totalReviews})</span>
        </div>
      )}
      {showReason && book.reason && (
        <div className="flex items-center gap-1 mt-1 group relative">
          <FiInfo className="text-xs text-indigo-400 flex-shrink-0" />
          <span className="text-xs text-indigo-500 line-clamp-1">{book.reason}</span>
        </div>
      )}
    </div>
  </div>
);

const RecommendedBooks = () => {
  const dispatch = useDispatch();
  const { recommendations, popular, loading } = useSelector((state) => state.recommendations);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchRecommendations());
    }
    dispatch(fetchPopularBooks());
  }, [dispatch, isAuthenticated]);

  const showPersonalized = recommendations.length > 0;
  const books = showPersonalized ? recommendations : popular;
  const title = showPersonalized ? "Recommended For You" : "Popular Books";
  const subtitle = showPersonalized
    ? "Based on your reading history"
    : "Most borrowed in our library";

  if (loading && books.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="h-5 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-44 h-56 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (books.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {books.map((book) => (
          <BookCard key={book._id} book={book} showReason={showPersonalized} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedBooks;
