import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyStats, fetchTopAuthors } from "../../redux/slices/analyticsSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FiBook,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";
import Loader from "../../components/common/Loader";
import StatCard from "../../components/analytics/StatCard";
import ReadingHeatmap from "../../components/analytics/ReadingHeatmap";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#ddd6fe",
  "#ede9fe",
  "#7c3aed",
  "#5b21b6",
];

const ReadingAnalytics = () => {
  const dispatch = useDispatch();
  const { stats, topAuthors, loading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchMyStats());
    dispatch(fetchTopAuthors());
  }, [dispatch]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <FiAlertCircle className="text-red-400 text-5xl mx-auto mb-4" />
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  // Compute trend for total borrowed (compare last 2 months)
  const lastMonth = stats.booksPerMonth?.[stats.booksPerMonth.length - 1]?.count || 0;
  const prevMonth = stats.booksPerMonth?.[stats.booksPerMonth.length - 2]?.count || 0;
  const borrowTrend = lastMonth > prevMonth ? "up" : lastMonth < prevMonth ? "down" : "neutral";
  const borrowTrendLabel = lastMonth > prevMonth
    ? `+${lastMonth - prevMonth} vs last month`
    : lastMonth < prevMonth
    ? `${lastMonth - prevMonth} vs last month`
    : "Same as last month";

  const statCards = [
    {
      icon: <FiBook />,
      label: "Total Books Borrowed",
      value: stats.totalBorrowed,
      color: "bg-indigo-100 text-indigo-600",
      trend: borrowTrend,
      trendLabel: borrowTrendLabel,
    },
    {
      icon: <FiTrendingUp />,
      label: "Books Returned",
      value: stats.totalReturned,
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <FiAward />,
      label: "On-Time Return Rate",
      value: `${stats.onTimeRate}%`,
      color: "bg-yellow-100 text-yellow-600",
      trend: stats.onTimeRate >= 80 ? "up" : stats.onTimeRate >= 50 ? "neutral" : "down",
      trendLabel: stats.onTimeRate >= 80 ? "Great!" : stats.onTimeRate >= 50 ? "Room to improve" : "Needs attention",
    },
    {
      icon: <FiClock />,
      label: "Reading Streak (months)",
      value: stats.readingStreak,
      color: "bg-purple-100 text-purple-600",
      trend: stats.readingStreak > 0 ? "up" : "neutral",
      trendLabel: stats.readingStreak > 0 ? `${stats.readingStreak} consecutive` : "Start a streak!",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
        <h1 className="text-2xl font-bold">📊 My Reading Analytics</h1>
        <p className="text-indigo-200 mt-1">
          Insights into your reading journey
          {stats.favouriteCategory && (
            <span>
              {" "}
              · Favourite category:{" "}
              <strong className="text-white">{stats.favouriteCategory}</strong>
            </span>
          )}
        </p>
      </div>

      {/* Stat cards with trend indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Fine summary */}
      {stats.totalFines > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 flex items-center gap-3">
          <FiAlertCircle className="text-red-500 text-xl" />
          <p className="text-sm text-red-700">
            Total fines accrued:{" "}
            <strong>₹{stats.totalFines}</strong>. Return books on time to avoid
            fines!
          </p>
        </div>
      )}

      {/* Reading Heatmap (GitHub-style 52×7 grid) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
        <h3 className="font-bold text-gray-800 mb-4">📅 Reading Activity</h3>
        <ReadingHeatmap />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Books per month bar chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">
            Books Returned per Month
          </h3>
          {stats.booksPerMonth.some((m) => m.count > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.booksPerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  interval={1}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm italic text-center py-12">
              No data yet — start borrowing books!
            </p>
          )}
        </div>

        {/* Category distribution pie chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">
            Reading by Category
          </h3>
          {stats.categoryDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {stats.categoryDistribution.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm italic text-center py-12">
              No category data yet.
            </p>
          )}
        </div>
      </div>

      {/* Top Authors */}
      {topAuthors.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiUser className="text-indigo-500" />
            Your Top Authors
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {topAuthors.map((author, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 text-center border border-indigo-100"
              >
                <div className="w-10 h-10 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm mb-2">
                  {author.name?.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {author.name}
                </p>
                <p className="text-xs text-gray-500">
                  {author.count} book{author.count !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity table */}
      {stats.recentActivity.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 pr-4">Book</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Issued</th>
                  <th className="pb-3 pr-4">Due</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentActivity.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-800 max-w-[180px] truncate">
                      {a.bookTitle}
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{a.category}</td>
                    <td className="py-3 pr-4 text-gray-500">
                      {new Date(a.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {new Date(a.returnDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          a.status === "returned"
                            ? "bg-green-100 text-green-700"
                            : new Date(a.returnDate) < new Date()
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {a.status === "returned"
                          ? "Returned"
                          : new Date(a.returnDate) < new Date()
                          ? "Overdue"
                          : "Active"}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">
                      {a.fine > 0 ? (
                        <span className="text-red-500">₹{a.fine}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingAnalytics;
