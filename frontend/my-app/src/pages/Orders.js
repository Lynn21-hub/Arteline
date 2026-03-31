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

  if (loading) return <div style={{ padding: "40px" }}>Loading orders...</div>;

  return (
    <div style={{ padding: "40px 8%" }}>
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h3>Order #{order.id}</h3>
            <p>Status: {order.status}</p>
            <p>Payment Method: {order.payment_method}</p>
            <p>Payment Status: {order.payment_status}</p>
            <p>Total: ${Number(order.total).toFixed(2)}</p>

            {order.orderItems?.map((item) => (
              <div key={item.id} style={{ marginTop: "10px" }}>
                <p>
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

export default Orders;