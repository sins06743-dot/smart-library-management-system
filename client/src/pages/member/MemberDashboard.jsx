import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyRecords } from "../../redux/slices/borrowSlice";
import { getMyWaitlist } from "../../redux/slices/waitlistSlice";
import { Link } from "react-router-dom";
import { FiBook, FiAlertCircle, FiClock, FiArrowRight, FiBarChart2, FiBookOpen } from "react-icons/fi";
import RecommendedBooks from "../../components/books/RecommendedBooks";
import QRScanner, { QRScannerFAB } from "../../components/books/QRScanner";

const MemberDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myRecords } = useSelector((state) => state.borrow);
  const { myWaitlist, loading: wlLoading } = useSelector((state) => state.waitlist);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    dispatch(getMyRecords());
    dispatch(getMyWaitlist());
  }, [dispatch]);

  const activeBorrows = myRecords.filter((r) => r.status === "borrowed");
  const overdue = activeBorrows.filter(
    (r) => new Date(r.returnDate) < new Date()
  );
  const returned = myRecords.filter((r) => r.status === "returned");

  const stats = [
    { label: "Books Borrowed", value: activeBorrows.length, icon: <FiBook />, color: "bg-blue-100 text-blue-600" },
    { label: "Overdue Books", value: overdue.length, icon: <FiAlertCircle />, color: "bg-red-100 text-red-600" },
    { label: "Books Returned", value: returned.length, icon: <FiClock />, color: "bg-green-100 text-green-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}! 👋</h1>
        <p className="text-indigo-200 mt-2">Here&apos;s your library activity overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-lg text-xl`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overdue Alert */}
      {overdue.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <FiAlertCircle className="text-red-500 text-xl mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">You have {overdue.length} overdue book(s)!</p>
            <p className="text-sm text-red-600">
              Fine accruing at ₹5/day. Please return them as soon as possible.
            </p>
          </div>
        </div>
      )}

      {/* My Waitlist Section */}
      {myWaitlist.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiClock className="text-orange-500" />
            My Waitlist ({myWaitlist.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myWaitlist.map((entry) => (
              <div
                key={entry._id}
                className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100"
              >
                <div className="h-12 w-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded flex items-center justify-center flex-shrink-0">
                  {entry.book?.coverImage ? (
                    <img
                      src={entry.book.coverImage}
                      alt={entry.book.title}
                      className="h-full w-full object-cover rounded"
                    />
                  ) : (
                    <FiBookOpen className="text-indigo-400 text-sm" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/books/${entry.book?._id}`}
                    className="text-sm font-semibold text-gray-800 hover:text-indigo-600 truncate block"
                  >
                    {entry.book?.title}
                  </Link>
                  <p className="text-xs text-gray-400">by {entry.book?.author}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {entry.status === "notified" ? (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full animate-pulse">
                      Claim now!
                    </span>
                  ) : (
                    <span className="text-xs text-indigo-600 font-semibold">
                      #{entry.position}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/member/my-books"
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow flex items-center justify-between group"
        >
          <div>
            <h3 className="font-bold text-gray-800">My Borrowed Books</h3>
            <p className="text-sm text-gray-500">View and manage your borrowed books</p>
          </div>
          <FiArrowRight className="text-indigo-600 group-hover:translate-x-1 transition-transform text-xl" />
        </Link>
        <Link
          to="/catalog"
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow flex items-center justify-between group"
        >
          <div>
            <h3 className="font-bold text-gray-800">Browse Catalog</h3>
            <p className="text-sm text-gray-500">Discover and borrow new books</p>
          </div>
          <FiArrowRight className="text-indigo-600 group-hover:translate-x-1 transition-transform text-xl" />
        </Link>
        <Link
          to="/member/analytics"
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow flex items-center justify-between group"
        >
          <div className="flex items-center gap-2">
            <FiBarChart2 className="text-purple-500 text-xl" />
            <div>
              <h3 className="font-bold text-gray-800">Reading Analytics</h3>
              <p className="text-sm text-gray-500">See your reading stats &amp; charts</p>
            </div>
          </div>
          <FiArrowRight className="text-indigo-600 group-hover:translate-x-1 transition-transform text-xl" />
        </Link>
      </div>

      {/* AI Recommendations */}
      <RecommendedBooks />

      {/* Floating QR Scanner FAB */}
      <QRScannerFAB onClick={() => setShowQR(true)} />

      {/* QR Scanner Modal */}
      {showQR && <QRScanner onClose={() => setShowQR(false)} />}
    </div>
  );
};

export default MemberDashboard;
