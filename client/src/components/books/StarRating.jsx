import { FiStar } from "react-icons/fi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const StarRating = ({ rating = 0, maxStars = 5, interactive = false, onRate, size = "md" }) => {
  const sizeClass = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  const renderStar = (index) => {
    const filled = rating >= index + 1;
    const half = !filled && rating >= index + 0.5;

    if (interactive) {
      return (
        <button
          key={index}
          onClick={() => onRate && onRate(index + 1)}
          className={`${sizeClass} transition-colors ${
            filled ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"
          }`}
        >
          <FaStar />
        </button>
      );
    }

    if (filled) return <FaStar key={index} className={`${sizeClass} text-yellow-400`} />;
    if (half) return <FaStarHalfAlt key={index} className={`${sizeClass} text-yellow-400`} />;
    return <FiStar key={index} className={`${sizeClass} text-gray-300`} />;
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => renderStar(i))}
    </div>
  );
};

export default StarRating;
