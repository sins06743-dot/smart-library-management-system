import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRecords, getOverdueRecords } from "../../redux/slices/borrowSlice";
import { getAllBooks } from "../../redux/slices/bookSlice";
import { getAllUsers } from "../../redux/slices/userSlice";
import Sidebar from "../../components/layout/Sidebar";
import { TrendingUp, DollarSign, BookOpen, Users } from "lucide-react";

const Reports = () => {
  const dispatch = useDispatch();
  const { records, overdueRecords } = useSelector((state) => state.borrow);
  const { books, totalBooks } = useSelector((state) => state.books);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getAllRecords());
    dispatch(getOverdueRecords());
    dispatch(getAllBooks({}));
    dispatch(getAllUsers());
  }, [dispatch]);

  // Calculate total fine collected
  const totalFineCollected = records
    .filter((r) => r.status === "returned" && r.fine > 0)
    .reduce((sum, r) => sum + r.fine, 0);

  // Calculate pending fines (overdue but not yet returned)
  const pendingFines = overdueRecords.reduce((sum, r) => {
    const today = new Date();
    const overdueDays = Math.ceil(
      (today - new Date(r.returnDate)) / (24 * 60 * 60 * 1000)
    );
    return sum + overdueDays * 5;
  }, 0);

  // Most borrowed books - count occurrences
  const borrowCounts = {};
  records.forEach((r) => {
    if (r.book?._id) {
      borrowCounts[r.book._id] = {
        title: r.book.title,
        author: r.book.author,
        count: (borrowCounts[r.book._id]?.count || 0) + 1,
      };
    }
  });
  const mostBorrowed = Object.values(borrowCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const summaryStats = [
    { title: "Total Books", value: totalBooks || books.length, icon: <BookOpen className="w-5 h-5" />, color: "bg-violet-500/10 text-violet-400 border border-violet-500/20" },
    { title: "Total Members", value: users.length, icon: <Users className="w-5 h-5" />, color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
    { title: "Total Borrows", value: records.length, icon: <TrendingUp className="w-5 h-5" />, color: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" },
    { title: "Fine Collected", value: `₹${totalFineCollected}`, icon: <DollarSign className="w-5 h-5" />, color: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
  ];

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="font-heading text-2xl font-bold text-white mb-8">Reports & Analytics</h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {summaryStats.map((stat, index) => (
            <div key={index} className="glass-card p-6">
              <div className={`${stat.color} inline-flex p-3 rounded-xl mb-3`}>
                {stat.icon}
              </div>
              <p className="text-sm text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fine Information */}
          <div className="glass-card p-6">
            <h2 className="font-heading text-lg font-bold text-white mb-4">Fine Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <div>
                  <p className="font-medium text-emerald-400">Total Fine Collected</p>
                  <p className="text-sm text-emerald-400/60">From returned books</p>
                </div>
                <span className="text-xl font-bold text-emerald-400">₹{totalFineCollected}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                <div>
                  <p className="font-medium text-red-400">Pending Fines</p>
                  <p className="text-sm text-red-400/60">From {overdueRecords.length} overdue books</p>
                </div>
                <span className="text-xl font-bold text-red-400">₹{pendingFines}</span>
              </div>
            </div>
          </div>

          {/* Most Borrowed Books */}
          <div className="glass-card p-6">
            <h2 className="font-heading text-lg font-bold text-white mb-4">Most Borrowed Books</h2>
            {mostBorrowed.length > 0 ? (
              <div className="space-y-3">
                {mostBorrowed.map((book, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-violet-400 font-bold text-lg w-6">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-white text-sm">{book.title}</p>
                        <p className="text-xs text-gray-500">{book.author}</p>
                      </div>
                    </div>
                    <span className="bg-violet-500/10 text-violet-400 text-xs font-bold px-2 py-1 rounded-full border border-violet-500/20">
                      {book.count}x
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No borrow data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
