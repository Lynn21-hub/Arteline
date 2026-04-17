import "./App.css";
import React, { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { fetchAuthSession, fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
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
import AdminArtworks from "./pages/AdminArtworks";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import ArtistProfile from "./pages/ArtistProfile";
import ArtistSales from "./pages/ArtistSales";
import ArtistPayouts from "./pages/ArtistPayouts";
import AdminPayouts from "./pages/AdminPayouts";
import { getMyArtistProfile } from "./api/artistAPI";

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
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showRoleSelector, setShowRoleSelector] = useState(false);

  // Check if current user is admin by calling backend
  const checkAdminStatus = async () => {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      
      if (!idToken) {
        setIsAdmin(false);
        return;
      }
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5001"}/api/auth/is-admin`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Admin check response:", data);
        setIsAdmin(data.isAdmin);
      } else {
        console.warn("Admin check failed with status:", response.status);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  const syncAuthenticatedRole = async () => {
    const attributes = await fetchUserAttributes();
    const selectedRole = localStorage.getItem("selectedRole");
    const attributeRole = attributes["custom:userRole"];
    const resolvedRole = selectedRole || attributeRole || "collector";

    setUserRole(resolvedRole);

    if (!selectedRole && attributeRole) {
      localStorage.setItem("selectedRole", attributeRole);
    }

    setShowRoleSelector(false);
    
    // Check if user is admin
    await checkAdminStatus();
  };

  const checkUser = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
      await syncAuthenticatedRole();
    } catch {
      setIsAuthenticated(false);
      const storedRole = localStorage.getItem("selectedRole");
      setUserRole(storedRole);
      setShowRoleSelector(false);
      setIsAdmin(false);
    } finally {
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const ensureArtistProfile = async () => {
      if (!isAuthenticated || userRole !== "artist") {
        return;
      }

      if (location.pathname === "/artist/profile") {
        return;
      }

      try {
        const profile = await getMyArtistProfile();
        const isComplete = Boolean(profile?.displayName?.trim() && profile?.bio?.trim());

        if (!isComplete) {
          navigate("/artist/profile", { replace: true });
        }
      } catch (error) {
        if (error?.response?.status === 404) {
          navigate("/artist/profile", { replace: true });
        }
      }
    };

    ensureArtistProfile();
  }, [isAuthenticated, userRole, location.pathname, navigate]);

  const handleLoginSuccess = async () => {
    await checkUser();
    setShowModal(false);
  };

  const handleSelectRole = (role) => {
    localStorage.setItem("selectedRole", role);
    setUserRole(role);
    setShowRoleSelector(false);
    setAuthChecked(true);
    setShowModal(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowDropdown(false);
    setShowRoleSelector(false);
    localStorage.removeItem("selectedRole");
    setUserRole(null);
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
    if (!isAuthenticated) {
      return [
        { label: "Home", path: "/" },
        { label: "Artworks", path: "/artworks" },
      ];
    }

    const baseItems =
      userRole === "artist"
        ? [
            { label: "Home", path: "/" },
            { label: "Artworks", path: "/artworks" },
            { label: "Artist Profile", path: "/artist/profile" },
            { label: "Sales", path: "/artist/sales" },
            { label: "Earnings", path: "/artist/payouts" },
            { label: "My Inventory", path: "/artist/inventory" },
            { label: "Add Artwork", path: "/artist/artworks/new" },
          ]
        : [
            { label: "Home", path: "/" },
            { label: "Artworks", path: "/artworks" },
            { label: "Cart", path: "/cart" },
            { label: "Orders", path: "/orders" },
            { label: "My information", path: "/profile" },
          ];

    return baseItems;
  };

  if (!authChecked) {
    return null;
  }

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
          <Route
            path="/signup"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
            }
          />
          <Route
            path="/cart"
            element={isAuthenticated ? <Cart /> : <Navigate to="/signup" replace />}
          />
          <Route
            path="/checkout"
            element={isAuthenticated ? <Checkout /> : <Navigate to="/signup" replace />}
          />
          <Route
            path="/orders"
            element={isAuthenticated ? <Orders /> : <Navigate to="/signup" replace />}
          />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/payment-success" element={<OrderSuccess />} />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/signup" replace />}
          />
          <Route path="/artworks/:id" element={<ArtworkDetails />} />
          <Route
            path="/artist/inventory"
            element={
              userRole === "artist" && isAuthenticated ? (
                <ArtistInventory />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/artist/artworks/new"
            element={
              userRole === "artist" && isAuthenticated ? (
                <CreateArtwork />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/artist/artworks/edit/:id"
            element={
              userRole === "artist" && isAuthenticated ? (
                <EditArtwork />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/artist/sales"
            element={
              userRole === "artist" && isAuthenticated ? (
                <ArtistSales />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/artist/payouts"
            element={
              userRole === "artist" && isAuthenticated ? (
                <ArtistPayouts />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/artist/profile"
            element={
              userRole === "artist" && isAuthenticated ? (
                <ArtistProfile />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/admin"
            element={
              !isAuthenticated ? (
                <AdminLogin onLoginSuccess={handleLoginSuccess} />
              ) : isAdmin ? (
                <AdminArtworks />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/admin/payouts"
            element={
              !isAuthenticated ? (
                <AdminLogin onLoginSuccess={handleLoginSuccess} />
              ) : isAdmin ? (
                <AdminPayouts />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
