import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();

  return (
    <>
      <style>{css}</style>
      <div className="admin-login-page">
        <div className="admin-login-shell">
          <button
            type="button"
            className="admin-login-back"
            onClick={() => navigate("/")}
          >
            ← Back to home
          </button>

          <div className="admin-login-panel">
            <p className="admin-login-kicker">ADMIN ACCESS</p>
            <h1>Sign in to manage artworks</h1>
            <p className="admin-login-copy">
              This page is reserved for administrators. Use your admin credentials
              to continue.
            </p>

            <AuthForm userRole="admin" onLoginSuccess={onLoginSuccess} />
          </div>
        </div>
      </div>
    </>
  );
}

const css = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: radial-gradient(circle at top right, #ece1d4 0%, #f7f3ed 60%);
    font-family: Arial, sans-serif;
    color: #111;
  }

  .admin-login-page {
    min-height: calc(100vh - 76px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 16px 60px;
  }

  .admin-login-shell {
    width: min(1040px, 100%);
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .admin-login-back {
    align-self: flex-start;
    border: none;
    background: #fff;
    border-radius: 999px;
    padding: 10px 14px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .admin-login-panel {
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.1);
    padding: 36px;
    display: grid;
    gap: 16px;
  }

  .admin-login-kicker {
    margin: 0;
    color: #6f3f2c;
    font-size: 12px;
    letter-spacing: 2px;
    font-weight: 700;
  }

  .admin-login-panel h1 {
    margin: 0;
    font-family: Georgia, serif;
    font-size: clamp(32px, 5vw, 48px);
    line-height: 1.05;
  }

  .admin-login-copy {
    margin: 0;
    max-width: 560px;
    color: #5d564e;
    line-height: 1.6;
  }

  @media (max-width: 680px) {
    .admin-login-panel {
      border-radius: 18px;
      padding: 20px;
    }
  }
`;

export default AdminLogin;
