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
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import Loader from "../../components/common/Loader";
import StatCard from "../../components/analytics/StatCard";
import ReadingHeatmap from "../../components/analytics/ReadingHeatmap";

const COLORS = [
  "#8b5cf6",
  "#6366f1",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#7c3aed",
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
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">{error}</p>
        </div>
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
      icon: <BookOpen className="w-5 h-5" />,
      label: "Total Books Borrowed",
      value: stats.totalBorrowed,
      color: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
      trend: borrowTrend,
      trendLabel: borrowTrendLabel,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Books Returned",
      value: stats.totalReturned,
      color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: "On-Time Return Rate",
      value: `${stats.onTimeRate}%`,
      color: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      trend: stats.onTimeRate >= 80 ? "up" : stats.onTimeRate >= 50 ? "neutral" : "down",
      trendLabel: stats.onTimeRate >= 80 ? "Great!" : stats.onTimeRate >= 50 ? "Room to improve" : "Needs attention",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Reading Streak (months)",
      value: stats.readingStreak,
      color: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      trend: stats.readingStreak > 0 ? "up" : "neutral",
      trendLabel: stats.readingStreak > 0 ? `${stats.readingStreak} consecutive` : "Start a streak!",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-cyan-500/5" />
          <div className="relative z-10">
            <h1 className="font-heading text-2xl font-bold text-white">📊 My Reading Analytics</h1>
            <p className="text-gray-400 mt-1">
              Insights into your reading journey
              {stats.favouriteCategory && (
                <span>
                  {" "}
                  · Favourite category:{" "}
                  <strong className="text-violet-400">{stats.favouriteCategory}</strong>
                </span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        {/* Fine summary */}
        {stats.totalFines > 0 && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-sm text-red-400">
              Total fines accrued:{" "}
              <strong>₹{stats.totalFines}</strong>. Return books on time to avoid fines!
            </p>
          </div>
        )}

        {/* Reading Heatmap */}
        <div className="glass-card p-5 mb-8">
          <h3 className="font-heading font-bold text-white mb-4">📅 Reading Activity</h3>
          <ReadingHeatmap />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-5">
            <h3 className="font-heading font-bold text-white mb-4">Books Returned per Month</h3>
            {stats.booksPerMonth.some((m) => m.count > 0) ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.booksPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} interval={1} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e1b2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm italic text-center py-12">
                No data yet — start borrowing books!
              </p>
            )}
          </div>

          <div className="glass-card p-5">
            <h3 className="font-heading font-bold text-white mb-4">Reading by Category</h3>
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
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e1b2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm italic text-center py-12">
                No category data yet.
              </p>
            )}
          </div>
        </div>

        {/* Top Authors */}
        {topAuthors.length > 0 && (
          <div className="glass-card p-5 mb-8">
            <h3 className="font-heading font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-violet-400" />
              Your Top Authors
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {topAuthors.map((author, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-all"
                >
                  <div className="w-10 h-10 mx-auto bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-400 font-bold text-sm mb-2">
                    {author.name?.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-semibold text-white truncate">
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
          <div className="glass-card p-5">
            <h3 className="font-heading font-bold text-white mb-4">Recent Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-white/5">
                    <th className="pb-3 pr-4">Book</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Issued</th>
                    <th className="pb-3 pr-4">Due</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Fine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.recentActivity.map((a, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="py-3 pr-4 font-medium text-white max-w-[180px] truncate">
                        {a.bookTitle}
                      </td>
                      <td className="py-3 pr-4 text-gray-400">{a.category}</td>
                      <td className="py-3 pr-4 text-gray-400">
                        {new Date(a.issueDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4 text-gray-400">
                        {new Date(a.returnDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            a.status === "returned"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : new Date(a.returnDate) < new Date()
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          }`}
                        >
                          {a.status === "returned"
                            ? "Returned"
                            : new Date(a.returnDate) < new Date()
                            ? "Overdue"
                            : "Active"}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">
                        {a.fine > 0 ? (
                          <span className="text-red-400">₹{a.fine}</span>
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
    </div>
  );
};

export default ReadingAnalytics;
