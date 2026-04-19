import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  approveArtistApplication,
  getAdminArtistApplications,
  rejectArtistApplication,
} from "../api/artistAPI";

function AdminArtistApplications() {
  const [status, setStatus] = useState("PENDING");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminArtistApplications(status);
      setApplications(data.applications || []);
    } catch (err) {
      console.error("Error loading artist applications:", err);
      setError(err?.response?.data?.message || "Failed to load artist applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const handleApprove = async (application) => {
    try {
      setBusyId(application.id);
      const result = await approveArtistApplication(application.id);
      setNotice(
        result?.emailSent
          ? `Approved ${application.displayName}. Email sent.`
          : `Approved ${application.displayName}. Email not sent (${result?.emailReason || "unknown"}).`
      );
      await load();
    } catch (err) {
      console.error("Approve application error:", err);
      setError(err?.response?.data?.message || "Failed to approve application");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (application) => {
    const reason = window.prompt("Optional rejection reason:") || "";

    try {
      setBusyId(application.id);
      await rejectArtistApplication(application.id, reason);
      setNotice(`Rejected ${application.displayName}.`);
      await load();
    } catch (err) {
      console.error("Reject application error:", err);
      setError(err?.response?.data?.message || "Failed to reject application");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="admin-app-page">
        <div className="admin-app-header">
          <div>
            <p className="kicker">ADMIN CONSOLE</p>
            <h1>Artist Applications</h1>
            <p className="subtitle">Review artist applications and approve creators to start selling.</p>
          </div>
          <div className="header-actions">
            <Link to="/admin" className="btn">Artwork Queue</Link>
            <Link to="/admin/payouts" className="btn">Payout Queue</Link>
          </div>
        </div>

        <div className="filter-row">
          {[
            ["PENDING", "Pending"],
            ["APPROVED", "Approved"],
            ["REJECTED", "Rejected"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={`pill ${status === value ? "active" : ""}`}
              onClick={() => setStatus(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {notice ? <div className="notice">{notice}</div> : null}
        {error ? <div className="error">{error}</div> : null}

        {loading ? (
          <div className="empty">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="empty">No applications in this status.</div>
        ) : (
          <div className="grid">
            {applications.map((app) => (
              <article key={app.id} className="card">
                <div className="top">
                  <div>
                    <p className="meta">Application #{app.id}</p>
                    <h2>{app.displayName}</h2>
                    <p className="small">{app.applicantEmail || "No email"}</p>
                  </div>
                  <span className={`status ${app.applicationStatus.toLowerCase()}`}>{app.applicationStatus}</span>
                </div>

                <p className="bio">{app.bio}</p>

                <dl className="details">
                  <div><dt>Location</dt><dd>{app.location || "-"}</dd></div>
                  <div><dt>Website</dt><dd>{app.website || "-"}</dd></div>
                  <div><dt>Instagram</dt><dd>{app.instagram || "-"}</dd></div>
                  <div><dt>Artworks</dt><dd>{app.artworksCount || 0}</dd></div>
                </dl>

                {app.applicationStatus === "PENDING" && (
                  <div className="actions">
                    <button className="btn approve" onClick={() => handleApprove(app)} disabled={busyId === app.id}>
                      {busyId === app.id ? "Working..." : "Approve"}
                    </button>
                    <button className="btn reject" onClick={() => handleReject(app)} disabled={busyId === app.id}>
                      Reject
                    </button>
                  </div>
                )}

                {app.applicationStatus === "REJECTED" && app.rejectionReason ? (
                  <p className="reject-reason">Reason: {app.rejectionReason}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const css = `
  .admin-app-page { max-width: 1240px; margin: 0 auto; padding: 40px 24px 80px; background: #f7f3ed; min-height: calc(100vh - 76px); }
  .admin-app-header { display: flex; justify-content: space-between; gap: 12px; align-items: flex-end; flex-wrap: wrap; margin-bottom: 18px; }
  .kicker { margin: 0 0 8px; font-size: 12px; letter-spacing: 2px; color: #7d4f35; font-weight: 700; }
  .admin-app-header h1 { margin: 0; font-size: 52px; font-family: Georgia, serif; }
  .subtitle { margin: 10px 0 0; color: #5d564e; max-width: 640px; }
  .header-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .filter-row { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
  .pill { border: 1px solid rgba(13,12,10,0.14); background: #fff; padding: 8px 12px; border-radius: 999px; cursor: pointer; }
  .pill.active { background: #111; color: #fff; border-color: #111; }
  .notice, .error, .empty { border-radius: 14px; padding: 14px; margin-bottom: 14px; }
  .notice { background: #eaf5ec; color: #21613b; }
  .error { background: #fbebeb; color: #8a2f2f; }
  .empty { background: #fff; color: #5d564e; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
  .card { background: #fff; border: 1px solid rgba(13,12,10,0.08); border-radius: 16px; padding: 16px; }
  .top { display: flex; justify-content: space-between; gap: 8px; align-items: flex-start; }
  .meta { margin: 0 0 6px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #7d4f35; font-weight: 700; }
  .card h2 { margin: 0; font-size: 28px; font-family: Georgia, serif; }
  .small { margin: 8px 0 0; color: #5d564e; font-size: 13px; }
  .status { border-radius: 999px; padding: 6px 10px; font-size: 12px; font-weight: 700; }
  .status.pending { background: #fff4e8; color: #a6621c; }
  .status.approved { background: #e8f6ec; color: #237846; }
  .status.rejected { background: #fbebeb; color: #8a2f2f; }
  .bio { color: #2c2925; line-height: 1.6; margin: 14px 0; }
  .details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin: 0 0 14px; }
  .details dt { font-size: 11px; text-transform: uppercase; color: #7a756e; font-weight: 700; margin-bottom: 3px; }
  .details dd { margin: 0; color: #111; overflow-wrap: anywhere; }
  .actions { display: flex; gap: 8px; }
  .btn { border: none; background: #fff; color: #111; text-decoration: none; border-radius: 10px; padding: 10px 12px; cursor: pointer; font-weight: 600; border: 1px solid rgba(13,12,10,0.1); }
  .btn.approve { background: #21613b; color: #fff; border-color: #21613b; }
  .btn.reject { background: #8a2f2f; color: #fff; border-color: #8a2f2f; }
  .reject-reason { margin: 8px 0 0; color: #8a2f2f; font-size: 13px; }
`;

export default AdminArtistApplications;
