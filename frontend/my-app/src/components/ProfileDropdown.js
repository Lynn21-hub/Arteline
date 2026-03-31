import React from 'react';
import { signOut } from 'aws-amplify/auth';

function ProfileDropdown({ goToProfile, onLogout }) {
  return (
    <div style={styles.dropdown}>
      
      <p style={styles.item} onClick={goToProfile}>
        My information
      </p>

      <p style={styles.item}>Payment settings</p>
      <p style={styles.item}>My orders</p>

      <p
  style={{ ...styles.item, color: "red" }}
  onClick={async () => {
    try {
      await signOut({ global: true });

      console.log("User fully signed out");

      // Clear role so role selector shows on next visit
      localStorage.removeItem('userRole');

      // Call parent callback if provided
      if (onLogout) {
        onLogout();
      }

      // redirect to home
      window.location.href = "/";

    } catch (error) {
      console.error("Logout error:", error);
    }
  }}
>
  Logout
</p>
</div>
  );
}


const styles = {
  dropdown: {
    position: "absolute",
    top: "50px",
    right: "20px",
    background: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    padding: "10px",
    width: "200px",
    zIndex: 1000,
  },

  item: {
    padding: "10px",
    cursor: "pointer",
  },
};

export default ProfileDropdown;
 