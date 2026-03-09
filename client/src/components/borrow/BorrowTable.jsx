// Table displaying borrow records
const BorrowTable = ({ records, onReturn, showUser = true, isAdmin = false }) => {
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-IN") : "N/A";
  };

  const isOverdue = (returnDate, status) => {
    return status === "borrowed" && new Date(returnDate) < new Date();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-100">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-sm">
            {showUser && <th className="px-4 py-3 text-left font-semibold">User</th>}
            <th className="px-4 py-3 text-left font-semibold">Book</th>
            <th className="px-4 py-3 text-left font-semibold">Issue Date</th>
            <th className="px-4 py-3 text-left font-semibold">Due Date</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Fine</th>
            {onReturn && <th className="px-4 py-3 text-left font-semibold">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.map((record) => (
            <tr key={record._id} className="hover:bg-gray-50 transition-colors">
              {showUser && (
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-800">{record.user?.name}</div>
                  <div className="text-gray-500 text-xs">{record.user?.email}</div>
                </td>
              )}
              <td className="px-4 py-3 text-sm">
                <div className="font-medium text-gray-800">{record.book?.title}</div>
                <div className="text-gray-500 text-xs">{record.book?.author}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDate(record.issueDate)}</td>
              <td className="px-4 py-3 text-sm">
                <span className={isOverdue(record.returnDate, record.status) ? "text-red-600 font-medium" : "text-gray-600"}>
                  {formatDate(record.returnDate)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    record.status === "returned"
                      ? "bg-green-100 text-green-700"
                      : isOverdue(record.returnDate, record.status)
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {record.status === "returned"
                    ? "Returned"
                    : isOverdue(record.returnDate, record.status)
                    ? "Overdue"
                    : "Borrowed"}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                {record.fine > 0 ? (
                  <span className="text-red-600 font-medium">₹{record.fine}</span>
                ) : (
                  <span className="text-gray-400">₹0</span>
                )}
              </td>
              {onReturn && (
                <td className="px-4 py-3">
                  {record.status === "borrowed" && (
                    <button
                      onClick={() => onReturn(record._id)}
                      className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Return
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-8 text-gray-400">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowTable;
