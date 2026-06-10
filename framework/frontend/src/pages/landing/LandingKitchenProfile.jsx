import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import "../sppg/profile/Kitchen.css";
import "./LandingKitchen.css";

const PAGE_SIZE = 20;

/* ── Helpers ──────────────────────────────────────────────────── */
function buildPageNumbers(current, total) {
    const pages = [];
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || Math.abs(i - current) <= 2) {
            pages.push(i);
        }
    }
    const result = [];
    for (let i = 0; i < pages.length; i++) {
        if (i > 0 && pages[i] - pages[i - 1] > 1) result.push("...");
        result.push(pages[i]);
    }
    return result;
}

/* ── Sub-components ───────────────────────────────────────────── */
function StateMessage({ icon, message, isError }) {
    return (
        <div className={`kp-state${isError ? " kp-state--error" : ""}`}>
            <span className="kp-state-icon">{icon}</span>
            <p>{message}</p>
        </div>
    );
}

function KitchenCard({ kitchen, onClick }) {
    return (
        <button className="lkp-card" onClick={() => onClick(kitchen.id)}>
            <div className="lkp-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            </div>
            <div className="lkp-card-body">
                <h3 className="lkp-card-name">{kitchen.kitchen_name}</h3>
                <div className="lkp-card-meta">
                    <span>{kitchen.district}, {kitchen.province}</span>
                    {kitchen.production_capacity && (
                        <span>
                            {Number(kitchen.production_capacity).toLocaleString("id-ID")} porsi/hari
                        </span>
                    )}
                </div>
                {kitchen.description && (
                    <p className="lkp-card-desc">{kitchen.description}</p>
                )}
                <div className="lkp-card-footer">
                    <span className="lkp-schools-badge">{kitchen.schools_count} sekolah</span>
                    <span className="lkp-view-link">Lihat profil →</span>
                </div>
            </div>
        </button>
    );
}

function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    const pages = buildPageNumbers(page, totalPages);

    return (
        <div className="lkp-pagination">
            <button className="lkp-page-btn" onClick={() => onPageChange(1)} disabled={page === 1}>«</button>
            <button className="lkp-page-btn" onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹</button>

            {pages.map((p, idx) =>
                p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="lkp-page-ellipsis">…</span>
                ) : (
                    <button
                        key={p}
                        className={`lkp-page-btn${p === page ? " lkp-page-btn--active" : ""}`}
                        onClick={() => onPageChange(p)}
                    >
                        {p}
                    </button>
                )
            )}

            <button className="lkp-page-btn" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>›</button>
            <button className="lkp-page-btn" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>»</button>
        </div>
    );
}

function PhotoViewerModal({ photoUrl, onClose }) {
    return (
        <div className="adm-overlay" onClick={onClose} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }}>
            <div className="adm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: 0, overflow: 'hidden', position: 'relative' }}>
                <img src={photoUrl} alt="Bukti pengiriman" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <button 
                    onClick={onClose} 
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(0,0,0,0.5)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    &times;
                </button>
            </div>
        </div>
    );
}

function PublicUlasanTab({ sppgId }) {
    const [reviews, setReviews] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async (pg = 1) => {
        setLoading(true);
        try {
            const { data } = await api.get('/public/reviews', {
                params: { sppg_id: sppgId, page: pg },
            });
            setReviews(data.data || []);
            setMeta(data);
        } catch {
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, [sppgId]);

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

function KitchenDetail({ id, onBack, initialMode = "profil" }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(initialMode);
    const [selectedSummaryIdx, setSelectedSummaryIdx] = useState(0);

    const [distRecords, setDistRecords] = useState([]);
    const [distLoading, setDistLoading] = useState(false);
    const [distDate, setDistDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/public/sppg/${id}`);
                if (!cancelled) setProfile(data);
            } catch {
                if (!cancelled) setError("Gagal memuat profil dapur.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [id]);

    useEffect(() => {
        if (activeTab !== "distribusi") return;
        let cancelled = false;
        (async () => {
            try {
                setDistLoading(true);
                const { data } = await api.get("/public/distribution", { params: { date: distDate } });
                if (!cancelled) {
                    const filtered = data.filter((r) => r.sppg?.id === id);
                    setDistRecords(filtered);
                }
            } catch {
                if (!cancelled) setDistRecords([]);
            } finally {
                if (!cancelled) setDistLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [distDate, activeTab, id]);

    if (loading) return (
        <div className="kp-root">
            <StateMessage
                icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1.5s linear infinite', display: 'inline-block' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                }
                message="Memuat profil dapur..."
            />
        </div>
    );
    if (error) return (
        <div className="kp-root">
            <StateMessage
                icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                }
                message={error}
                isError
            />
        </div>
    );
    if (!profile) return null;

    const schools = profile.schools ?? [];

    return (
        <div className="kp-root">
            <button className="lkp-back-btn" onClick={onBack}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Kembali ke daftar dapur
            </button>

            <div className="kp-header">
                <div className="kp-avatar">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </div>
                <div className="kp-header-info">
                    <div className="kp-header-title-row">
                        <h1 className="kp-name">{profile.kitchen_name}</h1>
                        <span className="kp-badge kp-badge--active">✓ Aktif</span>
                    </div>
                    <div className="kp-meta">
                        <span className="kp-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {profile.district}, {profile.province}
                        </span>
                        {profile.contact_phone && (
                            <span className="kp-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 015.13 15.8a19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                {profile.contact_phone}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="kp-tabs" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-default, #e5e3df)' }}>
                <button
                    className={`kp-tab ${activeTab === "profil" ? "kp-tab--active" : ""}`}
                    onClick={() => setActiveTab("profil")}
                >
                    Profil Dapur
                </button>
                <button
                    className={`kp-tab ${activeTab === "menu" ? "kp-tab--active" : ""}`}
                    onClick={() => setActiveTab("menu")}
                >
                    Menu Harian
                </button>
                <button
                    className={`kp-tab ${activeTab === "distribusi" ? "kp-tab--active" : ""}`}
                    onClick={() => setActiveTab("distribusi")}
                >
                    Status Distribusi
                </button>
                <button
                    className={`kp-tab ${activeTab === "ulasan" ? "kp-tab--active" : ""}`}
                    onClick={() => setActiveTab("ulasan")}
                >
                    Ulasan
                </button>
                <button
                    className={`kp-tab ${activeTab === "evaluasi" ? "kp-tab--active" : ""}`}
                    onClick={() => setActiveTab("evaluasi")}
                >
                    Evaluasi AI
                </button>
            </div>

            {activeTab === "profil" && (
                <div className="kp-grid">
                    <div className="kp-card">
                        <div className="kp-card-title">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            Lokasi
                        </div>
                        {[
                            ["Alamat", profile.address || "—"],
                            ["Kecamatan", profile.district],
                            ["Provinsi", profile.province],
                        ].map(([label, value]) => (
                            <div key={label} className="kp-info-row">
                                <span className="kp-info-label">{label}</span>
                                <span className="kp-info-value">{value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="kp-card">
                        <div className="kp-card-title">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                            </svg>
                            Kontak
                        </div>
                        <div className="kp-info-row">
                            <span className="kp-info-label">Nama PIC</span>
                            <span className="kp-info-value">{profile.contact_person_name || "—"}</span>
                        </div>
                        <div className="kp-info-row">
                            <span className="kp-info-label">Telepon</span>
                            {profile.contact_phone
                                ? <a href={`tel:${profile.contact_phone}`} className="kp-info-link">{profile.contact_phone}</a>
                                : <span className="kp-null">Belum diisi</span>}
                        </div>
                        <div className="kp-info-row">
                            <span className="kp-info-label">Email</span>
                            {profile.contact_email
                                ? <a href={`mailto:${profile.contact_email}`} className="kp-info-link">{profile.contact_email}</a>
                                : <span className="kp-null">Belum diisi</span>}
                        </div>
                    </div>

                    <div className="kp-card">
                        <div className="kp-card-title">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M3 9h18M9 21V9" />
                            </svg>
                            Kapasitas Produksi
                        </div>
                        {profile.production_capacity ? (
                            <div style={{ padding: "0.5rem 0" }}>
                                <div className="kp-capacity-big">
                                    {Number(profile.production_capacity).toLocaleString("id-ID")}
                                </div>
                                <div className="kp-capacity-unit">porsi / hari</div>
                            </div>
                        ) : (
                            <div className="kp-null" style={{ padding: "0.5rem 0" }}>Belum diisi</div>
                        )}
                    </div>

                    <div className="kp-card">
                        <div className="kp-card-title">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            Deskripsi
                        </div>
                        {profile.description
                            ? <p className="kp-description">{profile.description}</p>
                            : <div className="kp-null" style={{ padding: "0.5rem 0" }}>Belum ada deskripsi</div>}
                    </div>

                    <div className="kp-card kp-card--full">
                        <div className="kp-card-title">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                            Sekolah yang dilayani
                            <span className="kp-school-count">{schools.length} sekolah</span>
                        </div>
                        {schools.length === 0 ? (
                            <div className="kp-empty">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="1.5"
                                    style={{ margin: "0 auto 8px", display: "block", opacity: 0.4 }}>
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
                                        <span className="kp-school-district">{school.district}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "evaluasi" && (
                <div className="kp-card kp-card--full" style={{ marginTop: '0px' }}>
                    <div className="kp-card-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Ringkasan Evaluasi & Analisis Sentimen (AI)
                    </div>
                    {(!profile.sentiment_summaries || profile.sentiment_summaries.length === 0) ? (
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
                    ) : (
                        <div>
                            {/* Selector Tanggal */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
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

                            {/* Tampilan Ringkasan Terpilih */}
                            {(() => {
                                const summary = profile.sentiment_summaries[selectedSummaryIdx];
                                if (!summary) return null;

                                const totalCalculated = Number(summary.positive_count) + Number(summary.neutral_count) + Number(summary.negative_count);
                                const posPct = totalCalculated > 0 ? Math.round((Number(summary.positive_count) / totalCalculated) * 100) : 0;
                                const neuPct = totalCalculated > 0 ? Math.round((Number(summary.neutral_count) / totalCalculated) * 100) : 0;
                                const negPct = totalCalculated > 0 ? Math.round((Number(summary.negative_count) / totalCalculated) * 100) : 0;

                                return (
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
                                        <div style={{ borderTop: '1px solid var(--border-default, #e5e3df)', paddingTop: '20px' }}>
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
                                );
                            })()}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "ulasan" && (
                <div className="kp-card kp-card--full" style={{ marginTop: '0px' }}>
                    <div className="kp-card-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Ulasan Siswa
                    </div>
                    <div style={{ marginTop: "12px" }}>
                        <PublicUlasanTab sppgId={id} />
                    </div>
                </div>
            )}

            {activeTab === "menu" && (
                <div className="kp-card kp-card--full" style={{ marginTop: '0px' }}>
                    <div className="kp-card-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M21 9H3M21 15H3M12 3v18" />
                        </svg>
                        Menu Harian Dapur
                        <span className="kp-school-count">{(profile.daily_menus ?? []).length} menu tersedia</span>
                    </div>
                    {(!profile.daily_menus || profile.daily_menus.length === 0) ? (
                        <div className="kp-empty" style={{ padding: '2rem', textAlign: 'center' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="1.5"
                                style={{ margin: "0 auto 8px", display: "block", opacity: 0.4 }}>
                                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                            </svg>
                            Belum ada menu harian yang diinput untuk dapur ini.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px', width: '100%' }}>
                            {profile.daily_menus.map((menu) => (
                                <div key={menu.id} style={{
                                    display: 'flex',
                                    gap: '16px',
                                    border: '1px solid var(--border-default, #e5e3df)',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    background: 'var(--surface-2, #fbfbfa)',
                                    alignItems: 'flex-start',
                                    textAlign: 'left'
                                }}>
                                    {menu.photo ? (
                                        <img src={menu.photo} alt={menu.menu_name} style={{
                                            width: '120px',
                                            height: '90px',
                                            objectFit: 'cover',
                                            borderRadius: '6px',
                                            background: '#1a1a18',
                                            flexShrink: 0
                                        }} />
                                    ) : (
                                        <div style={{
                                            width: '120px',
                                            height: '90px',
                                            borderRadius: '6px',
                                            background: '#e5e3df',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#8c8a85',
                                            fontSize: '11px',
                                            fontWeight: 500,
                                            flexShrink: 0
                                        }}>
                                            Tanpa Foto
                                        </div>
                                    )}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', color: 'var(--text-secondary, #64748b)', fontWeight: 600 }}>
                                                Disajikan pada: {menu.served_at}
                                            </span>
                                            {menu.is_ai_validated && (
                                                <span className="vai-badge vai-badge-success" style={{
                                                    fontSize: '10px',
                                                    padding: '2px 8px',
                                                    height: '20px',
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    ✓ Tervalidasi AI
                                                </span>
                                            )}
                                        </div>
                                        <h4 style={{ margin: '4px 0', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                            {menu.menu_name}
                                        </h4>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '18px' }}>
                                            {menu.components || '—'}
                                        </p>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {[
                                                { label: 'Kalori', value: menu.calories, unit: 'kkal' },
                                                { label: 'Protein', value: menu.protein, unit: 'g' },
                                                { label: 'Karbo', value: menu.carbs, unit: 'g' },
                                                { label: 'Lemak', value: menu.fat, unit: 'g' },
                                            ].map((macro) => (
                                                <span key={macro.label} style={{
                                                    fontSize: '11px',
                                                    padding: '4px 8px',
                                                    background: 'var(--surface-1, #ffffff)',
                                                    border: '1px solid var(--border-default, #e5e3df)',
                                                    borderRadius: '4px',
                                                    color: 'var(--text-primary)'
                                                }}>
                                                    <strong>{macro.label}:</strong> {macro.value != null ? `${macro.value} ${macro.unit}` : '—'}
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

            {activeTab === "distribusi" && (
                <div className="kp-card kp-card--full" style={{ marginTop: '0px' }}>
                    <div className="kp-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="3" width="15" height="13" />
                                <path d="M16 8h4l3 3v5h-7V8z" />
                                <circle cx="5.5" cy="18.5" r="2.5" />
                                <circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                            <span>Status Distribusi</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>Tanggal:</span>
                            <input
                                type="date"
                                value={distDate}
                                onChange={(e) => setDistDate(e.target.value)}
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-default, #e5e3df)',
                                    fontSize: '12px',
                                    background: 'var(--surface-1, #fff)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>
                    </div>

                    {distLoading ? (
                        <p style={{ padding: '2rem 0', textAlign: 'center', opacity: 0.6 }}>Memuat status distribusi...</p>
                    ) : distRecords.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                            Belum ada data distribusi untuk tanggal <strong>{distDate}</strong>.
                        </div>
                    ) : (
                        <div className="adm-table-wrap" style={{ marginTop: '12px', width: '100%' }}>
                            <table className="adm-table">
                                <thead>
                                    <tr>
                                        <th>Sekolah</th>
                                        <th>Kecamatan</th>
                                        <th>Status</th>
                                        <th>Foto Bukti</th>
                                        <th>Diperbarui</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {distRecords.map((rec) => (
                                        <tr key={rec.id}>
                                            <td>{rec.school?.name ?? '—'}</td>
                                            <td>{rec.school?.district ?? '—'}</td>
                                            <td>
                                                <span className={`adm-badge ${
                                                    rec.status === 'belum_diantar' ? 'inactive' :
                                                    rec.status === 'sudah_diantar' ? 'active' :
                                                    rec.status === 'batal' ? 'danger' : ''
                                                }`}>
                                                    {rec.status === 'belum_diantar' ? 'Belum Diantar' :
                                                     rec.status === 'siap_diantar' ? 'Siap Diantar' :
                                                     rec.status === 'sudah_diantar' ? 'Sudah Diantar' :
                                                     rec.status === 'batal' ? 'Batal' : rec.status}
                                                </span>
                                            </td>
                                            <td>
                                                {rec.photo ? (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setSelectedPhoto(rec.photo)}
                                                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                    >
                                                        <img src={rec.photo} alt="Bukti" style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                                                    </button>
                                                ) : (
                                                    <span style={{ fontSize: '0.85rem', opacity: 0.5 }}>—</span>
                                                )}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', opacity: 0.7 }}>
                                                {rec.status_updated_at
                                                    ? new Date(rec.status_updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                                    : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {selectedPhoto && (
                <PhotoViewerModal
                    photoUrl={selectedPhoto}
                    onClose={() => setSelectedPhoto(null)}
                />
            )}
        </div>
    );
}

/* ── Main export ──────────────────────────────────────────────── */
export default function LandingKitchenProfile({ onBack, initialMode = "profil", initialKitchenId = null }) {
    const [kitchens, setKitchens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedId, setSelectedId] = useState(initialKitchenId);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/public/sppg");
                setKitchens(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err?.response?.data?.message || err?.message || "Gagal memuat daftar dapur.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => { setPage(1); }, [search]);

    const handlePageChange = useCallback((p) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    if (selectedId !== null) {
        return <KitchenDetail id={selectedId} onBack={() => setSelectedId(null)} initialMode={initialMode} />;
    }

    const filtered = kitchens.filter((k) => {
        const q = search.toLowerCase();
        return (
            k.kitchen_name.toLowerCase().includes(q) ||
            k.district?.toLowerCase().includes(q) ||
            k.province?.toLowerCase().includes(q)
        );
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="lkp-root">
            <div className="lkp-header">
                <button className="lkp-back-btn" onClick={onBack}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Kembali
                </button>
                <div className="lkp-header-text">
                    <h1 className="lkp-title">Direktori Dapur MBG</h1>
                    <p className="lkp-sub">
                        Daftar seluruh dapur Satuan Pelayanan Pemenuhan Gizi (SPPG) yang aktif.
                    </p>
                </div>
            </div>

            {selectedId === null && initialMode !== "profil" && (
                <div className="lkp-info-banner">
                    <div className="lkp-info-banner-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    </div>
                    <div className="lkp-info-banner-content">
                        <div className="lkp-info-banner-title">Pilih Dapur SPPG Terlebih Dahulu</div>
                        <p className="lkp-info-banner-desc">
                            Untuk melihat {initialMode === "menu" ? "menu harian" : "status distribusi"} makanan gratis, silakan pilih salah satu dapur SPPG di bawah ini terlebih dahulu.
                        </p>
                    </div>
                </div>
            )}

            <div className="lkp-search-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="lkp-search-icon">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                    className="lkp-search-input"
                    type="text"
                    placeholder="Cari nama dapur, kecamatan, atau provinsi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoComplete="off"
                />
            </div>

            {loading && (
                <StateMessage
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1.5s linear infinite', display: 'inline-block' }}>
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    }
                    message="Memuat daftar dapur..."
                />
            )}
            {!loading && error && (
                <StateMessage
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    }
                    message={error}
                    isError
                />
            )}
            {!loading && !error && filtered.length === 0 && (
                <StateMessage
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    }
                    message={search ? `Tidak ada dapur ditemukan untuk "${search}"` : "Belum ada dapur yang terdaftar."}
                />
            )}

            {!loading && !error && filtered.length > 0 && (
                <>
                    <p className="lkp-count">
                        {filtered.length} dapur ditemukan
                        {totalPages > 1 && ` · halaman ${page} dari ${totalPages}`}
                    </p>

                    <div className="lkp-grid">
                        {paginated.map((k) => (
                            <KitchenCard key={k.id} kitchen={k} onClick={setSelectedId} />
                        ))}
                    </div>

                    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    );
}