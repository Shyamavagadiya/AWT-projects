import React from 'react';
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const BookList = ({ books, loading, setBookToEdit, onBookDeleted }) => {
  const handleEdit = (book) => {
    setBookToEdit(book);
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const bookRef = doc(db, 'book', id);
        await deleteDoc(bookRef);
        
        // Trigger refresh of book list
        if (onBookDeleted) onBookDeleted();
      } catch (error) {
        console.error("Error deleting book:", error);
        alert(`Failed to delete book: ${error.message}`);
      }
    }
  };

  if (loading) {
    return <p className="loading-text">Loading books...</p>;
  }

  if (books.length === 0) {
    return <p className="no-books-text">No books found in the collection.</p>;
  }

  return (
    <div className="books-container">
      <h2>Books Collection</h2>
      <div className="books-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <h2 className="book-title">{book.bookname}</h2>
            <p className="book-author">By: {book.bookauthor}</p>
            <p className="book-cost">Price: ₹{book.bookcost}</p>
            <div className="book-actions">
              <button 
                className="edit-btn" 
                onClick={() => handleEdit(book)}
              >
                Edit
              </button>
              <button 
                className="delete-btn" 
                onClick={() => handleDelete(book.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
