import React, { useState } from 'react';
import { confirmSignUp, signIn } from 'aws-amplify/auth';

function ConfirmSignup({ email, password, onSuccess }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // ✅ Confirm user
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      // ✅ Auto login
      await signIn({ username: email, password });

      // ✅ Wait a moment for auth state to update
      await new Promise(resolve => setTimeout(resolve, 500));

      onSuccess(); // move to next step (close modal / redirect)
      
      // Redirect after state updates
      setTimeout(() => {
        window.location.href = "/";
      }, 100);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Confirm your account</h2>
      <p>Enter the code sent to your email</p>

      <form onSubmit={handleConfirm}>
        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={styles.input}
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          Confirm
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  input: {
    marginTop: "10px",
    padding: "10px",
    width: "100%",
  },
  button: {
    marginTop: "15px",
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
  },
  error: {
    color: "red",
  },
};

export default ConfirmSignup;