import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRecords, getOverdueRecords } from "../../redux/slices/borrowSlice";
import { getAllBooks } from "../../redux/slices/bookSlice";
import { getAllUsers } from "../../redux/slices/userSlice";
import Sidebar from "../../components/layout/Sidebar";
import { FiTrendingUp, FiDollarSign, FiBook, FiUsers } from "react-icons/fi";

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
    { title: "Total Books", value: totalBooks || books.length, icon: <FiBook />, color: "text-indigo-600 bg-indigo-100" },
    { title: "Total Members", value: users.length, icon: <FiUsers />, color: "text-green-600 bg-green-100" },
    { title: "Total Borrows", value: records.length, icon: <FiTrendingUp />, color: "text-blue-600 bg-blue-100" },
    { title: "Fine Collected", value: `₹${totalFineCollected}`, icon: <FiDollarSign />, color: "text-amber-600 bg-amber-100" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Reports & Analytics</h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {summaryStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className={`${stat.color} inline-flex p-3 rounded-lg text-xl mb-3`}>
                {stat.icon}
              </div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fine Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Fine Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Total Fine Collected</p>
                  <p className="text-sm text-green-600">From returned books</p>
                </div>
                <span className="text-xl font-bold text-green-700">₹{totalFineCollected}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-800">Pending Fines</p>
                  <p className="text-sm text-red-600">From {overdueRecords.length} overdue books</p>
                </div>
                <span className="text-xl font-bold text-red-700">₹{pendingFines}</span>
              </div>
            </div>
          </div>

          {/* Most Borrowed Books */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Most Borrowed Books</h2>
            {mostBorrowed.length > 0 ? (
              <div className="space-y-3">
                {mostBorrowed.map((book, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-600 font-bold text-lg w-6">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{book.title}</p>
                        <p className="text-xs text-gray-500">{book.author}</p>
                      </div>
                    </div>
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                      {book.count}x
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No borrow data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
