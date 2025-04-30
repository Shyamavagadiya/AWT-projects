import React from 'react';
import { Link } from 'react-router-dom';

function CartPage({ cart, removeFromCart }) {
  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <h2>Your cart is empty</h2>
        <div className="continue-shopping">
          <Link to="/">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      
      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <div className="cart-item-image">
            <img src={item.image} alt={item.title} />
          </div>
          <div className="cart-item-details">
            <div className="cart-item-title">{item.title}</div>
            <div className="cart-item-price">
              ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
            </div>
            <div className="cart-item-actions">
              <button 
                className="remove-button"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
      
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Total ({cart.reduce((total, item) => total + item.quantity, 0)} items):</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="checkout-button">
          Proceed to Checkout
        </button>
      </div>
      
      <div className="continue-shopping">
        <Link to="/">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default CartPage;