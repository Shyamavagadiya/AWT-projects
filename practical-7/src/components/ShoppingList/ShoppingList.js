// src/components/ShoppingList/ShoppingList.js
import React, { useState } from 'react';
import './ShoppingList.css';

const ShoppingList = ({ products }) => {
  const [filters, setFilters] = useState({
    category: 'all',
    price: 'all',
    searchQuery: ''
  });

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Filter by category
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }
    
    // Filter by price range
    if (filters.price !== 'all') {
      if (filters.price === 'under25' && product.price >= 25) return false;
      if (filters.price === '25to50' && (product.price < 25 || product.price > 50)) return false;
      if (filters.price === 'over50' && product.price <= 50) return false;
    }
    
    // Filter by search query
    if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Get unique categories for the filter dropdown
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="shopping-container">
      <h2>Product List</h2>
      
      <div className="filter-container">
        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Price Range:</label>
          <select 
            value={filters.price}
            onChange={(e) => handleFilterChange('price', e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="under25">Under $25</option>
            <option value="25to50">$25 to $50</option>
            <option value="over50">Over $50</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Search:</label>
          <input 
            type="text"
            placeholder="Search products..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
        </div>
      </div>
      
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products match your filters.</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;