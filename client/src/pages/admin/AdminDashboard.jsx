import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks } from "../../redux/slices/bookSlice";
import { getAllUsers } from "../../redux/slices/userSlice";
import { getAllRecords, getOverdueRecords } from "../../redux/slices/borrowSlice";
import Sidebar from "../../components/layout/Sidebar";
import DashboardCard from "../../components/common/DashboardCard";
import { FiBook, FiUsers, FiFileText, FiAlertCircle } from "react-icons/fi";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { totalBooks, books } = useSelector((state) => state.books);
  const { users } = useSelector((state) => state.users);
  const { records, overdueRecords } = useSelector((state) => state.borrow);

  useEffect(() => {
    dispatch(getAllBooks({}));
    dispatch(getAllUsers());
    dispatch(getAllRecords());
    dispatch(getOverdueRecords());
  }, [dispatch]);

  // Count currently issued books
  const issuedBooks = records.filter((r) => r.status === "borrowed").length;

  const stats = [
    {
      title: "Total Books",
      count: totalBooks || books.length,
      icon: <FiBook />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Total Members",
      count: users.length,
      icon: <FiUsers />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Books Issued",
      count: issuedBooks,
      icon: <FiFileText />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Overdue Books",
      count: overdueRecords.length,
      icon: <FiAlertCircle />,
      color: "bg-red-100 text-red-600",
    },
  ];

  // Recent 5 borrow activities
  const recentActivity = records.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <DashboardCard
              key={index}
              title={stat.title}
              count={stat.count}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">{record.user?.name}</p>
                    <p className="text-sm text-gray-500">
                      {record.status === "borrowed" ? "Borrowed" : "Returned"} &quot;{record.book?.title}&quot;
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      record.status === "borrowed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
