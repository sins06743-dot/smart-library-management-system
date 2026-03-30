import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { FiX, FiBookOpen, FiCheck } from "react-icons/fi";

const SCANNER_CONFIG = { fps: 10, qrbox: { width: 250, height: 250 } };

const createScanner = (onSuccess, onError) => {
  const scanner = new Html5QrcodeScanner("qr-reader", SCANNER_CONFIG);
  scanner.render(onSuccess, onError);
  return scanner;
};

const QRScanner = ({ onClose }) => {
  const scannerRef = useRef(null);
  const [scannedBook, setScannedBook] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    const handleScan = async (decodedText) => {
      try {
        scannerRef.current?.clear();
        setScanning(false);
        const { data } = await api.post("/books/scan", { qrData: decodedText });
        setScannedBook({ ...data.book, qrData: decodedText });
      } catch {
        toast.error("Invalid QR code or book not found");
        setScanning(true);
      }
    };

    scannerRef.current = createScanner(handleScan, () => {});

    return () => {
      try {
        scannerRef.current?.clear();
      } catch {
        // ignore cleanup errors
      }
    };
  }, []);

  const handleIssue = async () => {
    if (!scannedBook) return;
    setIssuing(true);
    try {
      const { data } = await api.post("/borrow/issue-qr", { qrData: scannedBook.qrData });
      if (data.success) {
        toast.success("Book borrowed successfully!");
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to borrow book");
    }
    setIssuing(false);
  };

  const handleScanAgain = () => {
    setScannedBook(null);
    setScanning(true);
    try {
      scannerRef.current?.clear();
    } catch {
      // ignore
    }
    const handleScan = async (decodedText) => {
      try {
        scannerRef.current?.clear();
        setScanning(false);
        const { data } = await api.post("/books/scan", { qrData: decodedText });
        setScannedBook({ ...data.book, qrData: decodedText });
      } catch {
        toast.error("Invalid QR code or book not found");
      }
    };
    scannerRef.current = createScanner(handleScan, () => {});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FiX className="text-xl" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">📷 Scan Book QR</h2>

        {scanning && <div id="qr-reader" className="w-full" />}

        {scannedBook && !scanning && (
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBookOpen className="text-2xl text-indigo-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">{scannedBook.title}</h3>
            <p className="text-gray-500 text-sm mb-1">by {scannedBook.author}</p>
            <span
              className={`inline-block text-xs px-2 py-1 rounded-full font-semibold mb-4 ${
                scannedBook.availability
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {scannedBook.availability ? "Available" : "Not Available"}
            </span>

            <div className="flex gap-3 justify-center">
              {scannedBook.availability && (
                <button
                  onClick={handleIssue}
                  disabled={issuing}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  <FiCheck /> {issuing ? "Issuing..." : "Borrow Book"}
                </button>
              )}
              <button
                onClick={handleScanAgain}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Scan Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
