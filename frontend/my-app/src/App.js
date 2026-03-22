import './App.css';
import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';

import Profile from './pages/Profile';
import Home from './pages/Home';
import AuthModal from './components/AuthModal';
import ProfileDropdown from './components/ProfileDropdown';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-west-1_75sr500CR",
      userPoolClientId: "70p1ungik7dq8vcjtdnaqbc002",
    }
  }
});

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState("home"); // 🔥 NEW

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

  return (
    <div>

      {/* NAVBAR */}
      <div style={{ padding: "20px", display: "flex", justifyContent: "flex-end", position: "relative" }}>
        
        <button onClick={handleProfileClick}>👤</button>

        {showDropdown && (
  <ProfileDropdown
    goToProfile={() => {
      setPage("profile");     
      setShowDropdown(false); // close dropdown
    }}
  />
)}

      </div>

      {/* MODAL */}
      {showModal && (
        <AuthModal onClose={() => setShowModal(false)} />
      )}

      {/* PAGE SWITCH */}
      {page === "profile" ? <Profile /> : <Home />}

    </div>
  );
}

export default App;