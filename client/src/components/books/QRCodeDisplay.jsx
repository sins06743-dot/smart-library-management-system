import { FiDownload, FiPrinter } from "react-icons/fi";

const QRCodeDisplay = ({ book }) => {
  if (!book?.qrCode) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = `QR-${book.title.replace(/\s+/g, "-")}.png`;
    link.href = book.qrCode;
    link.click();
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html><body style="text-align:center;padding:20px">
        <h2>${book.title}</h2>
        <p>by ${book.author}</p>
        <img src="${book.qrCode}" style="width:200px;height:200px" />
        <p>ISBN: ${book.ISBN}</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <p className="text-sm font-semibold text-gray-700">Book QR Code</p>
      <img
        src={book.qrCode}
        alt={`QR code for ${book.title}`}
        className="w-32 h-32 border border-gray-300 rounded-lg"
      />
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FiDownload /> Download
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1 text-xs bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FiPrinter /> Print
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
