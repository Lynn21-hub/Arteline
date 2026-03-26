import './App.css';
import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
 
import Profile from './pages/Profile';
import Home from './pages/Home';
import AuthModal from './components/AuthModal';
import ProfileDropdown from './components/ProfileDropdown';
import Artworks from './pages/Artworks';
import Cart from './pages/Cart';
 
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-west-1_75sr500CR",
      userPoolClientId: "70p1ungik7dq8vcjtdnaqbc002",
    }
  }
});
 
const navBtn = {
  background: "none",
  border: "none",
  fontSize: "15px",
  cursor: "pointer",
  fontWeight: "500",
  color: "#111",
  padding: "6px 4px",
};
 
const navBtnActive = {
  ...navBtn,
  color: "#ff6b35",
  borderBottom: "2px solid #ff6b35",
};
 
function App() {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState("home");
 
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
 
  const renderPage = () => {
    if (page === "profile")  return <Profile />;
    if (page === "artworks") return <Artworks />;
    if(page=="cart") return <Cart />;
    return <Home />;
  };
 
  return (
    <div>
 
      {/* NAVBAR */}
      <div style={{
        padding: "16px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        borderBottom: "1px solid #eee",
      }}>
 
        {/* LEFT - Nav links */}
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <button
            onClick={() => setPage("home")}
            style={page === "home" ? navBtnActive : navBtn}
          >
            Home
          </button>
          <button
            onClick={() => setPage("artworks")}
            style={page === "artworks" ? navBtnActive : navBtn}
          >
            Artworks
          </button>
        </div>
 
        {/* RIGHT - Profile */}
        <div style={{ position: "relative" }}>
          <button onClick={handleProfileClick} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer" }}>
            👤
          </button>
 
          {showDropdown && (
            <ProfileDropdown
              goToProfile={() => {
                setPage("profile");
                setShowDropdown(false);
              }}
              goToCart={() => {
                setPage("cart");
                setShowDropdown(false);
              }}
            />
          )}
        </div>
 
      </div>
 
      {/* MODAL */}
      {showModal && (
        <AuthModal onClose={() => setShowModal(false)} />
      )}
 
      {/* PAGE */}
      {renderPage()}
 
    </div>
  );
}
 
export default App;
 