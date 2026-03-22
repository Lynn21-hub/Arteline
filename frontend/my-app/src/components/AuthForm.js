import React, { useState } from 'react';
import { signIn, signUp } from 'aws-amplify/auth';
import ConfirmSignup from './ConfirmSignup';

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignup) {
        await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email: email,
            },
          },
        });

        setShowConfirm(true);
      } else {
        await signIn({ username: email, password });
        console.log('Signed in!');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (showConfirm) {
    return (
      <ConfirmSignup
        email={email}
        password={password}
        onSuccess={() => setShowConfirm(false)}
      />
    );
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* TITLE */}
        <h2 style={styles.title}>
          {isSignup ? "Create Account" : "Welcome back"}
        </h2>

        {/* SUBTITLE */}
        <p style={styles.subtitle}>
          {isSignup
            ? "Create your account to explore and collect art"
            : "Log in to continue your journey"}
        </p>

        {/* INPUTS */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        {/* ERROR */}
        {error && <p style={styles.error}>{error}</p>}

        {/* BUTTON */}
        <button type="submit" style={styles.button}>
          {isSignup ? "Sign Up" : "Log In"}
        </button>

        {/* TOGGLE */}
        <p style={styles.toggle}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)} style={styles.link}>
            {isSignup ? " Log in" : " Sign up"}
          </span>
        </p>

      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "350px",
  },

  title: {
    marginBottom: "10px",
    fontSize: "26px",
    fontWeight: "600",
    color: "#ff6b35", // 🔥 ORANGE
  },

  subtitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#666",
  },

  input: {
    marginBottom: "15px",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  button: {
    padding: "12px",
    backgroundColor: "#ff6b35", // 🔥 ORANGE BUTTON
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  toggle: {
    marginTop: "15px",
    fontSize: "14px",
  },

  link: {
    color: "#ff6b35",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default AuthForm;