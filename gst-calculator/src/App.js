import { useState } from "react";

function App() {
  const [amount, setAmount] = useState("");
  const [gst, setGst] = useState("");
  const [total, setTotal] = useState(null);

  const calculateGST = () => {
    if (amount && gst) {
      const gstAmount = (parseFloat(amount) * parseFloat(gst)) / 100;
      setTotal(parseFloat(amount) + gstAmount);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>GST Calculator</h2>
      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br /><br />
      <input
        type="number"
        placeholder="Enter GST %"
        value={gst}
        onChange={(e) => setGst(e.target.value)}
      />
      <br /><br />
      <button onClick={calculateGST}>Calculate</button>
      <h3>Total Amount: {total !== null ? `₹${total.toFixed(2)}` : "—"}</h3>
    </div>
  );
}

export default App;
