import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  joinWaitlist,
  leaveWaitlist,
  fetchBookWaitlistPosition,
} from "../../redux/slices/waitlistSlice";
import toast from "react-hot-toast";
import { FiClock, FiBell, FiX } from "react-icons/fi";

const WaitlistButton = ({ book }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { positions, loading } = useSelector((state) => state.waitlist);

  const positionData = positions[book._id];

  useEffect(() => {
    if (isAuthenticated && !book.availability) {
      dispatch(fetchBookWaitlistPosition(book._id));
    }
  }, [dispatch, book._id, book.availability, isAuthenticated]);

  if (book.availability) return null;
  if (!isAuthenticated || user?.role !== "member") return null;

  const handleJoin = async () => {
    const result = await dispatch(joinWaitlist(book._id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Added to waitlist!");
      dispatch(fetchBookWaitlistPosition(book._id));
    } else {
      toast.error(result.payload);
    }
  };

  const handleLeave = async () => {
    const result = await dispatch(leaveWaitlist(book._id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Removed from waitlist");
      dispatch(fetchBookWaitlistPosition(book._id));
    } else {
      toast.error(result.payload);
    }
  };

  if (!positionData) {
    return (
      <button
        onClick={handleJoin}
        disabled={loading}
        className="flex items-center gap-1 bg-yellow-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors"
      >
        <FiClock className="text-xs" /> Join Waitlist
      </button>
    );
  }

  if (!positionData.inWaitlist) {
    return (
      <button
        onClick={handleJoin}
        disabled={loading}
        className="flex items-center gap-1 bg-yellow-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors"
      >
        <FiClock className="text-xs" /> Join Waitlist ({positionData.totalWaiting} waiting)
      </button>
    );
  }

  if (positionData.status === "notified") {
    const hoursLeft = positionData.expiresAt
      ? Math.max(0, Math.round((new Date(positionData.expiresAt) - Date.now()) / 3600000))
      : 24;
    return (
      <button className="flex items-center gap-1 bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg animate-pulse">
        <FiBell className="text-xs" /> Claim Now! ({hoursLeft}h left)
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full border border-yellow-200">
        #{positionData.position} in queue
      </span>
      <button
        onClick={handleLeave}
        disabled={loading}
        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        <FiX /> Leave
      </button>
    </div>
  );
};

export default WaitlistButton;
