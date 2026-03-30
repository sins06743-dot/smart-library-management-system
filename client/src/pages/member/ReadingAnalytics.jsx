import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyStats } from "../../redux/slices/analyticsSlice";
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
} from "react-icons/fi";
import Loader from "../../components/common/Loader";

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

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className={`${color} p-3 rounded-lg text-xl`}>{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const ReadingAnalytics = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchMyStats());
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

  const statCards = [
    {
      icon: <FiBook />,
      label: "Total Books Borrowed",
      value: stats.totalBorrowed,
      color: "bg-indigo-100 text-indigo-600",
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
    },
    {
      icon: <FiClock />,
      label: "Reading Streak (months)",
      value: stats.readingStreak,
      color: "bg-purple-100 text-purple-600",
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

      {/* Stat cards */}
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
