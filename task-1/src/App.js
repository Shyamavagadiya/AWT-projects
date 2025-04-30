// src/App.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './App.css';
import BookForm from './components/BookForm';
import BookList from './components/BookList';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookToEdit, setBookToEdit] = useState(null);
  
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const booksCollection = collection(db, 'book');
      const booksSnapshot = await getDocs(booksCollection);
      const booksList = booksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(booksList);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Firebase CRUD Application</h1>
        <p>Manage your book collection with Firestore database</p>
      </header>
      
      <main className="app-main">
        <div className="form-section">
          <BookForm 
            bookToEdit={bookToEdit} 
            setBookToEdit={setBookToEdit} 
            onBookAdded={fetchBooks} 
          />
        </div>
        
        <div className="list-section">
          <BookList 
            books={books} 
            loading={loading} 
            setBookToEdit={setBookToEdit} 
            onBookDeleted={fetchBooks} 
          />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>React Firebase CRUD Demo - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;