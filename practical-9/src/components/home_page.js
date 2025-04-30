import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../components/product';
function HomePage({ addToCart }) {
  return (
    <div>
      <h1>Featured Products</h1>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.title} />
              <div className="product-info">
                <div className="product-title">{product.title}</div>
                <div className="product-price">${product.price.toFixed(2)}</div>
                <div className="product-rating">
                  <span className="rating-badge">{product.rating} ★</span>
                  <span>{product.reviews} reviews</span>
                </div>
              </div>
            </Link>
            <button 
              className="add-to-cart"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;