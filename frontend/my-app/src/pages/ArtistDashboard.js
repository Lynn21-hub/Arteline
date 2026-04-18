import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyArtworks, deleteArtwork } from "../api/artworkAPI";
import { getMySales } from "../api/artistOrderAPI";
import { getMyPayouts } from "../api/payoutAPI";

const TABS = {
  inventory: "Inventory",
  sales: "Sales",
  earnings: "Earnings",
};

function ArtistDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inventory");

  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [salesLoading, setSalesLoading] = useState(true);
  const [earningsLoading, setEarningsLoading] = useState(true);

  const [inventoryError, setInventoryError] = useState("");
  const [salesError, setSalesError] = useState("");
  const [earningsError, setEarningsError] = useState("");

  const [artworks, setArtworks] = useState([]);
  const [sales, setSales] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [summary, setSummary] = useState({ pending: 0, paid: 0 });

  useEffect(() => {
    const loadDashboard = async () => {
      setInventoryLoading(true);
      setSalesLoading(true);
      setEarningsLoading(true);

      const [inventoryRes, salesRes, payoutsRes] = await Promise.allSettled([
        getMyArtworks(),
        getMySales(),
        getMyPayouts(),
      ]);

      if (inventoryRes.status === "fulfilled") {
        setArtworks(Array.isArray(inventoryRes.value) ? inventoryRes.value : []);
      } else {
        setInventoryError(inventoryRes.reason?.message || "Failed to load inventory");
      }
      setInventoryLoading(false);

      if (salesRes.status === "fulfilled") {
        setSales(salesRes.value?.sales || []);
      } else {
        setSalesError(salesRes.reason?.response?.data?.message || "Failed to load sales");
      }
      setSalesLoading(false);

      if (payoutsRes.status === "fulfilled") {
        setPayouts(payoutsRes.value?.payouts || []);
        setSummary(payoutsRes.value?.summary || { pending: 0, paid: 0 });
      } else {
        setEarningsError(
          payoutsRes.reason?.response?.data?.message || "Failed to load earnings"
        );
      }
      setEarningsLoading(false);
    };

    loadDashboard();
  }, []);

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Delete this artwork?");
    if (!shouldDelete) {
      return;
    }

    try {
      await deleteArtwork(id);
      setArtworks((prev) => prev.filter((art) => art.id !== id));
    } catch (error) {
      console.error("Delete artwork error:", error);
    }
  };

  const totalSalesValue = useMemo(
    () => sales.reduce((sum, item) => sum + Number(item.lineTotal || 0), 0),
    [sales]
  );

  return (
    <>
      <style>{css}</style>
      <div className="artist-dashboard-page">
        <div className="artist-dashboard-header">
          <div>
            <p className="artist-dashboard-kicker">ARTIST HUB</p>
            <h1>Manage your artist business</h1>
            <p className="artist-dashboard-sub">Inventory, sales, and earnings in one place.</p>
          </div>
          <div className="artist-dashboard-header-actions">
            <button className="artist-dashboard-btn ghost" onClick={() => navigate("/artist/profile")}>Edit Profile</button>
            <button className="artist-dashboard-btn" onClick={() => navigate("/artist/artworks/new")}>+ Add Artwork</button>
          </div>
        </div>

        <div className="artist-dashboard-metrics">
          <div className="metric-card">
            <p>Total Inventory</p>
            <h3>{artworks.length}</h3>
          </div>
          <div className="metric-card">
            <p>Total Sales Value</p>
            <h3>${totalSalesValue.toFixed(2)}</h3>
          </div>
          <div className="metric-card">
            <p>Pending Payouts</p>
            <h3>${Number(summary.pending || 0).toFixed(2)}</h3>
          </div>
          <div className="metric-card">
            <p>Paid Out</p>
            <h3>${Number(summary.paid || 0).toFixed(2)}</h3>
          </div>
        </div>

        <div className="artist-dashboard-tabs">
          {Object.entries(TABS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`tab-btn ${activeTab === key ? "active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="artist-dashboard-content">
          {activeTab === "inventory" && (
            <section>
              {inventoryLoading ? (
                <div className="state-box">Loading inventory...</div>
              ) : inventoryError ? (
                <div className="state-box error">{inventoryError}</div>
              ) : artworks.length === 0 ? (
                <div className="state-box">No artworks in inventory yet.</div>
              ) : (
                <div className="inventory-grid">
                  {artworks.map((artwork) => (
                    <div className="inventory-card" key={artwork.id}>
                      <img src={artwork.image_url} alt={artwork.title} className="inventory-image" />
                      <div className="inventory-body">
                        <p className="inventory-category">{artwork.category || "Artwork"}</p>
                        <h3>{artwork.title}</h3>
                        <p>Inventory: {artwork.inventory}</p>
                        <p className="price">${Number(artwork.price).toLocaleString()}</p>
                        <div className="inventory-actions">
                          <Link to={`/artist/artworks/edit/${artwork.id}`} className="artist-dashboard-btn ghost small">Edit</Link>
                          <button className="artist-dashboard-btn danger small" onClick={() => handleDelete(artwork.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "sales" && (
            <section>
              {salesLoading ? (
                <div className="state-box">Loading sales...</div>
              ) : salesError ? (
                <div className="state-box error">{salesError}</div>
              ) : sales.length === 0 ? (
                <div className="state-box">No sales yet.</div>
              ) : (
                <div className="list-stack">
                  {sales.map((sale) => (
                    <div className="list-card" key={sale.id}>
                      <div className="list-card-head">
                        <div>
                          <p className="meta">Order #{sale.order?.id || "-"}</p>
                          <h3>{sale.artwork?.title || "Artwork"}</h3>
                        </div>
                        <span className="pill">{sale.order?.paymentStatus || "PENDING"}</span>
                      </div>
                      <div className="sales-grid">
                        <div><p className="meta">Collector</p><p>{sale.order?.customerName || "-"}</p></div>
                        <div><p className="meta">Quantity</p><p>{sale.quantity}</p></div>
                        <div><p className="meta">Line Total</p><p>${Number(sale.lineTotal || 0).toFixed(2)}</p></div>
                        <div><p className="meta">Payment Method</p><p>{sale.order?.paymentMethod || "-"}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "earnings" && (
            <section>
              {earningsLoading ? (
                <div className="state-box">Loading earnings...</div>
              ) : earningsError ? (
                <div className="state-box error">{earningsError}</div>
              ) : payouts.length === 0 ? (
                <div className="state-box">No payout records yet.</div>
              ) : (
                <div className="list-stack">
                  {payouts.map((payout) => (
                    <div className="list-card" key={payout.id}>
                      <div className="list-card-head">
                        <div>
                          <p className="meta">Order #{payout.orderItem?.order?.id || "-"}</p>
                          <h3>{payout.orderItem?.artwork?.title || "Artwork"}</h3>
                        </div>
                        <span className={`pill ${payout.status === "PAID" ? "success" : "pending"}`}>{payout.status}</span>
                      </div>
                      <div className="sales-grid">
                        <div><p className="meta">Gross</p><p>${Number(payout.grossAmount || 0).toFixed(2)}</p></div>
                        <div><p className="meta">Platform Fee</p><p>${Number(payout.platformFee || 0).toFixed(2)}</p></div>
                        <div><p className="meta">Your Amount</p><p>${Number(payout.artistAmount || 0).toFixed(2)}</p></div>
                        <div><p className="meta">Payment Status</p><p>{payout.orderItem?.order?.paymentStatus || "-"}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}

const css = `
  .artist-dashboard-page {
    min-height: calc(100vh - 76px);
    background: #f7f3ed;
    padding: 36px 18px 70px;
  }

  .artist-dashboard-page * { box-sizing: border-box; }

  .artist-dashboard-header {
    width: min(1200px, 100%);
    margin: 0 auto 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 14px;
    flex-wrap: wrap;
  }

  .artist-dashboard-kicker {
    margin: 0 0 8px;
    font-size: 12px;
    letter-spacing: 2px;
    color: #c9a84c;
    font-weight: 700;
  }

  .artist-dashboard-header h1 {
    margin: 0;
    color: #0d0c0a;
    font-family: "Playfair Display", serif;
    font-size: clamp(30px, 4vw, 48px);
  }

  .artist-dashboard-sub {
    margin: 10px 0 0;
    color: rgba(13,12,10,0.64);
  }

  .artist-dashboard-header-actions { display: flex; gap: 10px; flex-wrap: wrap; }

  .artist-dashboard-btn {
    border: none;
    border-radius: 10px;
    background: #0d0c0a;
    color: #fff;
    padding: 10px 14px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
  }

  .artist-dashboard-btn.ghost {
    background: #fff;
    color: #0d0c0a;
    border: 1px solid rgba(13,12,10,0.1);
  }

  .artist-dashboard-btn.danger {
    background: #fbeceb;
    color: #9f2d20;
  }

  .artist-dashboard-btn.small {
    padding: 8px 10px;
    font-size: 13px;
  }

  .artist-dashboard-metrics {
    width: min(1200px, 100%);
    margin: 0 auto 18px;
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .metric-card {
    background: #fff;
    border-radius: 12px;
    padding: 14px;
    border: 1px solid rgba(13,12,10,0.08);
  }

  .metric-card p {
    margin: 0 0 6px;
    color: rgba(13,12,10,0.64);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .metric-card h3 { margin: 0; font-size: 28px; font-family: "Playfair Display", serif; }

  .artist-dashboard-tabs {
    width: min(1200px, 100%);
    margin: 0 auto;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .tab-btn {
    border: 1px solid rgba(13,12,10,0.12);
    background: #fff;
    color: #0d0c0a;
    border-radius: 999px;
    padding: 10px 14px;
    cursor: pointer;
    font-weight: 600;
  }

  .tab-btn.active {
    background: #0d0c0a;
    color: #fff;
    border-color: #0d0c0a;
  }

  .artist-dashboard-content {
    width: min(1200px, 100%);
    margin: 14px auto 0;
  }

  .state-box {
    background: #fff;
    border: 1px solid rgba(13,12,10,0.08);
    border-radius: 12px;
    padding: 20px;
  }

  .state-box.error {
    border-color: #f3d3cd;
    color: #9f2d20;
    background: #fff0f0;
  }

  .inventory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 14px;
  }

  .inventory-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(13,12,10,0.08);
  }

  .inventory-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
  }

  .inventory-body { padding: 12px; }

  .inventory-category {
    margin: 0 0 6px;
    color: #c9a84c;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 1px;
  }

  .inventory-body h3 {
    margin: 0 0 8px;
    font-family: "Playfair Display", serif;
    font-size: 24px;
  }

  .inventory-body p { margin: 0 0 8px; }
  .inventory-body .price { font-weight: 700; }

  .inventory-actions { display: flex; gap: 8px; }

  .list-stack { display: grid; gap: 12px; }

  .list-card {
    background: #fff;
    border: 1px solid rgba(13,12,10,0.08);
    border-radius: 12px;
    padding: 14px;
  }

  .list-card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 10px;
  }

  .list-card-head h3 {
    margin: 0;
    font-family: "Playfair Display", serif;
    font-size: 26px;
  }

  .meta {
    margin: 0 0 5px;
    color: rgba(13,12,10,0.64);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 1px;
    font-weight: 700;
  }

  .pill {
    background: #f2ede6;
    color: #5f4f3f;
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }

  .pill.success { background: #e8f6ec; color: #237846; }
  .pill.pending { background: #fff4e8; color: #a6621c; }

  .sales-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .sales-grid p { margin: 0; }
`;

export default ArtistDashboard;
