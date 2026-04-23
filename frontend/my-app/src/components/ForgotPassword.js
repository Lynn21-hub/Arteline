import React, { useState } from "react";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";

const styles = {
  container: {
    maxWidth: 400,
    margin: "60px auto",
    padding: 32,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
    fontFamily: "'Outfit', 'Poppins', Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 18,
    color: "#c9a84c",
    letterSpacing: "-0.5px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    margin: "10px 0",
    borderRadius: 8,
    border: "1px solid #e0e0e0",
    fontSize: 16,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px 0",
    background: "#c9a84c",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 12,
    transition: "background 0.2s",
  },
  message: {
    margin: "10px 0",
    color: "#c9a84c",
    fontWeight: 500,
    fontSize: 15,
    textAlign: "center",
  },
  error: {
    color: "#d32f2f",
    fontWeight: 500,
    margin: "10px 0",
    textAlign: "center",
  },
};

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Step 1: Request reset code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await resetPassword({ username: email });
      setStep(2);
      setMessage("A verification code has been sent to your email.");
    } catch (err) {
      setError(err.message || "Error requesting password reset.");
    }
  };

  // Step 2: Submit new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      setMessage("Password reset successful! You can now log in.");
      setStep(1);
      setEmail("");
      setCode("");
      setNewPassword("");
    } catch (err) {
      setError(err.message || "Error resetting password.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Reset Your Password</div>
      {message && <div style={styles.message}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}
      {step === 1 ? (
        <form onSubmit={handleRequestCode} style={{ width: "100%" }}>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">Send Reset Code</button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} style={{ width: "100%" }}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
