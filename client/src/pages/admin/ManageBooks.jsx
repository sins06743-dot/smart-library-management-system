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
import { Plus, Pencil, Trash2, X, BookOpen } from "lucide-react";

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
    <div className="flex min-h-screen pt-16">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-white">Manage Books</h1>
          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all flex items-center gap-2 font-medium shadow-glow-sm"
          >
            <Plus className="w-4 h-4" /> Add Book
          </button>
        </div>

        {/* Books Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/5 text-gray-400 text-sm">
                  <th className="px-6 py-4 text-left font-semibold">Book</th>
                  <th className="px-6 py-4 text-left font-semibold">Author</th>
                  <th className="px-6 py-4 text-left font-semibold">Category</th>
                  <th className="px-6 py-4 text-left font-semibold">ISBN</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="w-10 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-12 bg-violet-500/10 rounded flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-violet-400" />
                          </div>
                        )}
                        <span className="font-medium text-white">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className="bg-violet-500/10 text-violet-400 text-xs font-medium px-2 py-1 rounded-full border border-violet-500/20">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{book.ISBN}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          book.availability
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {book.availability ? "Available" : "Borrowed"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(book)}
                          className="text-cyan-400 hover:bg-cyan-500/10 p-2 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-xl font-bold text-white">
                  {editingBook ? "Edit Book" : "Add New Book"}
                </h2>
                <button
                  onClick={() => { setShowModal(false); setEditingBook(null); }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
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
