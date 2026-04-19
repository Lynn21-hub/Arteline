import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyArtistProfile, upsertMyArtistProfile } from "../api/artistAPI";

function ArtistProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    avatarUrl: "",
    location: "",
    website: "",
    instagram: "",
    isPublished: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("NOT_SUBMITTED");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await getMyArtistProfile();
        setForm({
          displayName: profile.displayName || "",
          bio: profile.bio || "",
          avatarUrl: profile.avatarUrl || "",
          location: profile.location || "",
          website: profile.website || "",
          instagram: profile.instagram || "",
          isPublished: typeof profile.isPublished === "boolean" ? profile.isPublished : true,
        });
        setApplicationStatus(profile.applicationStatus || "PENDING");
      } catch (err) {
        if (err?.response?.status !== 404) {
          setError("Could not load profile. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.displayName.trim()) {
      setError("Display name is required.");
      return;
    }

    if (!form.bio.trim()) {
      setError("Bio is required.");
      return;
    }

    try {
      setSaving(true);
      await upsertMyArtistProfile({
        displayName: form.displayName,
        bio: form.bio,
        avatarUrl: form.avatarUrl,
        location: form.location,
        website: form.website,
        instagram: form.instagram,
        isPublished: form.isPublished,
      });
      setApplicationStatus("PENDING");
      window.dispatchEvent(new Event("artist-profile-updated"));
      setMessage("Application submitted. It is now pending admin review.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="artist-profile-page">
        <div className="artist-profile-shell">
          <div className="artist-profile-header">
            <div>
              <p className="artist-profile-kicker">ARTIST PROFILE</p>
              <h1>Build your public artist page</h1>
              <p className="artist-profile-sub">
                Submit your profile to apply as an artist. Admin approval is required before selling.
              </p>
              <p className={`artist-profile-status artist-profile-status--${String(applicationStatus).toLowerCase()}`}>
                Application status: {String(applicationStatus).replaceAll("_", " ")}
              </p>
            </div>
            <button className="artist-profile-secondary" onClick={() => navigate("/artist/inventory")}>My Inventory</button>
          </div>

          <form className="artist-profile-form" onSubmit={handleSave}>
            {loading ? (
              <div className="artist-profile-state">Loading profile...</div>
            ) : (
              <>
                <label>
                  Display Name *
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={(e) => handleChange("displayName", e.target.value)}
                    placeholder="How collectors should see your name"
                    required
                  />
                </label>

                <label>
                  Bio *
                  <textarea
                    value={form.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Tell collectors about your style, influences, and journey"
                    rows={5}
                    required
                  />
                </label>

                <div className="artist-profile-grid">
                  <label>
                    Profile Image URL
                    <input
                      type="url"
                      value={form.avatarUrl}
                      onChange={(e) => handleChange("avatarUrl", e.target.value)}
                      placeholder="https://..."
                    />
                  </label>

                  <label>
                    Location
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="City, Country"
                    />
                  </label>
                </div>

                <div className="artist-profile-grid">
                  <label>
                    Website
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="https://your-portfolio.com"
                    />
                  </label>

                  <label>
                    Instagram
                    <input
                      type="text"
                      value={form.instagram}
                      onChange={(e) => handleChange("instagram", e.target.value)}
                      placeholder="@yourhandle"
                    />
                  </label>
                </div>

                <label className="artist-profile-checkbox">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => handleChange("isPublished", e.target.checked)}
                  />
                  Publish my profile publicly
                </label>

                {error && <p className="artist-profile-error">{error}</p>}
                {message && <p className="artist-profile-message">{message}</p>}

                <div className="artist-profile-actions">
                  <button type="submit" className="artist-profile-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                  <button type="button" className="artist-profile-secondary" onClick={() => navigate("/artist/artworks/new")}>Add Artwork</button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

const css = `
  .artist-profile-page {
    min-height: calc(100vh - 76px);
    background: #f7f3ed;
    padding: 40px 18px 70px;
  }

  .artist-profile-shell {
    width: min(920px, 100%);
    margin: 0 auto;
    display: grid;
    gap: 24px;
  }

  .artist-profile-header {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: flex-start;
  }

  .artist-profile-kicker {
    margin: 0 0 8px;
    font-size: 12px;
    letter-spacing: 2px;
    color: #c9a84c;
    font-weight: 600;
  }

  .artist-profile-header h1 {
    margin: 0;
    font-family: "Playfair Display", serif;
    font-size: clamp(30px, 4vw, 44px);
    color: #0d0c0a;
    line-height: 1.08;
  }

  .artist-profile-sub {
    margin: 10px 0 0;
    color: rgba(13, 12, 10, 0.66);
    max-width: 540px;
  }

  .artist-profile-status {
    margin: 10px 0 0;
    display: inline-block;
    padding: 7px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .artist-profile-status--approved {
    background: #e8f6ec;
    color: #237846;
  }

  .artist-profile-status--pending,
  .artist-profile-status--not_submitted {
    background: #fff4e8;
    color: #a6621c;
  }

  .artist-profile-status--rejected {
    background: #fbebeb;
    color: #8a2f2f;
  }

  .artist-profile-form {
    background: #fff;
    border: 1px solid rgba(13, 12, 10, 0.09);
    border-radius: 12px;
    box-shadow: 0 12px 36px rgba(13, 12, 10, 0.08);
    padding: 26px;
    display: grid;
    gap: 18px;
  }

  .artist-profile-form label {
    display: grid;
    gap: 7px;
    font-size: 13px;
    color: #0d0c0a;
    font-weight: 500;
  }

  .artist-profile-form input,
  .artist-profile-form textarea {
    border: 1px solid rgba(13, 12, 10, 0.2);
    border-radius: 8px;
    padding: 12px 13px;
    font-family: "Outfit", Arial, sans-serif;
    font-size: 14px;
    outline: none;
  }

  .artist-profile-form textarea {
    resize: vertical;
  }

  .artist-profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 14px;
  }

  .artist-profile-checkbox {
    display: flex !important;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }

  .artist-profile-checkbox input {
    width: 18px;
    height: 18px;
    margin: 0;
  }

  .artist-profile-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .artist-profile-primary,
  .artist-profile-secondary {
    border: none;
    border-radius: 8px;
    padding: 11px 16px;
    font-size: 14px;
    cursor: pointer;
  }

  .artist-profile-primary {
    background: #0d0c0a;
    color: #fff;
  }

  .artist-profile-secondary {
    background: #ece4d7;
    color: #0d0c0a;
  }

  .artist-profile-error {
    color: #b12626;
    margin: 0;
  }

  .artist-profile-message {
    color: #207541;
    margin: 0;
  }

  .artist-profile-state {
    color: rgba(13, 12, 10, 0.7);
    padding: 8px 0;
  }
`;

export default ArtistProfile;
