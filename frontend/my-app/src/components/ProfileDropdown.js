import React from 'react';
import { signOut } from 'aws-amplify/auth';

function ProfileDropdown({ goToProfile }) {
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
          await signOut();
          window.location.reload(); // refresh → user becomes logged out
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