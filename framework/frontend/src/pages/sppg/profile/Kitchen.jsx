import { useState, useEffect, useCallback } from "react";
import api from "../../../api/axios";
import "./Kitchen.css";
import KitchenEditModal from "./KitchenEditModal";
import DistribusiHarian from "../distribusi/DistribusiHarian";
import { useAuth } from "../../../context/AuthContext";

function UlasanTab({ apiPrefix }) {
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`${apiPrefix}/reviews`, {
        params: { page: pg },
      });
      setReviews(data.data);
      setMeta(data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [apiPrefix]);

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

function EvaluasiAiSection({ profile }) {
  const [selectedSummaryIdx, setSelectedSummaryIdx] = useState(0);

  if (!profile.sentiment_summaries || profile.sentiment_summaries.length === 0) {
    return (
      <div className="kp-empty" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-tertiary, #8e8d88)" strokeWidth="1.5"
          style={{ margin: "0 auto 12px", display: "block" }}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
          Belum ada Evaluasi AI
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          Hasil rangkuman sentimen ulasan akan muncul setelah sistem menganalisis ulasan siswa harian.
        </p>
      </div>
    );
  }

  const summary = profile.sentiment_summaries[selectedSummaryIdx];
  if (!summary) return null;

  const totalCalculated = Number(summary.positive_count) + Number(summary.neutral_count) + Number(summary.negative_count);
  const posPct = totalCalculated > 0 ? Math.round((Number(summary.positive_count) / totalCalculated) * 100) : 0;
  const neuPct = totalCalculated > 0 ? Math.round((Number(summary.neutral_count) / totalCalculated) * 100) : 0;
  const negPct = totalCalculated > 0 ? Math.round((Number(summary.negative_count) / totalCalculated) * 100) : 0;

  return (
    <div>
      {/* Selector Tanggal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', marginTop: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Pilih Tanggal Rangkuman:</span>
        <select
          value={selectedSummaryIdx}
          onChange={(e) => setSelectedSummaryIdx(Number(e.target.value))}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-default, #e5e3df)',
            fontSize: '13px',
            background: 'var(--surface-1, #fff)',
            color: 'var(--text-primary)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {profile.sentiment_summaries.map((s, idx) => (
            <option key={s.id} value={idx}>
              {s.summary_date} ({s.total_reviews} ulasan)
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Distribusi Sentimen */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Distribusi Sentimen Ulasan
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Bar Chart Sederhana */}
            <div style={{
              display: 'flex',
              height: '24px',
              borderRadius: '6px',
              overflow: 'hidden',
              background: 'var(--surface-3, #f0eeeb)',
              width: '100%'
            }}>
              {summary.total_reviews === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Tidak ada ulasan pada tanggal ini
                </div>
              ) : (
                <>
                  {summary.positive_count > 0 && (
                    <div style={{ width: `${posPct}%`, background: '#2E7D32', transition: 'width 0.3s' }} title={`Positif: ${posPct}%`} />
                  )}
                  {summary.neutral_count > 0 && (
                    <div style={{ width: `${neuPct}%`, background: '#8E8D88', transition: 'width 0.3s' }} title={`Netral: ${neuPct}%`} />
                  )}
                  {summary.negative_count > 0 && (
                    <div style={{ width: `${negPct}%`, background: '#C62828', transition: 'width 0.3s' }} title={`Negatif: ${negPct}%`} />
                  )}
                </>
              )}
            </div>

            {/* Legenda & Detail Persentase */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#2E7D32' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  <strong>Positif:</strong> {summary.positive_count} ({posPct}%)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#8E8D88' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  <strong>Netral:</strong> {summary.neutral_count} ({neuPct}%)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#C62828' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  <strong>Negatif:</strong> {summary.negative_count} ({negPct}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Points Rangkuman AI */}
        <div style={{ borderTop: '1px solid var(--border-default, #e5e3df)', paddingTop: '20px', textAlign: 'left' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Poin-Poin Utama Ulasan (Analisis AI)
          </h4>
          <div style={{
            background: 'var(--surface-2, #f8f7f5)',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid var(--border-default, #e5e3df)',
            fontSize: '13px',
            lineHeight: '1.6',
            color: 'var(--text-primary)',
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit'
          }}>
            {summary.key_points || 'Belum ada analisis detail.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Kitchen() {
  const { role } = useAuth();
  const canEdit = role === "admin" || role === "sppg";

  // Guru uses a different API prefix to access the SPPG profile
  const apiPrefix = role === "guru" ? "/guru/sppg-profile" : "/sppg/profile";

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
        const resp = await api.get(apiPrefix);
        if (resp.data) {
          setProfile(resp.data);
          setSchools(resp.data.schools || []);
        }
      } catch (err) {
        console.error("Error fetching kitchen profile:", err);
        if (err.response?.status === 404) {
          setError("Sekolah Anda belum terhubung dengan dapur SPPG mana pun.");
        } else {
          setError("Gagal memuat profil dapur");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchKitchenProfile();
  }, [apiPrefix]);

  if (loading) {
    return (
      <div className="kp-root">
        <div className="kp-state">
          <span className="kp-state-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1.5s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </span>
          <p>Memuat profil dapur...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kp-root">
        <div className="kp-state kp-state--error">
          <span className="kp-state-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="kp-root">
        <div className="kp-state">
          <span className="kp-state-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <h2>Profil Dapur Belum Tersedia</h2>
          <p>Data profil dapur anda sedang diproses oleh administrator.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "profil", label: "Profil Dapur" },
    { key: "menu", label: "Menu Harian" },
    ...(role !== "guru" ? [{ key: "distribusi", label: "Distribusi" }] : []),
    { key: "ulasan", label: "Ulasan" },
    { key: "evaluasi", label: "Evaluasi AI" },
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
              {profile.district}, {profile.city}, {profile.province}
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
        {canEdit && (
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
        )}
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
              <span className="kp-info-label">Kota/Kabupaten</span>
              <span className="kp-info-value">{profile.city}</span>
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
          <UlasanTab apiPrefix={apiPrefix} />
        </div>
      )}

      {activeTab === "evaluasi" && (
        <div className="kp-card kp-card--full" style={{ marginTop: "0px" }}>
          <div className="kp-card-title">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Ringkasan Evaluasi & Analisis Sentimen (AI)
          </div>
          <div style={{ marginTop: "12px" }}>
            <EvaluasiAiSection profile={profile} />
          </div>
        </div>
      )}

      {activeTab === "distribusi" && (
        <div style={{ padding: "0 0 1rem" }}>
          <DistribusiHarian />
        </div>
      )}

      {activeTab === "menu" && (
        <div className="kp-card kp-card--full" style={{ marginTop: "0px" }}>
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
              <path d="M21 9H3M21 15H3M12 3v18" />
            </svg>
            Menu Harian Dapur
            <span className="kp-school-count">
              {(profile.daily_menus ?? []).length} menu tersedia
            </span>
          </div>
          {(!profile.daily_menus || profile.daily_menus.length === 0) ? (
            <div className="kp-empty" style={{ padding: "2rem", textAlign: "center" }}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ margin: "0 auto 8px", display: "block", opacity: 0.4 }}
              >
                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
              </svg>
              Belum ada menu harian yang diinput untuk dapur ini.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px", width: "100%" }}>
              {profile.daily_menus.map((menu) => (
                <div
                  key={menu.id}
                  className="kp-menu-item"
                >
                  {menu.photo ? (
                    <img
                      src={menu.photo}
                      alt={menu.menu_name}
                      className="kp-menu-item-photo"
                    />
                  ) : (
                    <div
                      className="kp-menu-item-no-photo"
                    >
                      Tanpa Foto
                    </div>
                  )}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary, #64748b)",
                          fontWeight: 600,
                        }}
                      >
                        Disajikan pada: {menu.served_at}
                      </span>
                      {menu.is_ai_validated && (
                        <span
                          style={{
                            fontSize: "10px",
                            padding: "2px 8px",
                            height: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            background: "#E8F5E9",
                            color: "var(--status-success, #2e7d32)",
                          }}
                        >
                          ✓ Tervalidasi AI
                        </span>
                      )}
                    </div>
                    <h4
                      style={{
                        margin: "4px 0",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      {menu.menu_name}
                    </h4>
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        lineHeight: "18px",
                      }}
                    >
                      {menu.components || "—"}
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[
                        { label: "Kalori", value: menu.calories, unit: "kkal" },
                        { label: "Protein", value: menu.protein, unit: "g" },
                        { label: "Karbo", value: menu.carbs, unit: "g" },
                        { label: "Lemak", value: menu.fat, unit: "g" },
                      ].map((macro) => (
                        <span
                          key={macro.label}
                          style={{
                            fontSize: "11px",
                            padding: "4px 8px",
                            background: "var(--surface-1, #ffffff)",
                            border: "1px solid var(--border-default, #e5e3df)",
                            borderRadius: "4px",
                            color: "var(--text-primary)",
                          }}
                        >
                          <strong>{macro.label}:</strong>{" "}
                          {macro.value != null ? `${macro.value} ${macro.unit}` : "—"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {canEdit && editOpen && (
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
