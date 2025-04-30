import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

const BookForm = ({ bookToEdit, setBookToEdit, onBookAdded }) => {
  const [book, setBook] = useState({
    bookname: '',
    bookauthor: '',
    bookcost: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // When bookToEdit changes, update the form fields
  useEffect(() => {
    if (bookToEdit) {
      setBook(bookToEdit);
    }
  }, [bookToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prevBook => ({
      ...prevBook,
      [name]: name === 'bookcost' ? value : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      if (bookToEdit) {
        // Update existing book
        const bookRef = doc(db, 'book', bookToEdit.id);
        await updateDoc(bookRef, book);
        setSuccess('Book updated successfully!');
        setBookToEdit(null);
      } else {
        // Add new book
        const booksCollection = collection(db, 'book');
        await addDoc(booksCollection, book);
        setSuccess('Book added successfully!');
      }
      
      // Clear form
      setBook({
        bookname: '',
        bookauthor: '',
        bookcost: ''
      });
      
      // Trigger refresh of book list
      if (onBookAdded) onBookAdded();
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error("Error processing book:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setBookToEdit(null);
    setBook({
      bookname: '',
      bookauthor: '',
      bookcost: ''
    });
  };

  return (
    <div className="book-form-container">
      <h2>{bookToEdit ? 'Edit Book' : 'Add New Book'}</h2>
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="bookname">Book Name:</label>
          <input
            type="text"
            id="bookname"
            name="bookname"
            value={book.bookname}
            onChange={handleChange}
            required
            placeholder="It ends with us"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="bookauthor">Author:</label>
          <input
            type="text"
            id="bookauthor"
            name="bookauthor"
            value={book.bookauthor}
            onChange={handleChange}
            required
            placeholder="nsjcnd"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="bookcost">Price:</label>
          <input
            type="number"
            id="bookcost"
            name="bookcost"
            value={book.bookcost}
            onChange={handleChange}
            required
            placeholder="320"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : bookToEdit ? 'Update Book' : 'Add Book'}
          </button>
          
          {bookToEdit && (
            <button type="button" className="cancel-btn" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default BookForm;
