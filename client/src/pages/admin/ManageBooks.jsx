import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  clearBookState,
} from "../../redux/slices/bookSlice";
import Sidebar from "../../components/layout/Sidebar";
import BookForm from "../../components/books/BookForm";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiBookOpen } from "react-icons/fi";

const ManageBooks = () => {
  const dispatch = useDispatch();
  const { books, loading, error, message } = useSelector((state) => state.books);

  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    dispatch(getAllBooks({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBookState());
    }
    if (message) {
      toast.success(message);
      dispatch(clearBookState());
      setShowModal(false);
      setEditingBook(null);
    }
  }, [error, message, dispatch]);

  const handleAdd = () => {
    setEditingBook(null);
    setShowModal(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      const result = await dispatch(deleteBook(id));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Book deleted successfully!");
      }
    }
  };

  const handleSubmit = (formData) => {
    if (editingBook) {
      dispatch(updateBook({ id: editingBook._id, bookData: formData }));
    } else {
      dispatch(addBook(formData));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Manage Books</h1>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
          >
            <FiPlus /> Add Book
          </button>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="px-6 py-4 text-left font-semibold">Book</th>
                  <th className="px-6 py-4 text-left font-semibold">Author</th>
                  <th className="px-6 py-4 text-left font-semibold">Category</th>
                  <th className="px-6 py-4 text-left font-semibold">ISBN</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="w-10 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-12 bg-indigo-100 rounded flex items-center justify-center">
                            <FiBookOpen className="text-indigo-400" />
                          </div>
                        )}
                        <span className="font-medium text-gray-800">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{book.ISBN}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          book.availability
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {book.availability ? "Available" : "Borrowed"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(book)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400">
                      No books found. Add your first book!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingBook ? "Edit Book" : "Add New Book"}
                </h2>
                <button
                  onClick={() => { setShowModal(false); setEditingBook(null); }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <BookForm
                onSubmit={handleSubmit}
                initialData={editingBook}
                loading={loading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooks;
