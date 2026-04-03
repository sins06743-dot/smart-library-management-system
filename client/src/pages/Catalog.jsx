import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks } from "../redux/slices/bookSlice";
import BookList from "../components/books/BookList";
import { motion } from "framer-motion";
import { Search, Library, ChevronLeft, ChevronRight } from "lucide-react";

const Catalog = () => {
  const dispatch = useDispatch();
  const { books, loading, totalBooks, totalPages, currentPage } = useSelector(
    (state) => state.books
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllBooks({ search, page }));
  }, [dispatch, search, page]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Library className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-gray-300 font-medium">Book Collection</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
            Book <span className="gradient-text">Catalog</span>
          </h1>
          <p className="text-gray-400">
            Browse our collection of {totalBooks} books
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-xl mx-auto mb-10"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by title, author, or category..."
              className="w-full pl-12 pr-4 py-3.5 bg-surface-200/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all backdrop-blur-sm text-base"
            />
          </div>
        </motion.div>

        {/* Book Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <BookList books={books} loading={loading} />
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center items-center gap-2 mt-10"
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  p === currentPage
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-glow-sm"
                    : "border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
