import { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { issueBook } from "../../redux/slices/borrowSlice";
import { returnByQR } from "../../redux/slices/borrowSlice";
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

// Floating action button for QR scanner on member dashboard
export const QRScannerFAB = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 z-40 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-110"
    title="Scan QR Code"
    aria-label="Open QR Scanner"
  >
    <FiCamera className="text-2xl" />
  </button>
);

// QR Scanner panel — camera + manual entry with issue/return support
const QRScanner = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [manualId, setManualId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [mode, setMode] = useState("issue"); // "issue" or "return"
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);
  const lastScannedRef = useRef("");
  const RESCAN_DELAY_MS = 3000; // Time before allowing re-scan after an error

  // Deduplicated scan handler via useCallback
  const handleScanSuccess = useCallback(
    async (decodedText) => {
      // Prevent duplicate scans of the same code
      if (lastScannedRef.current === decodedText) return;
      lastScannedRef.current = decodedText;

      const bookId = decodedText.trim();
      if (!bookId) return;

      setManualId(bookId);
      setProcessing(true);

      let result;
      if (mode === "return") {
        result = await dispatch(returnByQR(bookId));
      } else {
        result = await dispatch(issueBook(bookId));
      }

      setProcessing(false);
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(
          mode === "return" ? "Book returned via QR!" : "Book issued via QR!"
        );
        setManualId("");
        lastScannedRef.current = "";
        onClose?.();
      } else {
        toast.error(result.payload || `Failed to ${mode} book`);
        // Allow re-scanning after error
        setTimeout(() => {
          lastScannedRef.current = "";
        }, RESCAN_DELAY_MS);
      }
    },
    [dispatch, mode, onClose]
  );

  // Start camera scanner
  const startCamera = useCallback(async () => {
    setCameraError("");
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (!scannerRef.current) return;

      const scanner = new Html5Qrcode(scannerRef.current.id);
      scannerInstanceRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleScanSuccess,
        () => {} // ignore scan failures (no QR in frame)
      );
      setCameraActive(true);
    } catch (err) {
      setCameraError(
        err.toString().includes("NotAllowed")
          ? "Camera permission denied. Please allow camera access."
          : "Camera not available. Use manual entry below."
      );
      setCameraActive(false);
    }
  }, [handleScanSuccess]);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (scannerInstanceRef.current) {
        scannerInstanceRef.current.stop().catch(() => {});
        scannerInstanceRef.current = null;
      }
    };
  }, []);

  const stopCamera = async () => {
    if (scannerInstanceRef.current) {
      try {
        await scannerInstanceRef.current.stop();
      } catch {
        // ignore
      }
      scannerInstanceRef.current = null;
    }
    setCameraActive(false);
  };

  const handleManualAction = async () => {
    const bookId = manualId.trim();
    if (!bookId) {
      toast.error("Please enter a book ID");
      return;
    }
    setProcessing(true);

    let result;
    if (mode === "return") {
      result = await dispatch(returnByQR(bookId));
    } else {
      result = await dispatch(issueBook(bookId));
    }

    setProcessing(false);
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(
        mode === "return" ? "Book returned successfully!" : "Book issued successfully!"
      );
      setManualId("");
      onClose?.();
    } else {
      toast.error(result.payload || `Failed to ${mode} book`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">📷 QR Issue / Return</h2>
          <button
            onClick={() => {
              stopCamera();
              onClose?.();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setMode("issue")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === "issue"
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Issue Book
          </button>
          <button
            onClick={() => setMode("return")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === "return"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Return Book
          </button>
        </div>

        {user?.role === "admin" && mode === "return" && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">
            Admin mode: can return any user&apos;s book
          </p>
        )}

        {/* Camera scanner area */}
        <div className="mb-4">
          {!cameraActive ? (
            <button
              onClick={startCamera}
              className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors"
            >
              <FiCamera className="text-3xl text-indigo-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">
                Tap to open camera scanner
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Point at a book&apos;s QR code
              </p>
            </button>
          ) : (
            <div className="relative">
              <div
                id="qr-reader"
                ref={scannerRef}
                className="rounded-xl overflow-hidden"
              />
              <button
                onClick={stopCamera}
                className="mt-2 text-xs text-red-500 hover:underline"
              >
                Stop camera
              </button>
            </div>
          )}
          {/* Fallback div for scanner ID when camera not yet active */}
          {!cameraActive && (
            <div id="qr-reader" ref={scannerRef} className="hidden" />
          )}
          {cameraError && (
            <p className="text-xs text-red-500 mt-2">{cameraError}</p>
          )}
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-gray-400">
              or enter manually
            </span>
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Book ID
        </label>
        <input
          type="text"
          value={manualId}
          onChange={(e) => setManualId(e.target.value)}
          placeholder="Paste book ID here…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none mb-3"
          onKeyDown={(e) => e.key === "Enter" && handleManualAction()}
        />
        <button
          onClick={handleManualAction}
          disabled={processing}
          className={`w-full text-white py-2 rounded-lg font-semibold disabled:opacity-50 transition-colors ${
            mode === "return"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {processing
            ? "Processing…"
            : mode === "return"
            ? "Return Book"
            : "Issue Book"}
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
