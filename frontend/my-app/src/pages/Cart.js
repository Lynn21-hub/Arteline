import React, { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  getCheckoutSummary,
} from "../api/cartAPI";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [checkout, setCheckout] = useState(null);
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const [cartData, checkoutData] = await Promise.all([
        getCart(),
        getCheckoutSummary(),
      ]);

      setCartItems(cartData.items || []);
      setCheckout(checkoutData || null);
    } catch (err) {
      console.error("Error loading cart:", err);
      setError(err.response?.data?.message || "Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleIncrease = async (artworkId, currentQty) => {
    try {
      setUpdatingId(artworkId);
      await updateCartQuantity(artworkId, currentQty + 1);
      await loadCart();
    } catch (err) {
      console.error("Error increasing quantity:", err);
      setError(err.response?.data?.message || "Could not update quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDecrease = async (artworkId, currentQty) => {
    try {
      setUpdatingId(artworkId);
      await updateCartQuantity(artworkId, currentQty - 1);
      await loadCart();
    } catch (err) {
      console.error("Error decreasing quantity:", err);
      setError(err.response?.data?.message || "Could not update quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (artworkId) => {
    try {
      setUpdatingId(artworkId);
      await removeFromCart(artworkId);
      await loadCart();
    } catch (err) {
      console.error("Error removing item:", err);
      setError(err.response?.data?.message || "Could not remove item.");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPrice =
    checkout?.total ??
    cartItems.reduce((sum, item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 1);
      return sum + price * quantity;
    }, 0);

  if (loading) {
    return <div style={styles.message}>Loading cart...</div>;
  }

  return (
    <div style={styles.container}>
      <p style={styles.kicker}>COLLECTOR DASHBOARD</p>
      <h1 style={styles.title}>My Cart</h1>

      {error && <p style={styles.error}>{error}</p>}

      {cartItems.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyText}>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div style={styles.cartList}>
            {cartItems.map((item) => {
              const artworkId = item.artworkId;
              const quantity = item.quantity;

              return (
                <div key={item.cartItemId} style={styles.card}>
                  <img
                    src={item.image_url || "https://via.placeholder.com/160"}
                    alt={item.title || "Artwork"}
                    style={styles.image}
                  />

                  <div style={styles.info}>
                    <p style={styles.category}>{item.category || "ARTWORK"}</p>
                    <h3 style={styles.itemTitle}>
                      {item.title || "Untitled Artwork"}
                    </h3>
                    <p style={styles.artist}>
                      by {item.artist_name || "Unknown Artist"}
                    </p>
                    <p style={styles.price}>
                      ${Number(item.price || 0).toFixed(2)}
                    </p>

                    <div style={styles.controlsRow}>
                      <div style={styles.quantityBox}>
                        <button
                          style={styles.qtyBtn}
                          onClick={() => handleDecrease(artworkId, quantity)}
                          disabled={updatingId === artworkId}
                        >
                          -
                        </button>

                        <span style={styles.quantity}>{quantity}</span>

                        <button
                          style={styles.qtyBtn}
                          onClick={() => handleIncrease(artworkId, quantity)}
                          disabled={updatingId === artworkId}
                        >
                          +
                        </button>
                      </div>

                      <button
                        style={styles.removeBtn}
                        onClick={() => handleRemove(artworkId)}
                        disabled={updatingId === artworkId}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.summaryBox}>
            <h2 style={styles.total}>Total: ${Number(totalPrice).toFixed(2)}</h2>
            <button
              style={styles.checkoutBtn}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
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
    color: "#111",
    fontFamily: "Georgia, serif",
  },
  message: {
    textAlign: "center",
    padding: "60px",
    fontSize: "18px",
    background: "#f7f4ef",
    minHeight: "100vh",
  },
  error: {
    textAlign: "left",
    color: "#9f2d20",
    marginBottom: "20px",
    background: "#f3e7e3",
    borderRadius: "12px",
    padding: "12px 14px",
  },
  emptyBox: {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
  },
  emptyText: {
    margin: 0,
    fontSize: "18px",
    color: "#666",
  },
  cartList: {
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
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
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
  category: {
    margin: "0 0 6px",
    color: "#b06b3f",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  itemTitle: {
    margin: "0 0 8px",
    fontSize: "30px",
    color: "#111",
    fontFamily: "Georgia, serif",
  },
  artist: {
    margin: "0 0 10px",
    color: "#666",
  },
  price: {
    margin: "0 0 18px",
    fontWeight: "700",
    fontSize: "22px",
    color: "#111",
  },
  controlsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  quantityBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  qtyBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: "none",
    background: "#111",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
  },
  quantity: {
    minWidth: "20px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "600",
  },
  removeBtn: {
    background: "#f3e7e3",
    color: "#9f2d20",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  summaryBox: {
    marginTop: "32px",
    background: "white",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  total: {
    margin: 0,
    fontSize: "30px",
    color: "#111",
    fontFamily: "Georgia, serif",
  },
  checkoutBtn: {
    background: "#111",
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
  },
};

export default Cart;