import React, { useEffect, useState } from "react";
import { getCheckoutSummary } from "../api/cartAPI";

function Checkout() {
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCheckout = async () => {
      try {
        setLoading(true);
        const data = await getCheckoutSummary();
        setCheckout(data);
      } catch (err) {
        console.error("Error loading checkout:", err);
        setError("Failed to load checkout summary.");
      } finally {
        setLoading(false);
      }
    };

    loadCheckout();
  }, []);

  if (loading) return <div style={{ padding: "40px" }}>Loading checkout...</div>;
  if (error) return <div style={{ padding: "40px", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "40px 8%", background: "#f8f6f2", minHeight: "100vh" }}>
      <h1>Checkout</h1>

      {checkout?.items?.map((item) => (
        <div
          key={item.cartItemId}
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "16px",
          }}
        >
          <h3>{item.title}</h3>
          <p>Artist: {item.artist_name}</p>
          <p>Price: ${item.price}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Line Total: ${item.lineTotal}</p>
        </div>
      ))}

      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          marginTop: "24px",
        }}
      >
        <p>Subtotal: ${Number(checkout?.subtotal || 0).toFixed(2)}</p>
        <p>Shipping: ${Number(checkout?.shipping || 0).toFixed(2)}</p>
        <p>Tax: ${Number(checkout?.tax || 0).toFixed(2)}</p>
        <h2>Total: ${Number(checkout?.total || 0).toFixed(2)}</h2>
      </div>
    </div>
  );
}

export default Checkout;