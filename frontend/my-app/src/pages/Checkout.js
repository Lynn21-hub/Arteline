import React, { useEffect, useState } from "react";
import { getCheckoutSummary } from "../api/cartAPI";
import { placeOrderCOD, placeOrderStripe } from "../api/orderAPI";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingMethod, setProcessingMethod] = useState("");
  const [error, setError] = useState("");
  const [shippingDetails, setShippingDetails] = useState({
    customerName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const navigate = useNavigate();

  const updateShippingField = (field) => (event) => {
    const { value } = event.target;
    setShippingDetails((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const validateShippingDetails = () => {
    if (!shippingDetails.customerName.trim()) {
      return "Please enter the recipient's full name.";
    }

    if (!shippingDetails.phoneNumber.trim()) {
      return "Please enter a phone number for delivery.";
    }

    if (!shippingDetails.addressLine1.trim()) {
      return "Please enter the delivery address.";
    }

    if (!shippingDetails.city.trim()) {
      return "Please enter the delivery city.";
    }

    if (!shippingDetails.postalCode.trim()) {
      return "Please enter the postal code.";
    }

    if (!shippingDetails.country.trim()) {
      return "Please enter the destination country.";
    }

    return "";
  };

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
    const validationError = validateShippingDetails();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setProcessingMethod("cod");
      setError("");
      await placeOrderCOD(shippingDetails);
      navigate("/order-success?method=cod");
    } catch (err) {
      console.error("COD error:", err);
      setError(err.response?.data?.message || "Failed to place COD order.");
    } finally {
      setProcessingMethod("");
    }
  };

  const handleStripe = async () => {
    const validationError = validateShippingDetails();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setProcessingMethod("stripe");
      setError("");
      const data = await placeOrderStripe(shippingDetails);

      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }

      setError("Stripe checkout URL was not returned.");
    } catch (err) {
      console.error("Stripe error:", err);
      setError(err.response?.data?.message || "Failed to start Stripe checkout.");
      setProcessingMethod("");
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
            <div style={styles.sectionHeader}>
              <p style={styles.sectionKicker}>Delivery Details</p>
              <h2 style={styles.sectionTitle}>Shipping information</h2>
            </div>

            <div style={styles.formGrid}>
              <label style={styles.field}>
                <span style={styles.label}>Full name</span>
                <input
                  style={styles.input}
                  value={shippingDetails.customerName}
                  onChange={updateShippingField("customerName")}
                  placeholder="Collector name"
                />
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Phone number</span>
                <input
                  style={styles.input}
                  value={shippingDetails.phoneNumber}
                  onChange={updateShippingField("phoneNumber")}
                  placeholder="+961..."
                />
              </label>

              <label style={{ ...styles.field, ...styles.fullWidth }}>
                <span style={styles.label}>Address line 1</span>
                <input
                  style={styles.input}
                  value={shippingDetails.addressLine1}
                  onChange={updateShippingField("addressLine1")}
                  placeholder="Street, building, floor"
                />
              </label>

              <label style={{ ...styles.field, ...styles.fullWidth }}>
                <span style={styles.label}>Address line 2</span>
                <input
                  style={styles.input}
                  value={shippingDetails.addressLine2}
                  onChange={updateShippingField("addressLine2")}
                  placeholder="Apartment, suite, landmark"
                />
              </label>

              <label style={styles.field}>
                <span style={styles.label}>City</span>
                <input
                  style={styles.input}
                  value={shippingDetails.city}
                  onChange={updateShippingField("city")}
                  placeholder="Beirut"
                />
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Postal code</span>
                <input
                  style={styles.input}
                  value={shippingDetails.postalCode}
                  onChange={updateShippingField("postalCode")}
                  placeholder="Postal code"
                />
              </label>

              <label style={{ ...styles.field, ...styles.fullWidth }}>
                <span style={styles.label}>Country</span>
                <input
                  style={styles.input}
                  value={shippingDetails.country}
                  onChange={updateShippingField("country")}
                  placeholder="Lebanon"
                />
              </label>
            </div>

            <div style={styles.divider} />

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
                disabled={Boolean(processingMethod)}
              >
                {processingMethod === "cod" ? "Processing..." : "Cash on Delivery"}
              </button>

              <button
                style={styles.cardBtn}
                onClick={handleStripe}
                disabled={Boolean(processingMethod)}
              >
                {processingMethod === "stripe" ? "Redirecting..." : "Pay by Card"}
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
  sectionHeader: {
    marginBottom: "18px",
  },
  sectionKicker: {
    margin: "0 0 6px",
    color: "#8b5e3c",
    fontSize: "12px",
    letterSpacing: "0.18em",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "28px",
    color: "#1f1f1f",
    fontFamily: "'Playfair Display', serif",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  field: {
    display: "grid",
    gap: "8px",
  },
  fullWidth: {
    gridColumn: "1 / -1",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#4b4035",
  },
  input: {
    width: "100%",
    borderRadius: "14px",
    border: "1px solid rgba(31,31,31,0.12)",
    padding: "13px 14px",
    fontSize: "15px",
    color: "#1f1f1f",
    background: "#fcfbf9",
    boxSizing: "border-box",
  },
  divider: {
    height: "1px",
    background: "rgba(31,31,31,0.08)",
    margin: "22px 0 18px",
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
