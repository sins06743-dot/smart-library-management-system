import BookCard from "./BookCard";
import Loader from "../common/Loader";

// Grid display of books
const BookList = ({ books, loading }) => {
  if (loading) {
    return <Loader />;
  }

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">No books found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
};

export default BookList;
