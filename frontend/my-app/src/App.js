import "./App.css";
import React, { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { getCurrentUser } from "aws-amplify/auth";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Profile from "./pages/Profile";
import Home from "./pages/Home";
import AuthModal from "./components/AuthModal";
import ProfileDropdown from "./components/ProfileDropdown";
import Artworks from "./pages/Artworks";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-west-1_75sr500CR",
      userPoolClientId: "70p1ungik7dq8vcjtdnaqbc002",
    },
  },
});

const baseNavBtn = {
  background: "none",
  border: "none",
  fontSize: "15px",
  cursor: "pointer",
  fontWeight: "500",
  color: "#111",
  padding: "6px 4px",
};

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkUser();
  }, []);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setShowDropdown(!showDropdown);
    } else {
      setShowModal(true);
    }
  };

  const getNavStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      ...baseNavBtn,
      color: isActive ? "#ff6b35" : "#111",
      borderBottom: isActive ? "2px solid #ff6b35" : "none",
    };
  };

  return (
    <div>
      <div
        style={{
          padding: "16px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          borderBottom: "1px solid #eee",
        }}
      >
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <button onClick={() => navigate("/")} style={getNavStyle("/")}>
            Home
          </button>

          <button
            onClick={() => navigate("/artworks")}
            style={getNavStyle("/artworks")}
          >
            Artworks
          </button>
        </div>

        <div style={{ position: "relative" }}>
          <button
            onClick={handleProfileClick}
            style={{
              background: "none",
              border: "none",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            👤
          </button>

          {showDropdown && (
            <ProfileDropdown
              goToProfile={() => {
                navigate("/profile");
                setShowDropdown(false);
              }}
              goToCart={() => {
                navigate("/cart");
                setShowDropdown(false);
              }}
            />
          )}
        </div>
      </div>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;