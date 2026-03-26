import React, { useState } from 'react';
import AuthForm from './AuthForm';
import artImage from '../assets/art.jpg';

function AuthModal({ onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* CLOSE BUTTON */}
        <button onClick={onClose} style={styles.close}>×</button>

        {/* LEFT IMAGE */}
        <div style={styles.left}>
          <div style={styles.overlayText}>
            <h1>Artéline</h1>
            <p>Discover modern art</p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div style={styles.right}>
          <AuthForm />
        </div>

      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    display: "flex",
    width: "900px",
    height: "550px",
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    position: "relative",
  },

  left: {
    flex: 1,
    backgroundImage: `url(${artImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "flex-end",
    padding: "30px",
  },

  overlayText: {
    background: "rgba(0,0,0,0.5)",
    padding: "15px 20px",
    borderRadius: "8px",
    color: "white",
  },

  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },

  close: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
  },
};

export default AuthModal;