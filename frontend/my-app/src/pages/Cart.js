import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCartQuantity,getCheckoutSummary } from "../api/cartAPI";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [checkout, setCheckout] = useState(null);

  const loadCart = async () => {
      try {
        setLoading(true);
        setError("");
    
        const [cartData, checkoutData] = await Promise.all([
          getCart(),
          getCheckoutSummary(),
        ]);
    
        setCartItems(cartData.items || []);
        setCheckout(checkoutData);
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
      setError("Could not update quantity.");
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
      setError("Could not update quantity.");
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
      setError("Could not remove item.");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = Number(item.artwork?.price || 0);
    const quantity = Number(item.quantity || 1);
    return sum + price * quantity;
  }, 0);

  if (loading) {
    return <div style={styles.message}>Loading cart...</div>;
  }

  return (
    <div style={styles.container}>
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
              const artworkId = item.artwork_id;
              const quantity = item.quantity;
              const artwork = item.artwork;

              return (
                <div key={item.id} style={styles.card}>
                  <img
                    src={artwork?.image_url || "https://via.placeholder.com/160"}
                    alt={artwork?.title || "Artwork"}
                    style={styles.image}
                  />

                  <div style={styles.info}>
                    <h3 style={styles.itemTitle}>{artwork?.title || "Untitled Artwork"}</h3>
                    <p style={styles.artist}>
                      by {artwork?.artist_name || "Unknown Artist"}
                    </p>
                    <p style={styles.price}>${artwork?.price || 0}</p>

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
            <h2 style={styles.total}>Total: ${totalPrice.toFixed(2)}</h2>
            <button style={styles.checkoutBtn}>Proceed to Checkout</button>
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
    margin: "0 0 18px",
    fontWeight: "600",
    fontSize: "18px",
    color: "#8b5e3c",
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
    background: "#1f1f1f",
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
    background: "#f3e7e1",
    color: "#b14d2f",
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
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  total: {
    margin: 0,
    fontSize: "28px",
    color: "#1f1f1f",
  },
  checkoutBtn: {
    background: "#1f1f1f",
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Cart;