import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks } from "../../redux/slices/bookSlice";
import { getAllUsers } from "../../redux/slices/userSlice";
import { getAllRecords, getOverdueRecords } from "../../redux/slices/borrowSlice";
import Sidebar from "../../components/layout/Sidebar";
import DashboardCard from "../../components/common/DashboardCard";
import { BookOpen, Users, FileText, AlertCircle } from "lucide-react";

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

  const issuedBooks = records.filter((r) => r.status === "borrowed").length;

  const stats = [
    {
      title: "Total Books",
      count: totalBooks || books.length,
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
    },
    {
      title: "Total Members",
      count: users.length,
      icon: <Users className="w-5 h-5" />,
      color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
    {
      title: "Books Issued",
      count: issuedBooks,
      icon: <FileText className="w-5 h-5" />,
      color: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    },
    {
      title: "Overdue Books",
      count: overdueRecords.length,
      icon: <AlertCircle className="w-5 h-5" />,
      color: "bg-red-500/10 text-red-400 border border-red-500/20",
    },
  ];

  const recentActivity = records.slice(0, 5);

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="font-heading text-2xl font-bold text-white mb-8">Admin Dashboard</h1>

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
        <div className="glass-card p-6">
          <h2 className="font-heading text-lg font-bold text-white mb-4">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="font-medium text-white">{record.user?.name}</p>
                    <p className="text-sm text-gray-400">
                      {record.status === "borrowed" ? "Borrowed" : "Returned"} &quot;{record.book?.title}&quot;
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      record.status === "borrowed"
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
