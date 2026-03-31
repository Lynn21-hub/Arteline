import React from 'react';

function RoleSelector({ onSelectRole }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* CLOSE BUTTON */}
        <button onClick={() => window.location.reload()} style={styles.close}>×</button>

        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.mainTitle}>Welcome to Artéline</h1>
          <p style={styles.subtitle}>Choose how you'd like to explore our community</p>
        </div>

        <div style={styles.content}>
          {/* LEFT CARD - COLLECTOR */}
          <div 
            style={styles.card}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={styles.iconContainer}>
              <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            
            <h2 style={styles.cardTitle}>Collector</h2>
            <p style={styles.cardDescription}>
              Discover, collect, and connect with exceptional artworks from talented artists worldwide.
            </p>
            
            <button
              onClick={() => onSelectRole('collector')}
              style={styles.primaryButton}
              onMouseEnter={(e) => e.target.style.background = '#0041A4'}
              onMouseLeave={(e) => e.target.style.background = '#0052CC'}
            >
              Enter as Collector
            </button>
          </div>

          {/* DIVIDER */}
          <div style={styles.divider}></div>

          {/* RIGHT CARD - ARTIST */}
          <div 
            style={styles.card}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={styles.iconContainer}>
              <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7L2 12C2 16.4 6 20 12 20C18 20 22 16.4 22 12L22 7L12 2Z"></path>
                <path d="M12 9V15"></path>
                <path d="M9 12H15"></path>
              </svg>
            </div>
            
            <h2 style={styles.cardTitle}>Artist</h2>
            <p style={styles.cardDescription}>
              Showcase your talent, build your audience, and turn your passion into opportunity.
            </p>
            
            <button
              onClick={() => onSelectRole('artist')}
              style={{...styles.primaryButton, background: '#FF6B35'}}
              onMouseEnter={(e) => e.target.style.background = '#E55A2B'}
              onMouseLeave={(e) => e.target.style.background = '#FF6B35'}
            >
              Apply as Artist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
  },
  container: {
    position: 'relative',
    background: 'white',
    borderRadius: '20px',
    padding: '60px 40px',
    maxWidth: '1000px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  },
  close: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    background: '#f0f0f0',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#333',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  mainTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: '0 0 12px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  content: {
    display: 'flex',
    gap: '50px',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  card: {
    flex: 1,
    maxWidth: '380px',
    padding: '40px 30px',
    background: '#fafafa',
    borderRadius: '16px',
    border: '1px solid #e8e8e8',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  iconContainer: {
    width: '80px',
    height: '80px',
    margin: '0 auto 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
  },
  icon: {
    width: '48px',
    height: '48px',
    color: '#0052CC',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 12px',
  },
  cardDescription: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.6',
    margin: '0 0 32px',
  },
  primaryButton: {
    width: '100%',
    padding: '14px',
    background: '#0052CC',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  divider: {
    width: '1px',
    background: '#e0e0e0',
    margin: '20px 0',
  },
};

export default RoleSelector;
