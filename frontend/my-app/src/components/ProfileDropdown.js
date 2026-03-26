import React from "react";

function ProfileDropdown({ goToProfile, goToCart }) {
  return (
    <div style={styles.dropdown}>
      <button style={styles.item} onClick={goToProfile}>
        My information
      </button>

      <button style={styles.item}>
        Payment settings
      </button>

      <button style={styles.item} onClick={goToCart}>
        My cart
      </button>

      <button style={styles.item}>
        My orders
      </button>

      <button style={styles.logout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  dropdown: {
    position: "absolute",
    top: "48px",
    right: 0,
    width: "230px",
    background: "white",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    padding: "12px 0",
    zIndex: 1000,
  },

  item: {
    width: "100%",
    background: "none",
    border: "none",
    textAlign: "left",
    padding: "16px 18px",
    fontSize: "16px",
    cursor: "pointer",
    color: "#222",
  },

  logout: {
    width: "100%",
    background: "none",
    border: "none",
    textAlign: "left",
    padding: "16px 18px",
    fontSize: "16px",
    cursor: "pointer",
    color: "red",
  },
};

export default ProfileDropdown;