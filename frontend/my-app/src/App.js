import "./App.css";
import React, { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { getCurrentUser } from "aws-amplify/auth";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";

import RoleSelector from "./components/RoleSelector";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import AuthModal from "./components/AuthModal";
import ProfileDropdown from "./components/ProfileDropdown";
import Artworks from "./pages/Artworks";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import ArtworkDetails from "./pages/ArtworkDetails";
import ArtistInventory from "./pages/ArtistInventory";
import CreateArtwork from "./pages/CreateArtwork";
import EditArtwork from "./pages/EditArtwork";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-west-1_75sr500CR",
      userPoolClientId: "70p1ungik7dq8vcjtdnaqbc002",
    },
  },
});

const baseNavBtn = {
  all: "unset",
  background: "transparent",
  fontSize: "15px",
  cursor: "pointer",
  fontWeight: "500",
  color: "#111",
  padding: "6px 4px",
  outline: "none",
  boxShadow: "none",
  lineHeight: "1.2",
  display: "inline-flex",
  alignItems: "center",
  borderBottom: "2px solid transparent",
};

const profileBtnBase = {
  all: "unset",
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  border: "1px solid #d8c8b8",
  background: "#fffaf3",
  color: "#7a4e2f",
  cursor: "pointer",
  fontSize: "18px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
};

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || null;
  });

  const [showRoleSelector, setShowRoleSelector] = useState(!userRole);

  const checkUser = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const handleLoginSuccess = async () => {
    await checkUser();
    setShowModal(false);
  };

  const handleSelectRole = (role) => {
    localStorage.setItem("userRole", role);
    setUserRole(role);
    setShowRoleSelector(false);
    setShowModal(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowDropdown(false);
    setShowRoleSelector(true);
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setShowDropdown((prev) => !prev);
    } else {
      setShowRoleSelector(true);
    }
  };

  const getNavStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      ...baseNavBtn,
      color: isActive ? "#ff6b35" : "#111",
      borderBottom: isActive ? "2px solid #ff6b35" : "2px solid transparent",
    };
  };

  const renderNavItems = () => {
    if (userRole === "collector") {
      return (
        <>
          <button className="nav-btn" onClick={() => navigate("/")} style={getNavStyle("/")}>
            Home
          </button>

          <button className="nav-btn" onClick={() => navigate("/artworks")} style={getNavStyle("/artworks")}>
            Artworks
          </button>

          <button className="nav-btn" onClick={() => navigate("/cart")} style={getNavStyle("/cart")}>
            Cart
          </button>

          <button className="nav-btn" onClick={() => navigate("/orders")} style={getNavStyle("/orders")}>
            Orders
          </button>

          <button className="nav-btn" onClick={() => navigate("/profile")} style={getNavStyle("/profile")}>
            My information
          </button>
        </>
      );
    }

    return (
      <>
        <button className="nav-btn" onClick={() => navigate("/")} style={getNavStyle("/")}>
          Home
        </button>

        <button className="nav-btn" onClick={() => navigate("/artworks")} style={getNavStyle("/artworks")}>
          Artworks
        </button>

        <button
          className="nav-btn"
          onClick={() => navigate("/artist/inventory")}
          style={getNavStyle("/artist/inventory")}
        >
          My Inventory
        </button>

        <button
          className="nav-btn"
          onClick={() => navigate("/artist/artworks/new")}
          style={getNavStyle("/artist/artworks/new")}
        >
          Add Artwork
        </button>
      </>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4ef" }}>
      {/* ROLE SELECTOR */}
      {showRoleSelector && <RoleSelector onSelectRole={handleSelectRole} />}

      {/* NAVBAR */}
      {!showRoleSelector && (
        <div
          style={{
            padding: "16px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            background: "#f7f4ef",
            borderBottom: "none",
          }}
        >
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {renderNavItems()}
          </div>

          <div style={{ position: "relative" }}>
            <button
              className="profile-btn"
              onClick={handleProfileClick}
              style={{
                ...profileBtnBase,
                background: showDropdown ? "#f3e7dc" : "#fffaf3",
                borderColor: showDropdown ? "#c9a88c" : "#d8c8b8",
              }}
              aria-label="Account menu"
              title="Account"
            >
              👤
            </button>

            {showDropdown && (
              <ProfileDropdown
                onLogout={handleLogout}
              />
            )}
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {!showRoleSelector && showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onLoginSuccess={handleLoginSuccess}
          userRole={userRole}
        />
      )}

      {/* ROUTES */}
      {!showRoleSelector && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artworks" element={<Artworks />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/artworks/:id" element={<ArtworkDetails />} />
          <Route
            path="/artist/inventory"
            element={userRole === "artist" ? <ArtistInventory /> : <Navigate to="/" replace />}
          />
          <Route
            path="/artist/artworks/new"
            element={userRole === "artist" ? <CreateArtwork /> : <Navigate to="/" replace />}
          />
          <Route
            path="/artist/artworks/edit/:id"
            element={userRole === "artist" ? <EditArtwork /> : <Navigate to="/" replace />}
          />
        </Routes>
      )}
    </div>
  );
}

export default App;