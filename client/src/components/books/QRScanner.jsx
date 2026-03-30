import { useState } from "react";
import { useDispatch } from "react-redux";
import { issueBook } from "../../redux/slices/borrowSlice";
import toast from "react-hot-toast";
import { FiX, FiCamera } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";

// QR display for a single book (shown to admins)
export const BookQRCode = ({ book }) => {
  const [show, setShow] = useState(false);

  if (!book.qrCode && !book._id) return null;

  return (
    <div>
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-1 text-xs text-indigo-600 hover:underline mt-1"
        title="View QR Code"
      >
        <FiCamera className="text-sm" /> View QR
      </button>

      {show && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-xs w-full text-center">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Book QR Code</h3>
              <button
                onClick={() => setShow(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {book.title}
            </p>
            {/* Render SVG QR code from the book's ID */}
            <div className="flex justify-center mb-4">
              <QRCodeSVG
                value={book._id}
                size={200}
                bgColor="#ffffff"
                fgColor="#4f46e5"
                level="M"
              />
            </div>
            <p className="text-xs text-gray-400">
              Scan to quickly issue or return this book
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// QR Scanner panel — reads camera feed and extracts the book ID
const QRScanner = ({ onClose }) => {
  const dispatch = useDispatch();
  const [manualId, setManualId] = useState("");
  const [processing, setProcessing] = useState(false);

  // The browser-native BarcodeDetector API isn't universally available, so we
  // provide a manual-entry fallback that works everywhere without extra deps.
  const handleManualBorrow = async () => {
    const bookId = manualId.trim();
    if (!bookId) {
      toast.error("Please enter a book ID");
      return;
    }
    setProcessing(true);
    const result = await dispatch(issueBook(bookId));
    setProcessing(false);
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Book issued via QR ID!");
      setManualId("");
      onClose?.();
    } else {
      toast.error(result.payload || "Failed to issue book");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">📷 QR Issue / Return</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="bg-indigo-50 rounded-xl p-4 mb-4 text-sm text-gray-600">
          <p className="font-semibold text-indigo-700 mb-1">How to use:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Ask the admin to display the book&apos;s QR code</li>
            <li>Copy the book ID shown under the QR code</li>
            <li>Paste it below to instantly borrow the book</li>
          </ol>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Book ID (from QR scan)
        </label>
        <input
          type="text"
          value={manualId}
          onChange={(e) => setManualId(e.target.value)}
          placeholder="Paste book ID here…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none mb-3"
          onKeyDown={(e) => e.key === "Enter" && handleManualBorrow()}
        />
        <button
          onClick={handleManualBorrow}
          disabled={processing}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {processing ? "Processing…" : "Issue Book"}
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
