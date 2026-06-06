import { useState, useEffect, useCallback } from "react";
import api from "../../../api/axios";
import "./Kitchen.css";
import KitchenEditModal from "./KitchenEditModal";
import DistribusiHarian from "../distribusi/DistribusiHarian";

function UlasanTab() {
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get("/sppg/profile/reviews", {
        params: { page: pg },
      });
      setReviews(data.data);
      setMeta(data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  if (loading)
    return <p style={{ padding: "1rem", opacity: 0.6 }}>Memuat ulasan...</p>;

  if (reviews.length === 0) {
    return (
      <div
        className="kp-empty"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ margin: "0 auto 12px", display: "block", opacity: 0.35 }}
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <p style={{ opacity: 0.5 }}>
          Belum ada ulasan dari siswa untuk dapur ini.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {reviews.map((review) => (
        <div
          key={review.id}
          style={{
            border: "1px solid var(--border, #e5e7eb)",
            borderRadius: "10px",
            padding: "14px 16px",
            background: "var(--surface, #fff)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "8px",
            }}
          >
            <div>
              <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                {review.user?.name ?? "Siswa"}
              </span>
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "0.75rem",
                  background: "var(--surface-2, #f3f4f6)",
                  padding: "1px 8px",
                  borderRadius: "8px",
                }}
              >
                {review.school?.name ?? "—"}
              </span>
            </div>
            <span
              style={{
                fontSize: "0.78rem",
                opacity: 0.5,
                whiteSpace: "nowrap",
              }}
            >
              {review.review_date}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {review.content}
          </p>
          {review.flag_status === "flagged" && (
            <span
              style={{
                marginTop: "8px",
                display: "inline-block",
                fontSize: "0.75rem",
                color: "#d97706",
                fontWeight: 600,
              }}
            >
              ⚑ Dilaporkan
            </span>
          )}
        </div>
      ))}

      {meta && meta.last_page > 1 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "8px",
          }}
        >
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            style={{
              padding: "4px 14px",
              borderRadius: "6px",
              border: "1px solid var(--border, #d1d5db)",
              cursor: "pointer",
              background: "none",
            }}
          >
            ←
          </button>
          <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>
            {meta.current_page} / {meta.last_page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === meta.last_page}
            style={{
              padding: "4px 14px",
              borderRadius: "6px",
              border: "1px solid var(--border, #d1d5db)",
              cursor: "pointer",
              background: "none",
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default function Kitchen() {
  const [profile, setProfile] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profil");
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchKitchenProfile = async () => {
      try {
        setLoading(true);
        const resp = await api.get("/sppg/profile");
        if (resp.data) {
          setProfile(resp.data);
          setSchools(resp.data.schools || []);
        }
      } catch (err) {
        console.error("Error fetching kitchen profile:", err);
        setError("Gagal memuat profil dapur");
      } finally {
        setLoading(false);
      }
    };
    fetchKitchenProfile();
  }, []);

  if (loading) {
    return (
      <div className="kp-root">
        <div className="kp-state">
          <span className="kp-state-icon">⏳</span>
          <p>Memuat profil dapur...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kp-root">
        <div className="kp-state kp-state--error">
          <span className="kp-state-icon">⚠</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="kp-root">
        <div className="kp-state">
          <span className="kp-state-icon">🏗</span>
          <h2>Profil Dapur Belum Tersedia</h2>
          <p>Data profil dapur anda sedang diproses oleh administrator.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "profil", label: "Profil Dapur" },
    { key: "menu", label: "Menu Harian" },
    { key: "distribusi", label: "Distribusi" },
    { key: "ulasan", label: "Ulasan" },
  ];

  return (
    <div className="kp-root">
      {/* Header */}
      <div className="kp-header">
        <div className="kp-avatar">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div className="kp-header-info">
          <div className="kp-header-title-row">
            <h1 className="kp-name">{profile.kitchen_name}</h1>
            <span
              className={`kp-badge ${profile.is_active ? "kp-badge--active" : "kp-badge--inactive"}`}
            >
              {profile.is_active ? "✓ Aktif" : "○ Tidak Aktif"}
            </span>
          </div>
          <div className="kp-meta">
            <span className="kp-meta-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {profile.district}, {profile.province}
            </span>
            <span className="kp-meta-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              {profile.contact_phone}
            </span>
          </div>
        </div>
        <button className="kp-edit-btn" onClick={() => setEditOpen(true)}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Profil
        </button>
      </div>

      {/* Tabs */}
      <div className="kp-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`kp-tab ${activeTab === tab.key ? "kp-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "profil" && (
        <div className="kp-grid">
          {/* Location */}
          <div className="kp-card">
            <div className="kp-card-title">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Lokasi
            </div>
            <div className="kp-info-row">
              <span className="kp-info-label">Alamat</span>
              <span className="kp-info-value">{profile.address}</span>
            </div>
            <div className="kp-info-row">
              <span className="kp-info-label">Kecamatan</span>
              <span className="kp-info-value">{profile.district}</span>
            </div>
            <div className="kp-info-row">
              <span className="kp-info-label">Provinsi</span>
              <span className="kp-info-value">{profile.province}</span>
            </div>
          </div>

          {/* Contact */}
          <div className="kp-card">
            <div className="kp-card-title">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              Kontak
            </div>
            <div className="kp-info-row">
              <span className="kp-info-label">Nama PIC</span>
              <span className="kp-info-value">
                {profile.contact_person_name}
              </span>
            </div>
            <div className="kp-info-row">
              <span className="kp-info-label">Telepon</span>
              <a href={`tel:${profile.contact_phone}`} className="kp-info-link">
                {profile.contact_phone}
              </a>
            </div>
            <div className="kp-info-row">
              <span className="kp-info-label">Email</span>
              {profile.contact_email ? (
                <a
                  href={`mailto:${profile.contact_email}`}
                  className="kp-info-link"
                >
                  {profile.contact_email}
                </a>
              ) : (
                <span className="kp-null">Belum diisi</span>
              )}
            </div>
          </div>

          {/* Capacity */}
          <div className="kp-card">
            <div className="kp-card-title">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              Kapasitas Produksi
            </div>
            {profile.production_capacity ? (
              <div style={{ padding: "0.5rem 0" }}>
                <div className="kp-capacity-big">
                  {profile.production_capacity}
                </div>
                <div className="kp-capacity-unit">porsi / hari</div>
              </div>
            ) : (
              <div className="kp-null" style={{ padding: "0.5rem 0" }}>
                Belum diisi
              </div>
            )}
          </div>

          {/* Description */}
          <div className="kp-card">
            <div className="kp-card-title">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Deskripsi
            </div>
            {profile.description ? (
              <p className="kp-description">{profile.description}</p>
            ) : (
              <div className="kp-null" style={{ padding: "0.5rem 0" }}>
                Belum ada deskripsi
              </div>
            )}
          </div>

          {/* Schools - full width */}
          <div className="kp-card kp-card--full">
            <div className="kp-card-title">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Sekolah yang dilayani
              <span className="kp-school-count">{schools.length} sekolah</span>
            </div>
            {schools.length === 0 ? (
              <div className="kp-empty">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{
                    margin: "0 auto 8px",
                    display: "block",
                    opacity: 0.4,
                  }}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18M3 9h18M3 15h18" />
                </svg>
                Belum ada sekolah yang ditugaskan
              </div>
            ) : (
              <div className="kp-schools-grid">
                {schools.map((school) => (
                  <div key={school.id} className="kp-school-item">
                    <span className="kp-school-name">{school.name}</span>
                    <span className="kp-school-district">
                      {school.district}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "ulasan" && (
        <div style={{ padding: "0 0 1rem" }}>
          <UlasanTab />
        </div>
      )}

      {activeTab === "distribusi" && (
        <div style={{ padding: "0 0 1rem" }}>
          <DistribusiHarian />
        </div>
      )}

      {activeTab === "menu" && (
        <div className="kp-coming-soon">
          <p>Halaman ini sedang dalam pengembangan.</p>
        </div>
      )}

      {editOpen && (
        <KitchenEditModal
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSaved={(updated) => {
            setProfile(updated);
            setSchools(updated.schools ?? []);
          }}
        />
      )}
    </div>
  );
}
