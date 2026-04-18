import React, { useEffect, useState } from "react";
import { getAdminPayouts, markPayoutPaid } from "../api/payoutAPI";

function AdminPayouts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [payouts, setPayouts] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  const load = async (status = statusFilter) => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminPayouts(status);
      setPayouts(data.payouts || []);
    } catch (err) {
      console.error("Admin payouts error:", err);
      setError(err.response?.data?.message || "Failed to load payouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(statusFilter);
  }, [statusFilter]);

  const handleMarkPaid = async (payoutId) => {
    const paymentReference = window.prompt("Optional payment reference (bank transfer id):", "") || "";

    try {
      setProcessingId(payoutId);
      await markPayoutPaid(payoutId, paymentReference);
      await load(statusFilter);
    } catch (err) {
      console.error("Mark paid error:", err);
      setError(err.response?.data?.message || "Failed to mark payout paid");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div style={styles.message}>Loading admin payouts...</div>;

  return (
    <div style={styles.container}>
      <p style={styles.kicker}>ADMIN CONSOLE</p>
      <h1 style={styles.title}>Payout Queue</h1>

      <div style={styles.filterRow}>
        {[
          ["PENDING", "Pending"],
          ["PAID", "Paid"],
          ["", "All"],
        ].map(([value, label]) => (
          <button
            key={label}
            style={statusFilter === value ? styles.activeFilterBtn : styles.filterBtn}
            onClick={() => setStatusFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {payouts.length === 0 ? (
        <div style={styles.emptyBox}>No payouts found.</div>
      ) : (
        payouts.map((payout) => (
          <div key={payout.id} style={styles.card}>
            <div style={styles.headerRow}>
              <div>
                <p style={styles.orderLabel}>Order #{payout.orderItem?.order?.id || "-"}</p>
                <h3 style={styles.artworkTitle}>{payout.orderItem?.artwork?.title || "Artwork"}</h3>
              </div>
              <span style={payout.status === "PAID" ? styles.badgePaid : styles.badgePending}>{payout.status}</span>
            </div>

            <div style={styles.grid}>
              <div>
                <p style={styles.label}>Artist Sub</p>
                <p style={styles.value}>{payout.artistSub}</p>
              </div>
              <div>
                <p style={styles.label}>Gross</p>
                <p style={styles.value}>${Number(payout.grossAmount || 0).toFixed(2)}</p>
              </div>
              <div>
                <p style={styles.label}>Platform Fee</p>
                <p style={styles.value}>${Number(payout.platformFee || 0).toFixed(2)}</p>
              </div>
              <div>
                <p style={styles.label}>Artist Amount</p>
                <p style={styles.value}>${Number(payout.artistAmount || 0).toFixed(2)}</p>
              </div>
            </div>

            {payout.status !== "PAID" && (
              <button
                style={styles.markPaidBtn}
                onClick={() => handleMarkPaid(payout.id)}
                disabled={processingId === payout.id}
              >
                {processingId === payout.id ? "Marking..." : "Mark as Paid"}
              </button>
            )}
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
  filterRow: { display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" },
  filterBtn: { border: "none", background: "#ece6dc", borderRadius: "999px", padding: "8px 14px", cursor: "pointer" },
  activeFilterBtn: { border: "none", background: "#111", color: "white", borderRadius: "999px", padding: "8px 14px", cursor: "pointer" },
  errorBox: { background: "#fff0f0", color: "#9f2d20", border: "1px solid #f3d3cd", borderRadius: "12px", padding: "14px", marginBottom: "18px" },
  emptyBox: { background: "white", borderRadius: "20px", padding: "40px", boxShadow: "0 10px 24px rgba(0,0,0,0.06)" },
  card: { background: "white", borderRadius: "20px", padding: "24px", marginBottom: "16px", boxShadow: "0 10px 24px rgba(0,0,0,0.06)" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "12px" },
  orderLabel: { margin: "0 0 6px", color: "#b06b3f", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" },
  artworkTitle: { margin: 0, fontSize: "28px", fontFamily: "Georgia, serif" },
  badgePaid: { background: "#e8f6ec", color: "#237846", borderRadius: "999px", padding: "6px 10px", fontSize: "12px", fontWeight: "700" },
  badgePending: { background: "#fff4e8", color: "#a6621c", borderRadius: "999px", padding: "6px 10px", fontSize: "12px", fontWeight: "700" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "12px" },
  label: { margin: "0 0 4px", color: "#777", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" },
  value: { margin: 0, color: "#333" },
  markPaidBtn: { border: "none", background: "#111", color: "white", borderRadius: "10px", padding: "10px 14px", cursor: "pointer" },
};

export default AdminPayouts;
