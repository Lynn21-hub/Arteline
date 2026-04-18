import React, { useEffect, useState } from "react";
import { getMySales } from "../api/artistOrderAPI";

function ArtistSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSales = async () => {
      try {
        setError("");
        const data = await getMySales();
        setSales(data.sales || []);
      } catch (err) {
        console.error("Artist sales error:", err);
        setError(err.response?.data?.message || "Failed to load sales");
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  if (loading) {
    return <div style={styles.message}>Loading sales...</div>;
  }

  return (
    <div style={styles.container}>
      <p style={styles.kicker}>ARTIST DASHBOARD</p>
      <h1 style={styles.title}>Sales</h1>

      {error && <div style={styles.errorBox}>{error}</div>}

      {!error && sales.length === 0 ? (
        <div style={styles.emptyBox}>No sales yet.</div>
      ) : (
        sales.map((sale) => {
          const paymentStatus = sale.order?.paymentStatus || "PENDING";
          const paymentMethod = sale.order?.paymentMethod || "-";
          const isPaid = paymentStatus === "PAID";

          return (
            <div key={sale.id} style={styles.card}>
              <div style={styles.headerRow}>
                <div>
                  <p style={styles.orderLabel}>Order #{sale.order?.id}</p>
                  <h3 style={styles.artworkTitle}>{sale.artwork?.title || "Artwork"}</h3>
                </div>

                <div style={styles.badges}>
                  <span style={isPaid ? styles.badgePaid : styles.badgePending}>
                    {isPaid ? "Paid" : "Payment Pending"}
                  </span>
                  <span style={styles.badgeMethod}>{paymentMethod}</span>
                </div>
              </div>

              <div style={styles.grid}>
                <div>
                  <p style={styles.label}>Collector</p>
                  <p style={styles.value}>{sale.order?.customerName || "-"}</p>
                </div>

                <div>
                  <p style={styles.label}>Phone</p>
                  <p style={styles.value}>{sale.order?.phoneNumber || "-"}</p>
                </div>

                <div>
                  <p style={styles.label}>Quantity</p>
                  <p style={styles.value}>{sale.quantity}</p>
                </div>

                <div>
                  <p style={styles.label}>Line Total</p>
                  <p style={styles.value}>${Number(sale.lineTotal || 0).toFixed(2)}</p>
                </div>
              </div>

              <div style={styles.shippingBox}>
                <p style={styles.label}>Shipping Address</p>
                <p style={styles.value}>
                  {sale.order?.shippingAddressLine1 || "-"}
                  {sale.order?.shippingAddressLine2 ? `, ${sale.order.shippingAddressLine2}` : ""}
                  {sale.order?.shippingCity ? `, ${sale.order.shippingCity}` : ""}
                  {sale.order?.shippingPostalCode ? `, ${sale.order.shippingPostalCode}` : ""}
                  {sale.order?.shippingCountry ? `, ${sale.order.shippingCountry}` : ""}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f7f4ef",
    padding: "40px 8%",
    fontFamily: "Arial, sans-serif",
    color: "#111",
  },
  kicker: {
    margin: "0 0 8px",
    color: "#b06b3f",
    fontSize: "12px",
    letterSpacing: "2px",
    fontWeight: "700",
  },
  title: {
    margin: "0 0 30px",
    fontSize: "48px",
    fontFamily: "Georgia, serif",
  },
  message: {
    textAlign: "center",
    padding: "60px",
    fontSize: "18px",
    background: "#f7f4ef",
    minHeight: "100vh",
  },
  emptyBox: {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
  },
  errorBox: {
    background: "#fff0f0",
    color: "#9f2d20",
    border: "1px solid #f3d3cd",
    borderRadius: "12px",
    padding: "14px",
    marginBottom: "18px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "14px",
  },
  orderLabel: {
    margin: "0 0 6px",
    color: "#b06b3f",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  artworkTitle: {
    margin: 0,
    fontSize: "28px",
    fontFamily: "Georgia, serif",
  },
  badges: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  badgePaid: {
    background: "#e8f6ec",
    color: "#237846",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: "700",
  },
  badgePending: {
    background: "#fff4e8",
    color: "#a6621c",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: "700",
  },
  badgeMethod: {
    background: "#f2ede6",
    color: "#5f4f3f",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: "700",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "12px",
    marginBottom: "14px",
  },
  label: {
    margin: "0 0 4px",
    color: "#777",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "700",
  },
  value: {
    margin: 0,
    color: "#333",
    lineHeight: 1.5,
  },
  shippingBox: {
    background: "#f7f4ef",
    borderRadius: "12px",
    padding: "12px",
  },
};

export default ArtistSales;
