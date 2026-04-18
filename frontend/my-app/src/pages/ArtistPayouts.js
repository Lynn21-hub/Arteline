import React, { useEffect, useState } from "react";
import { getMyPayouts } from "../api/payoutAPI";

function ArtistPayouts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({ pending: 0, paid: 0 });
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyPayouts();
        setSummary(data.summary || { pending: 0, paid: 0 });
        setPayouts(data.payouts || []);
      } catch (err) {
        console.error("Payouts error:", err);
        setError(err.response?.data?.message || "Failed to load payouts");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div style={styles.message}>Loading payouts...</div>;

  return (
    <div style={styles.container}>
      <p style={styles.kicker}>ARTIST DASHBOARD</p>
      <h1 style={styles.title}>Earnings</h1>

      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Pending</p>
          <h3 style={styles.summaryValue}>${Number(summary.pending || 0).toFixed(2)}</h3>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Paid Out</p>
          <h3 style={styles.summaryValue}>${Number(summary.paid || 0).toFixed(2)}</h3>
        </div>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {!error && payouts.length === 0 ? (
        <div style={styles.emptyBox}>No payout records yet.</div>
      ) : (
        payouts.map((payout) => (
          <div key={payout.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.orderLabel}>Order #{payout.orderItem?.order?.id || "-"}</p>
                <h3 style={styles.artworkTitle}>{payout.orderItem?.artwork?.title || "Artwork"}</h3>
              </div>
              <span style={payout.status === "PAID" ? styles.badgePaid : styles.badgePending}>
                {payout.status}
              </span>
            </div>

            <div style={styles.grid}>
              <div>
                <p style={styles.label}>Gross</p>
                <p style={styles.value}>${Number(payout.grossAmount || 0).toFixed(2)}</p>
              </div>
              <div>
                <p style={styles.label}>Platform Fee</p>
                <p style={styles.value}>${Number(payout.platformFee || 0).toFixed(2)}</p>
              </div>
              <div>
                <p style={styles.label}>Your Amount</p>
                <p style={styles.value}>${Number(payout.artistAmount || 0).toFixed(2)}</p>
              </div>
              <div>
                <p style={styles.label}>Payment Status</p>
                <p style={styles.value}>{payout.orderItem?.order?.paymentStatus || "-"}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f7f4ef", padding: "40px 8%", fontFamily: "Arial, sans-serif", color: "#111" },
  message: { textAlign: "center", padding: "60px", fontSize: "18px", background: "#f7f4ef", minHeight: "100vh" },
  kicker: { margin: "0 0 8px", color: "#b06b3f", fontSize: "12px", letterSpacing: "2px", fontWeight: "700" },
  title: { margin: "0 0 24px", fontSize: "48px", fontFamily: "Georgia, serif" },
  summaryRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "20px" },
  summaryCard: { background: "white", borderRadius: "16px", padding: "18px", boxShadow: "0 10px 24px rgba(0,0,0,0.06)" },
  summaryLabel: { margin: "0 0 6px", color: "#777", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" },
  summaryValue: { margin: 0, fontSize: "30px", fontFamily: "Georgia, serif" },
  errorBox: { background: "#fff0f0", color: "#9f2d20", border: "1px solid #f3d3cd", borderRadius: "12px", padding: "14px", marginBottom: "18px" },
  emptyBox: { background: "white", borderRadius: "20px", padding: "40px", boxShadow: "0 10px 24px rgba(0,0,0,0.06)" },
  card: { background: "white", borderRadius: "20px", padding: "24px", marginBottom: "16px", boxShadow: "0 10px 24px rgba(0,0,0,0.06)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "12px" },
  orderLabel: { margin: "0 0 6px", color: "#b06b3f", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" },
  artworkTitle: { margin: 0, fontSize: "28px", fontFamily: "Georgia, serif" },
  badgePaid: { background: "#e8f6ec", color: "#237846", borderRadius: "999px", padding: "6px 10px", fontSize: "12px", fontWeight: "700" },
  badgePending: { background: "#fff4e8", color: "#a6621c", borderRadius: "999px", padding: "6px 10px", fontSize: "12px", fontWeight: "700" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" },
  label: { margin: "0 0 4px", color: "#777", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" },
  value: { margin: 0, color: "#333" },
};

export default ArtistPayouts;
