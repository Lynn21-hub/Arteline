import React from 'react';

function RoleSelector({ onSelectRole }) {
  const artelineColors = {
    parchment: "#f7f3ed",
    ink: "#0d0c0a",
    gold: "#c9a84c",
    border: "rgba(13,12,10,0.09)",
  };

  return (
    <div style={styles.overlay(artelineColors)}>
      <div style={styles.container(artelineColors)}>
        {/* CLOSE BUTTON */}
        <button 
          onClick={() => window.location.reload()} 
          style={styles.close(artelineColors)}
          aria-label="Close"
        >
          ✕
        </button>

        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.mainTitle(artelineColors)}>
            Arté<span style={{ color: artelineColors.gold, fontStyle: "italic" }}>line</span>
          </h1>
          <p style={styles.subtitle(artelineColors)}>
            Choose your role
          </p>
          <p style={styles.description(artelineColors)}>
            Explore our art community as a collector or artist
          </p>
        </div>

        <div style={styles.content}>
          {/* COLLECTOR CARD */}
          <div 
            style={styles.card(artelineColors)}
            onClick={() => onSelectRole('collector')}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = artelineColors.gold;
              e.currentTarget.style.boxShadow = `0 8px 24px ${artelineColors.gold}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = artelineColors.border;
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(13,12,10,0.06)';
            }}
          >
            <h2 style={styles.cardTitle(artelineColors)}>Collector</h2>
            <p style={styles.cardDescription(artelineColors)}>
              Discover and connect with exceptional artworks from talented creators around the world.
            </p>
            
            <button
              onClick={() => onSelectRole('collector')}
              style={styles.button(artelineColors, 'primary')}
              onMouseEnter={(e) => {
                e.target.style.background = artelineColors.gold;
                e.target.style.color = artelineColors.parchment;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = artelineColors.gold;
              }}
            >
              Continue as Collector
            </button>
          </div>

          {/* ARTIST CARD */}
          <div 
            style={styles.card(artelineColors)}
            onClick={() => onSelectRole('artist')}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = artelineColors.gold;
              e.currentTarget.style.boxShadow = `0 8px 24px ${artelineColors.gold}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = artelineColors.border;
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(13,12,10,0.06)';
            }}
          >
            <h2 style={styles.cardTitle(artelineColors)}>Artist</h2>
            <p style={styles.cardDescription(artelineColors)}>
              Showcase your talent, build your audience, and bring your artistic vision to life.
            </p>
            
            <button
              onClick={() => onSelectRole('artist')}
              style={styles.button(artelineColors, 'primary')}
              onMouseEnter={(e) => {
                e.target.style.background = artelineColors.gold;
                e.target.style.color = artelineColors.parchment;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = artelineColors.gold;
              }}
            >
              Continue as Artist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: (colors) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: colors.parchment,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    fontFamily: "'Outfit', 'Poppins', Arial, sans-serif",
  }),
  container: (colors) => ({
    position: 'relative',
    background: colors.parchment,
    borderRadius: '12px',
    padding: '60px 50px',
    maxWidth: '960px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 12px 40px rgba(13,12,10,0.08)',
    border: `1px solid ${colors.border}`,
  }),
  close: (colors) => ({
    position: 'absolute',
    top: '24px',
    right: '24px',
    background: 'transparent',
    border: `1px solid ${colors.border}`,
    fontSize: '20px',
    cursor: 'pointer',
    color: colors.ink,
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    padding: 0,
    opacity: 0.6,
  }),
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  mainTitle: (colors) => ({
    fontSize: '42px',
    fontWeight: '700',
    color: colors.ink,
    margin: '0 0 8px',
    letterSpacing: '-0.5px',
    fontFamily: "'Playfair Display', serif",
  }),
  subtitle: (colors) => ({
    fontSize: '18px',
    fontWeight: '500',
    color: colors.ink,
    margin: '0 0 12px',
    fontFamily: "'Playfair Display', serif",
    fontStyle: 'italic',
  }),
  description: (colors) => ({
    fontSize: '14px',
    color: colors.ink,
    opacity: 0.65,
    margin: 0,
    letterSpacing: '0.5px',
  }),
  content: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '32px',
    justifyContent: 'center',
  },
  card: (colors) => ({
    padding: '42px 32px',
    background: 'transparent',
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(13,12,10,0.06)',
  }),
  cardTitle: (colors) => ({
    fontSize: '24px',
    fontWeight: '600',
    color: colors.ink,
    margin: '0 0 12px',
    fontFamily: "'Playfair Display', serif",
  }),
  cardDescription: (colors) => ({
    fontSize: '14px',
    color: colors.ink,
    opacity: 0.68,
    lineHeight: '1.6',
    margin: '0 0 28px',
  }),
  button: (colors, variant) => ({
    width: '100%',
    padding: '12px 16px',
    background: 'transparent',
    color: colors.gold,
    border: `1.5px solid ${colors.gold}`,
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  }),
};

export default RoleSelector;
