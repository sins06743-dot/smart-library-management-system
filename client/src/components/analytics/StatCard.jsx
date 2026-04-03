import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";

/**
 * StatCard with optional trend indicator.
 * trend: "up" | "down" | "neutral" | null
 * trendLabel: e.g. "+2 this month"
 */
const StatCard = ({ icon, label, value, color, trend = null, trendLabel = "" }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className={`${color} p-3 rounded-lg text-xl`}>{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {trend && (
        <div
          className={`flex items-center gap-1 mt-0.5 text-xs font-medium ${
            trend === "up"
              ? "text-green-600"
              : trend === "down"
              ? "text-red-500"
              : "text-gray-400"
          }`}
        >
          {trend === "up" && <FiTrendingUp className="text-sm" />}
          {trend === "down" && <FiTrendingDown className="text-sm" />}
          {trend === "neutral" && <FiMinus className="text-sm" />}
          {trendLabel && <span>{trendLabel}</span>}
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
