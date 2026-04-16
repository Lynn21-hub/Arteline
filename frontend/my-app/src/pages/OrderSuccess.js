import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const sessionId = query.get("session_id");
  const method =
    query.get("method") || (sessionId ? "stripe" : "cod");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      navigate("/orders");
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [navigate]);

  const isStripe = method === "stripe";

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>ORDER CONFIRMED</p>
        <h1 style={styles.title}>
          {isStripe ? "Payment received" : "Order placed"}
        </h1>
        <p style={styles.text}>
          {isStripe
            ? "We're finalizing your Stripe purchase now. Your order will appear in your orders page shortly."
            : "Your cash on delivery order has been created successfully."}
        </p>
        {sessionId ? (
          <p style={styles.meta}>Checkout session: {sessionId}</p>
        ) : null}
        <button style={styles.button} onClick={() => navigate("/orders")}>
          View my orders
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "32px",
    background:
      "radial-gradient(circle at top, rgba(201,168,76,0.18), transparent 38%), #f7f3ed",
    fontFamily: "'Outfit', 'Poppins', Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "640px",
    padding: "42px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 22px 48px rgba(17, 15, 10, 0.08)",
    textAlign: "center",
  },
  eyebrow: {
    margin: "0 0 12px",
    letterSpacing: "0.28em",
    fontSize: "12px",
    fontWeight: 700,
    color: "#b4872b",
  },
  title: {
    margin: "0 0 16px",
    fontSize: "44px",
    lineHeight: 1.05,
    fontFamily: "'Playfair Display', serif",
    color: "#111",
  },
  text: {
    margin: "0 auto 18px",
    maxWidth: "480px",
    fontSize: "17px",
    lineHeight: 1.6,
    color: "#4b4339",
  },
  meta: {
    margin: "0 0 24px",
    fontSize: "13px",
    color: "#7d7266",
    wordBreak: "break-word",
  },
  button: {
    border: "none",
    borderRadius: "999px",
    padding: "14px 24px",
    background: "#1a1712",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default OrderSuccess;
