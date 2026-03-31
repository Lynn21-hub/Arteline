import React, { useEffect, useState } from "react";
import { getCheckoutSummary } from "../api/cartAPI";
import { placeOrderCOD, placeOrderStripe } from "../api/orderAPI";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCheckout = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getCheckoutSummary();
        setCheckout(data);
      } catch (err) {
        console.error("Checkout load error:", err);
        setError(err.response?.data?.message || "Failed to load checkout.");
      } finally {
        setLoading(false);
      }
    };

    loadCheckout();
  }, []);

  const handleCOD = async () => {
    try {
      setProcessing(true);
      setError("");
      const data = await placeOrderCOD();
      alert(data.message || "Order placed successfully");
      navigate("/orders");
    } catch (err) {
      console.error("COD error:", err);
      setError(err.response?.data?.message || "Failed to place COD order.");
    } finally {
      setProcessing(false);
    }
  };

  const handleStripe = async () => {
    try {
      setProcessing(true);
      setError("");
      const data = await placeOrderStripe();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setError("Stripe checkout URL was not returned.");
    } catch (err) {
      console.error("Stripe error:", err);
      setError(err.response?.data?.message || "Failed to start Stripe checkout.");
      setProcessing(false);
    }
  };

  if (loading) return <div style={styles.message}>Loading checkout...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>

      {error && <p style={styles.error}>{error}</p>}

      {!checkout?.items?.length ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyText}>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div style={styles.itemsBox}>
            {checkout.items.map((item) => (
              <div key={item.cartItemId} style={styles.card}>
                <img
                  src={item.image_url || "https://picsum.photos/160"}
                  alt={item.title}
                  style={styles.image}
                />

                <div style={styles.info}>
                  <h3 style={styles.itemTitle}>{item.title}</h3>
                  <p style={styles.artist}>by {item.artist_name || "Unknown Artist"}</p>
                  <p style={styles.price}>${Number(item.price || 0).toFixed(2)}</p>
                  <p style={styles.text}>Quantity: {item.quantity}</p>
                  <p style={styles.text}>
                    Line Total: ${Number(item.lineTotal || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.summaryBox}>
            <p style={styles.text}>
              Subtotal: ${Number(checkout.subtotal || 0).toFixed(2)}
            </p>
            <p style={styles.text}>
              Shipping: ${Number(checkout.shipping || 0).toFixed(2)}
            </p>
            <p style={styles.text}>
              Tax: ${Number(checkout.tax || 0).toFixed(2)}
            </p>
            <h2 style={styles.total}>
              Total: ${Number(checkout.total || 0).toFixed(2)}
            </h2>

            <div style={styles.buttonRow}>
              <button
                style={styles.codBtn}
                onClick={handleCOD}
                disabled={processing}
              >
                Cash on Delivery
              </button>

              <button
                style={styles.cardBtn}
                onClick={handleStripe}
                disabled={processing}
              >
                Pay by Card
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f8f6f2",
    padding: "50px 8%",
    fontFamily: "'Poppins', Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "42px",
    marginBottom: "30px",
    color: "#1f1f1f",
  },
  message: {
    textAlign: "center",
    padding: "60px",
    fontSize: "18px",
  },
  error: {
    textAlign: "center",
    color: "red",
    marginBottom: "20px",
  },
  emptyBox: {
    background: "white",
    borderRadius: "20px",
    padding: "50px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },
  emptyText: {
    margin: 0,
    fontSize: "18px",
    color: "#666",
  },
  itemsBox: {
    display: "grid",
    gap: "24px",
  },
  card: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    background: "white",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    flexWrap: "wrap",
  },
  image: {
    width: "160px",
    height: "160px",
    objectFit: "cover",
    borderRadius: "16px",
    background: "#eee",
  },
  info: {
    flex: 1,
    minWidth: "220px",
  },
  itemTitle: {
    margin: "0 0 8px",
    fontSize: "22px",
    color: "#222",
  },
  artist: {
    margin: "0 0 10px",
    color: "#666",
  },
  price: {
    margin: "0 0 10px",
    fontWeight: "600",
    fontSize: "18px",
    color: "#8b5e3c",
  },
  text: {
    margin: "6px 0",
    color: "#444",
  },
  summaryBox: {
    marginTop: "32px",
    background: "white",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },
  total: {
    marginTop: "12px",
    fontSize: "28px",
    color: "#1f1f1f",
  },
  buttonRow: {
    marginTop: "20px",
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },
  codBtn: {
    background: "#8b5e3c",
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "600",
  },
  cardBtn: {
    background: "#1f1f1f",
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Checkout;