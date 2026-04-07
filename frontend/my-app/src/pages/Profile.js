import React from 'react';

function Profile() {
  return (
    <div style={styles.container}>
      <p style={styles.kicker}>COLLECTOR DASHBOARD</p>
      <h1 style={styles.title}>My Information</h1>

      <div style={styles.card}>
        <p style={styles.label}>Profile</p>
        <p style={styles.text}>Your account details will appear here.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f7f4ef',
    padding: '40px 8%',
    fontFamily: 'Arial, sans-serif',
    color: '#111',
  },
  kicker: {
    margin: '0 0 8px',
    color: '#b06b3f',
    fontSize: '12px',
    letterSpacing: '2px',
    fontWeight: '700',
  },
  title: {
    margin: '0 0 30px',
    fontSize: '48px',
    fontFamily: 'Georgia, serif',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
    maxWidth: '640px',
  },
  label: {
    margin: '0 0 8px',
    color: '#b06b3f',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  text: {
    margin: 0,
    color: '#555',
    fontSize: '16px',
  },
};

export default Profile;