import React, { useEffect, useState } from "react";
import { getUserOrders } from "../api/orderAPI";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <div style={styles.message}>Loading orders...</div>;

  return (
    <div style={styles.container}>
      <p style={styles.kicker}>COLLECTOR DASHBOARD</p>
      <h1 style={styles.title}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={styles.emptyBox}>No orders yet.</div>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={styles.card}>
            <p style={styles.orderLabel}>Order</p>
            <h3 style={styles.orderId}>#{order.id}</h3>
            <p style={styles.detail}>Status: {order.status}</p>
            <p style={styles.detail}>Payment Method: {order.payment_method}</p>
            <p style={styles.detail}>Payment Status: {order.payment_status}</p>
            <p style={styles.total}>Total: ${Number(order.total).toFixed(2)}</p>

            {order.orderItems?.map((item) => (
              <div key={item.id} style={styles.itemRow}>
                <p style={styles.itemText}>
                  {item.artwork?.title || `Artwork #${item.artwork_id}`} x {item.quantity}
                </p>
              </div>
            ))}
          </div>
        ))
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
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
  },
  orderLabel: {
    margin: "0 0 6px",
    color: "#b06b3f",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  orderId: {
    margin: "0 0 12px",
    fontSize: "34px",
    fontFamily: "Georgia, serif",
  },
  detail: {
    margin: "0 0 8px",
    color: "#555",
  },
  total: {
    margin: "8px 0 0",
    fontSize: "24px",
    fontWeight: "700",
    color: "#111",
  },
  itemRow: {
    marginTop: "10px",
    background: "#f7f4ef",
    borderRadius: "12px",
    padding: "10px 12px",
  },
  itemText: {
    margin: 0,
    color: "#333",
  },
};

export default Orders;