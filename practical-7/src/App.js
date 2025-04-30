import React, { useState } from 'react';
import './App.css';

function App() {
  const [amount, setAmount] = useState('');
  const [taxPercent, setTaxPercent] = useState('');
  const [gstAmount, setGstAmount] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

  // Handle GST calculation
  const handleCalculateGST = (e) => {
    e.preventDefault();

    if (amount && taxPercent) {
      // Calculate GST
      const gst = (amount * taxPercent) / 100;
      const total = parseFloat(amount) + gst;

      setGstAmount(gst.toFixed(2));  // Round GST to 2 decimal points
      setTotalAmount(total.toFixed(2));  // Round total to 2 decimal points
    } else {
      alert("Please enter both amount and GST percentage.");
    }
  };

  return (
    <div className="container">
      <div className="calculator">
        <h1>GST Calculator</h1>
        <form onSubmit={handleCalculateGST}>
          <div className="input-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="taxPercent">GST Percentage</label>
            <input
              type="number"
              id="taxPercent"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
              placeholder="Enter GST Percentage"
              required
            />
          </div>
          <button type="submit">Calculate GST</button>
        </form>

        {gstAmount && totalAmount && (
          <div className="result">
       <div>
  <strong>GST Amount:</strong> {formatCurrency(gstAmount)}
</div>
<div>
  <strong>Total Amount:</strong> {formatCurrency(totalAmount)}
</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;