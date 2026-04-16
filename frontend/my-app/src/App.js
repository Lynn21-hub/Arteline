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
import OrderSuccess from "./pages/OrderSuccess";
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

/* Load fonts once */
if (!document.getElementById("arteline-app-fonts")) {
  const link = document.createElement("link");
  link.id = "arteline-app-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap";
  document.head.appendChild(link);
}

const artelineColors = {
  parchment: "#f7f3ed",
  ink: "#0d0c0a",
  gold: "#c9a84c",
  border: "rgba(13,12,10,0.09)",
};

const navBtnBase = {
  all: "unset",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "400",
  color: artelineColors.ink,
  opacity: 0.72,
  padding: "4px 0",
  borderBottom: "1.5px solid transparent",
  fontFamily: "'Outfit', 'Poppins', Arial, sans-serif",
  transition: "opacity 0.2s ease, border-color 0.2s ease, color 0.2s ease",
};

const profileBtnBase = {
  all: "unset",
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  border: `1px solid ${artelineColors.border}`,
  background: "transparent",
  color: artelineColors.ink,
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
      ...navBtnBase,
      color: isActive ? artelineColors.gold : artelineColors.ink,
      opacity: isActive ? 1 : 0.72,
      borderBottom: isActive
        ? `1.5px solid ${artelineColors.gold}`
        : "1.5px solid transparent",
    };
  };

  const renderNavItems = () => {
    if (userRole === "collector") {
      return [
        { label: "Home", path: "/" },
        { label: "Artworks", path: "/artworks" },
        { label: "Cart", path: "/cart" },
        { label: "Orders", path: "/orders" },
        { label: "My information", path: "/profile" },
      ];
    }

    return [
      { label: "Home", path: "/" },
      { label: "Artworks", path: "/artworks" },
      { label: "My Inventory", path: "/artist/inventory" },
      { label: "Add Artwork", path: "/artist/artworks/new" },
    ];
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: artelineColors.parchment,
        fontFamily: "'Outfit', 'Poppins', Arial, sans-serif",
      }}
    >
      {showRoleSelector && <RoleSelector onSelectRole={handleSelectRole} />}

      {!showRoleSelector && (
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            background: "rgba(247,243,237,0.96)",
            backdropFilter: "blur(16px)",
            borderBottom: `1px solid ${artelineColors.border}`,
            padding: "18px 38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <div
            onClick={() => navigate("/")}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "28px",
              fontWeight: 700,
              color: artelineColors.ink,
              cursor: "pointer",
              letterSpacing: "-0.5px",
              flexShrink: 0,
            }}
          >
            Arté<span style={{ color: artelineColors.gold, fontStyle: "italic" }}>line</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "30px",
              flexWrap: "wrap",
              flex: 1,
            }}
          >
            {renderNavItems().map((item) => (
              <button
                key={item.label}
                className="nav-btn"
                onClick={() => navigate(item.path)}
                style={getNavStyle(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              className="profile-btn"
              onClick={handleProfileClick}
              style={{
                ...profileBtnBase,
                background: showDropdown ? "#f3ede6" : "transparent",
                borderColor: showDropdown ? "#c9a84c" : artelineColors.border,
              }}
              aria-label="Account menu"
              title="Account"
            >
              👤
            </button>

            {showDropdown && <ProfileDropdown onLogout={handleLogout} />}
          </div>
        </div>
      )}

      {!showRoleSelector && showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onLoginSuccess={handleLoginSuccess}
          userRole={userRole}
        />
      )}

      {!showRoleSelector && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artworks" element={<Artworks />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/payment-success" element={<OrderSuccess />} />
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
