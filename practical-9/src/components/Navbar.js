import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ cartCount }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">ShopKart</Link>
        <div className="search-bar">
          <input type="text" placeholder="Search for products..." />
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart ({cartCount})</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;