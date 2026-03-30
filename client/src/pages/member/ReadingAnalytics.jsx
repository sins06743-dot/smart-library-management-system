import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyStats,
  fetchMonthlyData,
  fetchCategoryData,
  fetchStreakData,
  fetchTopAuthors,
} from "../../redux/slices/analyticsSlice";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import StatCard from "../../components/analytics/StatCard";
import ReadingHeatmap from "../../components/analytics/ReadingHeatmap";
import { FiBook, FiClock, FiCheckCircle, FiDollarSign, FiUser } from "react-icons/fi";

const COLORS = ["#4F46E5", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899", "#14B8A6"];

const SKELETON_ITEMS = [1, 2, 3, 4, 5, 6];

const ReadingAnalytics = () => {
  const dispatch = useDispatch();
  const { stats, monthlyData, categoryData, streakData, topAuthors, loading } =
    useSelector((state) => state.analytics);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMyStats());
    dispatch(fetchMonthlyData());
    dispatch(fetchCategoryData());
    dispatch(fetchStreakData());
    dispatch(fetchTopAuthors());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
        <h1 className="text-2xl font-bold">📊 Reading Analytics</h1>
        <p className="text-indigo-200 mt-2">
          Hello, {user?.name}! Here&apos;s a deep dive into your reading habits.
        </p>
      </div>

      {/* Stats Cards */}
      {loading && !stats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {SKELETON_ITEMS.map(i => (
            <div key={i} className="bg-gray-100 rounded-xl h-28 animate-pulse" />
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard icon={<FiBook />} label="Total Borrowed" value={stats.totalBorrowed} color="indigo" />
          <StatCard icon={<FiClock />} label="Currently Borrowed" value={stats.currentlyBorrowed} color="blue" />
          <StatCard icon={<FiCheckCircle />} label="Returned" value={stats.returned} color="green" />
          <StatCard icon={<FiCheckCircle />} label="On-Time Rate" value={stats.onTimePercent} unit="%" color="purple" />
          <StatCard icon={<FiDollarSign />} label="Total Fines" value={`₹${stats.totalFines}`} color="red" />
          <StatCard icon={<FiClock />} label="Avg Duration" value={stats.avgDuration} unit="days" color="yellow" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">📅 Monthly Activity (Last 12 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Books" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">📚 Reading by Category</h3>
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              No data available yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Reading Heatmap */}
      <div className="mb-6">
        <ReadingHeatmap streakData={streakData} />
      </div>

      {/* Top Authors */}
      {topAuthors.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiUser className="text-indigo-600" /> Top Authors
          </h3>
          <div className="space-y-3">
            {topAuthors.map((item, index) => (
              <div key={item.author} className="flex items-center gap-3">
                <span className="text-sm font-bold text-indigo-600 w-5">#{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.author}</span>
                    <span className="text-xs text-gray-400">{item.count} book{item.count !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(item.count / topAuthors[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingAnalytics;
