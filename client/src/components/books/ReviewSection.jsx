import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookReviews, addReview, deleteReview } from "../../redux/slices/reviewSlice";
import StarRating from "./StarRating";
import toast from "react-hot-toast";
import { FiTrash2, FiUser } from "react-icons/fi";

const ReviewSection = ({ bookId, hasBorrowed }) => {
  const dispatch = useDispatch();
  const { reviews, total, loading } = useSelector((state) => state.reviews);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (bookId) {
      dispatch(fetchBookReviews({ bookId }));
    }
  }, [dispatch, bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    const result = await dispatch(addReview({ bookId, rating, comment }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Review added!");
      setRating(0);
      setComment("");
    } else {
      toast.error(result.payload);
    }
    setSubmitting(false);
  };

  const handleDelete = async (reviewId) => {
    const result = await dispatch(deleteReview(reviewId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Review deleted");
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Reviews & Ratings ({total})
      </h2>

      {/* Review Form */}
      {isAuthenticated && user?.role === "member" && (
        <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
          {hasBorrowed ? (
            <form onSubmit={handleSubmit}>
              <h3 className="font-semibold text-gray-700 mb-3">Write a Review</h3>
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-1">Your Rating</p>
                <StarRating rating={rating} interactive onRate={setRating} size="lg" />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this book..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">{comment.length}/500</span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">
              📚 You must borrow and return this book before writing a review.
            </p>
          )}
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No reviews yet. Be the first to review!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                    {review.user?.avatar ? (
                      <img src={review.user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <FiUser className="text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{review.user?.name || "Anonymous"}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} size="sm" />
                  {(user?._id === review.user?._id || user?.role === "admin") && (
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-red-400 hover:text-red-600 ml-2"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
