import React, { useState } from 'react';
import { signIn, signUp } from 'aws-amplify/auth';
import ConfirmSignup from './ConfirmSignup';

function AuthForm({ onLoginSuccess, userRole, defaultToSignup = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(defaultToSignup);
  const [showConfirm, setShowConfirm] = useState(false);
  const adminMode = userRole === 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignup && !adminMode) {
        await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email: email,
              'custom:userRole': userRole || 'collector', // Store role as custom attribute
            },
          },
        });

        setShowConfirm(true);
      } else {
        await signIn({ username: email, password });
        console.log('Signed in!');
        if (onLoginSuccess) {
          onLoginSuccess();
        }
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
          {adminMode ? "Admin sign in" : isSignup ? "Create Account" : "Welcome back"}
        </h2>

        {/* SUBTITLE */}
        <p style={styles.subtitle}>
          {adminMode
            ? "Sign in with your admin account to manage artworks."
            : isSignup
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
          {adminMode ? "Log In as Admin" : isSignup ? "Sign Up" : "Log In"}
        </button>

        {!adminMode && (
          <p style={styles.toggle}>
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <span onClick={() => setIsSignup(!isSignup)} style={styles.link}>
              {isSignup ? " Log in" : " Sign up"}
            </span>
          </p>
        )}

      </form>
    </div>
  );
}

const C = {
  parchment: "#f7f3ed",
  ink: "#0d0c0a",
  gold: "#c9a84c",
  muted: "#7a756e",
  white: "#ffffff",
};

const styles = {
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "420px",
    padding: "40px",
    background: C.white,
    borderRadius: "4px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
    border: "1px solid rgba(13,12,10,0.05)",
  },

  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "32px",
    fontWeight: "700",
    color: C.ink,
    marginBottom: "10px",
  },

  subtitle: {
    marginBottom: "24px",
    fontSize: "14px",
    color: C.muted,
    fontWeight: "300",
  },

  input: {
    marginBottom: "16px",
    padding: "14px",
    borderRadius: "3px",
    border: "1px solid rgba(13,12,10,0.15)",
    fontFamily: "'Outfit', sans-serif",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.2s",
  },

  button: {
    padding: "14px",
    backgroundColor: C.ink,
    color: C.white,
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
    fontSize: "14px",
    fontWeight: "500",
    letterSpacing: "0.5px",
    transition: "background 0.2s",
  },

  toggle: {
    marginTop: "18px",
    fontSize: "13px",
    color: C.muted,
  },

  link: {
    color: C.gold,
    fontWeight: "500",
    cursor: "pointer",
  },

  error: {
    color: "#d64545",
    marginBottom: "10px",
    fontSize: "13px",
  },
};

export default AuthForm;