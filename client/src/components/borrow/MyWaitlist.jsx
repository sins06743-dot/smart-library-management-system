import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyWaitlist, leaveWaitlist } from "../../redux/slices/waitlistSlice";
import toast from "react-hot-toast";
import { FiClock, FiBell, FiX, FiBookOpen } from "react-icons/fi";

const statusBadge = (status) => {
  const map = {
    waiting: "bg-yellow-100 text-yellow-700",
    notified: "bg-green-100 text-green-700",
    fulfilled: "bg-blue-100 text-blue-700",
    expired: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

const MyWaitlist = () => {
  const dispatch = useDispatch();
  const { myWaitlist, loading } = useSelector((state) => state.waitlist);

  useEffect(() => {
    dispatch(fetchMyWaitlist());
  }, [dispatch]);

  const handleLeave = async (bookId) => {
    const result = await dispatch(leaveWaitlist(bookId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Removed from waitlist");
    } else {
      toast.error(result.payload);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">My Waitlist</h2>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FiClock className="text-indigo-600" /> My Waitlist
      </h2>

      {myWaitlist.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">
          You&apos;re not waiting for any books.
        </p>
      ) : (
        <div className="space-y-3">
          {myWaitlist.map((entry) => (
            <div
              key={entry._id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {entry.book?.coverImage ? (
                  <img src={entry.book.coverImage} alt="" className="w-10 h-10 object-cover rounded-lg" />
                ) : (
                  <FiBookOpen className="text-indigo-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {entry.book?.title}
                </p>
                <p className="text-xs text-gray-400 truncate">by {entry.book?.author}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold text-indigo-600">#{entry.position}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(entry.status)}`}>
                  {entry.status === "notified" ? (
                    <span className="flex items-center gap-1"><FiBell className="text-xs" /> Ready!</span>
                  ) : entry.status}
                </span>
                {(entry.status === "waiting" || entry.status === "notified") && (
                  <button
                    onClick={() => handleLeave(entry.book?._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWaitlist;
