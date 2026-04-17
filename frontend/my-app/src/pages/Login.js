import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const handleSuccess = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    }
    navigate("/artworks");
  };

  return (
    <>
      <style>{css}</style>
      <div className="signup-page">
        <div className="signup-shell">
          <button type="button" className="signup-back" onClick={() => navigate("/")}>
            Back to home
          </button>
          <AuthForm userRole="collector" onLoginSuccess={handleSuccess} defaultToSignup />
        </div>
      </div>
    </>
  );
}

export default Login;

const css = `
  .signup-page {
    min-height: calc(100vh - 76px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 36px 16px 56px;
    background: #f7f3ed;
  }

  .signup-shell {
    width: min(560px, 100%);
    display: grid;
    gap: 14px;
  }

  .signup-back {
    justify-self: start;
    border: 1px solid rgba(13, 12, 10, 0.16);
    background: #ffffff;
    border-radius: 999px;
    padding: 9px 14px;
    cursor: pointer;
    font-size: 13px;
  }
`;