import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyRecords } from "../../redux/slices/borrowSlice";
import { getMyWaitlist } from "../../redux/slices/waitlistSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, AlertCircle, Clock, ArrowRight, BarChart2, BookOpenCheck } from "lucide-react";
import RecommendedBooks from "../../components/books/RecommendedBooks";
import QRScanner, { QRScannerFAB } from "../../components/books/QRScanner";

const MemberDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myRecords } = useSelector((state) => state.borrow);
  const { myWaitlist } = useSelector((state) => state.waitlist);
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
    { label: "Books Borrowed", value: activeBorrows.length, icon: BookOpen, color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
    { label: "Overdue Books", value: overdue.length, icon: AlertCircle, color: "bg-red-500/10 text-red-400 border-red-500/20" },
    { label: "Books Returned", value: returned.length, icon: Clock, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-cyan-500/5" />
          <div className="relative z-10">
            <h1 className="font-heading text-2xl font-bold text-white">Welcome back, {user?.name}! 👋</h1>
            <p className="text-gray-400 mt-2">Here&apos;s your library activity overview.</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 flex items-center gap-4"
            >
              <div className={`${stat.color} border p-3 rounded-xl`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overdue Alert */}
        {overdue.length > 0 && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400">You have {overdue.length} overdue book(s)!</p>
              <p className="text-sm text-red-400/70">
                Fine accruing at ₹5/day. Please return them as soon as possible.
              </p>
            </div>
          </div>
        )}

        {/* My Waitlist Section */}
        {myWaitlist.length > 0 && (
          <div className="glass-card p-6 mb-8">
            <h2 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              My Waitlist ({myWaitlist.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myWaitlist.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3"
                >
                  <div className="h-12 w-10 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 rounded flex items-center justify-center flex-shrink-0">
                    {entry.book?.coverImage ? (
                      <img
                        src={entry.book.coverImage}
                        alt={entry.book.title}
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <BookOpenCheck className="w-4 h-4 text-violet-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/books/${entry.book?._id}`}
                      className="text-sm font-semibold text-white hover:text-violet-400 truncate block transition-colors"
                    >
                      {entry.book?.title}
                    </Link>
                    <p className="text-xs text-gray-500">by {entry.book?.author}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {entry.status === "notified" ? (
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full animate-pulse border border-amber-500/20">
                        Claim now!
                      </span>
                    ) : (
                      <span className="text-xs text-violet-400 font-semibold">
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
            className="glass-card p-6 hover:border-violet-500/20 transition-all flex items-center justify-between group"
          >
            <div>
              <h3 className="font-bold text-white">My Borrowed Books</h3>
              <p className="text-sm text-gray-400">View and manage your borrowed books</p>
            </div>
            <ArrowRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/catalog"
            className="glass-card p-6 hover:border-violet-500/20 transition-all flex items-center justify-between group"
          >
            <div>
              <h3 className="font-bold text-white">Browse Catalog</h3>
              <p className="text-sm text-gray-400">Discover and borrow new books</p>
            </div>
            <ArrowRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/member/analytics"
            className="glass-card p-6 hover:border-violet-500/20 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-bold text-white">Reading Analytics</h3>
                <p className="text-sm text-gray-400">See your reading stats &amp; charts</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* AI Recommendations */}
        <RecommendedBooks />

        {/* Floating QR Scanner FAB */}
        <QRScannerFAB onClick={() => setShowQR(true)} />

        {/* QR Scanner Modal */}
        {showQR && <QRScanner onClose={() => setShowQR(false)} />}
      </div>
    </div>
  );
};

export default MemberDashboard;
