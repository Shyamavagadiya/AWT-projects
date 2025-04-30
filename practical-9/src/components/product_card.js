import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../components/product';

function ProductPage({ addToCart }) {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-detail">
      <div className="product-image">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-content">
        <h1>{product.title}</h1>
        <div className="product-rating">
          <span className="rating-badge">{product.rating} ★</span>
          <span>{product.reviews} reviews</span>
        </div>
        <div className="product-price">${product.price.toFixed(2)}</div>
        {product.oldPrice && (
          <span className="product-old-price">
            ${product.oldPrice.toFixed(2)}
          </span>
        )}
        <p className="product-description">{product.description}</p>
        <button 
          className="add-to-cart"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
        <div className="continue-shopping">
          <Link to="/">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;