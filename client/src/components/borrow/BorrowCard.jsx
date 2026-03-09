// Card displaying a single borrow record
const BorrowCard = ({ record, onReturn }) => {
  const isOverdue =
    record.status === "borrowed" && new Date(record.returnDate) < new Date();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-800">{record.book?.title}</h3>
          <p className="text-sm text-gray-500">by {record.book?.author}</p>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            record.status === "returned"
              ? "bg-green-100 text-green-700"
              : isOverdue
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {record.status === "returned" ? "Returned" : isOverdue ? "Overdue" : "Borrowed"}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-600 mb-4">
        <p>
          <span className="font-medium">Issued:</span>{" "}
          {new Date(record.issueDate).toLocaleDateString("en-IN")}
        </p>
        <p>
          <span className="font-medium">Due:</span>{" "}
          <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
            {new Date(record.returnDate).toLocaleDateString("en-IN")}
          </span>
        </p>
        {record.fine > 0 && (
          <p className="text-red-600 font-medium">Fine: ₹{record.fine}</p>
        )}
      </div>

      {record.status === "borrowed" && onReturn && (
        <button
          onClick={() => onReturn(record._id)}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Return Book
        </button>
      )}
    </div>
  );
};

export default BorrowCard;
