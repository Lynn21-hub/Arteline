import './App.css';
import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';

import Profile from './pages/Profile';
import Home from './pages/Home';
import AuthModal from './components/AuthModal';
import ProfileDropdown from './components/ProfileDropdown';
import RoleSelector from './components/RoleSelector';

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
  const [page, setPage] = useState("home");
  const [userRole, setUserRole] = useState(() => {
    // Load role from localStorage if it exists
    return localStorage.getItem('userRole') || null;
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
    localStorage.setItem('userRole', role);
    setUserRole(role);
    setShowRoleSelector(false);
    setShowModal(true); // Automatically open auth modal after role selection
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowRoleSelector(true);
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setShowDropdown(!showDropdown);
    } else {
      // Show role selector if not authenticated
      setShowRoleSelector(true);
    }
  };

  return (
    <div>

      {/* ROLE SELECTOR - Show first if role not selected */}
      {showRoleSelector && <RoleSelector onSelectRole={handleSelectRole} />}

      {/* NAVBAR */}
      {!showRoleSelector && (
        <div style={{ padding: "20px", display: "flex", justifyContent: "flex-end", position: "relative" }}>
          
          <button onClick={handleProfileClick}>👤</button>

          {showDropdown && (
    <ProfileDropdown
      goToProfile={() => {
        setPage("profile");     
        setShowDropdown(false); // close dropdown
      }}
      onLogout={handleLogout}
    />
  )}

        </div>
      )}

      {/* MODAL */}
      {!showRoleSelector && showModal && (
        <AuthModal onClose={() => setShowModal(false)} onLoginSuccess={handleLoginSuccess} userRole={userRole} />
      )}

      {/* PAGE SWITCH */}
      {!showRoleSelector && (page === "profile" ? <Profile /> : <Home />)}

    </div>
  );
}

export default App;