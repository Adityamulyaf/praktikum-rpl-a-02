import { useState, useRef } from "react";
import { searchPublicSchools } from "../api/auth";
import PersonalStrip from "../components/PersonalStrip";
import LandingKitchenProfile from "../pages/KitchenProfile/LandingKitchenProfile";
import "../pages/PublicLanding.css";

/* Icons: 32px outlined, no colored backgrounds per DESIGN.md §8.1 */
const FEATURES = [
    {
        key: "search",
        icon: (
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
            </svg>
        ),
        name: "Cari SPPG & Sekolah",
        desc: "Temukan dapur MBG yang melayani sekolah tertentu. Ketik nama sekolah atau kabupaten.",
        badge: null,
    },
    {
        key: "menu",
        icon: (
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
            </svg>
        ),
        name: "Menu Harian",
        desc: "Pantau menu makanan yang disajikan setiap hari beserta kandungan nutrisinya.",
        badge: "Segera",
    },
    {
        key: "distribusi",
        icon: (
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="1" y="3" width="15" height="13" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
        ),
        name: "Status Distribusi",
        desc: "Cek secara real-time apakah MBG sudah dikirim dan tiba di sekolah hari ini.",
        badge: "Segera",
    },
    {
        key: "profil",
        icon: (
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
        name: "Profil Dapur",
        desc: "Lihat informasi lengkap setiap dapur MBG — alamat, kapasitas, dan sekolah yang dilayani.",
        badge: null,
    },
];

const STATS = [
    { num: "500+", label: "Sekolah Terdaftar" },
    { num: "34", label: "Provinsi" },
    { num: "150+", label: "Dapur SPPG" },
];

export default function PublicLandingContent({ onNavigate }) {
    const [view, setView] = useState("landing"); // 'landing' | 'profil-dapur'
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const debounceRef = useRef(null);

    if (view === "profil-dapur") {
        return <LandingKitchenProfile onBack={() => setView("landing")} />;
    }

    const handleInput = (e) => {
        const q = e.target.value;
        setQuery(q);
        clearTimeout(debounceRef.current);
        if (q.length < 2) {
            setResults([]);
            setSearched(false);
            return;
        }
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const { data } = await searchPublicSchools(q);
                setResults(data);
                setSearched(true);
            } catch {
                setResults([]);
                setSearched(true);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    return (
        <div className="plc-root">
            {/* ── HERO — solid navy, no gradients per DESIGN.md §4.5 ── */}
            <section className="plc-hero">
                <div className="plc-hero-inner">
                    <span className="plc-hero-overline">
                        Platform Monitoring MBG
                    </span>

                    <h1 className="plc-hero-title">
                        Pantau Distribusi
                        <br />
                        Makan Bergizi Gratis
                    </h1>

                    <p className="plc-hero-sub">
                        Platform transparan untuk memantau distribusi, menu, dan
                        kualitas program MBG di seluruh Indonesia.
                    </p>

                    {/* Search */}
                    <div className="plc-search-wrap">
                        <div className="plc-search-icon">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                        </div>
                        <input
                            className="plc-search-input"
                            type="text"
                            placeholder="Cari nama sekolah atau kabupaten..."
                            value={query}
                            onChange={handleInput}
                            autoComplete="off"
                        />
                        {loading && <div className="plc-search-spinner" />}

                        {searched && (
                            <div className="plc-search-results">
                                {results.length === 0 ? (
                                    <div className="plc-search-empty">
                                        Tidak ada sekolah ditemukan untuk
                                        &ldquo;{query}&rdquo;
                                    </div>
                                ) : (
                                    <>
                                        <div className="plc-search-count">
                                            {results.length} sekolah ditemukan
                                        </div>
                                        {results.slice(0, 8).map((s) => (
                                            <div
                                                key={s.id}
                                                className="plc-school-item"
                                            >
                                                <div>
                                                    <div className="plc-school-name">
                                                        {s.name}
                                                    </div>
                                                    <div className="plc-school-loc">
                                                        {s.district} ·{" "}
                                                        {s.province}
                                                    </div>
                                                </div>
                                                <span className="plc-school-badge">
                                                    SPPG: segera
                                                </span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="plc-stats">
                        {STATS.map((s) => (
                            <div key={s.label} className="plc-stat-item">
                                <span className="plc-stat-num">{s.num}</span>
                                <span className="plc-stat-label">
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll hint — fills empty space, signals content below */}
                <div className="plc-hero-scroll" aria-hidden="true">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </section>

            {/* Personal strip — only shown when logged in (onNavigate provided) */}
            {onNavigate && <PersonalStrip onNavigate={onNavigate} />}

            {/* ── FEATURES — cards per DESIGN.md §5.2 ──────────────── */}
            <section className="plc-features">
                <div className="plc-features-inner">
                    <span className="plc-section-eyebrow">Fitur Platform</span>
                    <h2 className="plc-features-title">
                        Semua yang kamu butuhkan dalam satu tempat
                    </h2>
                    <p className="plc-features-sub">
                        Dari pencarian sekolah hingga pemantauan distribusi
                        harian — gratis dan terbuka untuk seluruh masyarakat.
                    </p>

                    <div className="plc-features-grid">
                        {FEATURES.map(({ key, icon, name, desc, badge }) => (
                            <div
                                key={key}
                                className={`plc-feature-card${key === "profil" ? " plc-feature-card--link" : ""}`}
                                onClick={
                                    key === "profil"
                                        ? () => setView("profil-dapur")
                                        : undefined
                                }
                                role={key === "profil" ? "button" : undefined}
                                tabIndex={key === "profil" ? 0 : undefined}
                                onKeyDown={
                                    key === "profil"
                                        ? (e) =>
                                              e.key === "Enter" &&
                                              setView("profil-dapur")
                                        : undefined
                                }
                            >
                                <div className="plc-feature-icon">{icon}</div>
                                <h3 className="plc-feature-name">{name}</h3>
                                <p className="plc-feature-desc">{desc}</p>
                                {badge && (
                                    <span className="plc-feature-badge">
                                        {badge}
                                    </span>
                                )}
                                {key === "profil" && (
                                    <span className="plc-feature-cta">
                                        Lihat direktori →
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ────────────────────────────────────────────── */}
            <footer className="plc-footer">
                <div className="plc-footer-inner">
                    <div className="plc-footer-left">
                        <span className="plc-footer-brand">HaloMBG</span>
                        <p className="plc-footer-tagline">
                            Platform monitoring transparan untuk program Makan
                            Bergizi Gratis Indonesia.
                        </p>
                    </div>
                    <div className="plc-footer-right">
                        <div className="plc-footer-links">
                            <span>Transparansi</span>
                            <span>Akuntabilitas</span>
                            <span>Open Data</span>
                        </div>
                        <p className="plc-footer-copy">
                            © 2026 HaloMBG. Dibuat untuk rakyat Indonesia.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
