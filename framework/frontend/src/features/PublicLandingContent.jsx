import { useEffect, useState, useRef } from 'react';
import { searchPublicSchools } from '../api/auth';
import api from '../api/axios';
import PersonalStrip from '../components/PersonalStrip';
import LandingKitchenProfile from '../pages/landing/LandingKitchenProfile';
import MonitoringStatusDistribusi from './monitoring/MonitoringStatusDistribusi';
import { useAuth } from '../context/AuthContext';
import '../pages/landing/PublicLanding.css';

/* ── COUNT-UP ANIMATION HOOK ───────────────────────────────── */
function useCountUp(end, duration = 1600) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;
        const numericEnd = parseInt(end.replace(/\D/g, ''), 10);
        if (isNaN(numericEnd) || numericEnd === 0) { setCount(numericEnd); return; }
        let frame;
        const start = performance.now();
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * numericEnd));
            if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [started, end, duration]);

    const suffix = end.replace(/[0-9]/g, '');
    return { ref, display: started ? `${count}${suffix}` : '0' };
}

function AnimatedStat({ num, label }) {
    const { ref, display } = useCountUp(num);
    return (
        <div className="plc-stat-item" ref={ref}>
            <span className="plc-stat-num">{display}</span>
            <span className="plc-stat-label">{label}</span>
        </div>
    );
}

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
        badge: null,
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
        badge: null,
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
    const { role } = useAuth();
    const [view, setView] = useState("landing");
    const [kitchenProfileMode, setKitchenProfileMode] = useState("profil");
    const [assignedSppgId, setAssignedSppgId] = useState(null);
    const [loadingSppg, setLoadingSppg] = useState(false);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const [selectedSchool, setSelectedSchool] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    // ── EFFECT: Click Outside Dropdown ──
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // ── EFFECT: Cleanup Debounce on Unmount ──
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    // ── HANDLERS & ACTIONS ──

    const handleInput = (e) => {
        const q = e.target.value;

        setQuery(q);
        setSelectedSchool(null);
        setIsDropdownOpen(true);

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

    const handleSearchFocus = () => {
        if (query.length >= 2 && searched) {
            setIsDropdownOpen(true);
        }
    };

    const handleSelectSchool = (school) => {
        setSelectedSchool(school);
        setQuery(school.name);
        setIsDropdownOpen(false);
    };

    // ── LOGIC: getSppgNames (HEAD Branch Specific) ──
    const getSppgNames = (school) => {
        const names = school.sppg_profiles
            ?.map((sppg) => sppg.kitchen_name)
            .filter(Boolean) ?? [];

        return names.length > 0
            ? names.join(", ")
            : "SPPG belum tersedia";
    };

    const handleSiswaFeatureClick = async (key) => {
        if (loadingSppg) return;
        setLoadingSppg(true);
        try {
            const { data } = await api.get('/siswa/sppg-info');
            if (data.served && data.id) {
                setAssignedSppgId(data.id);
                setKitchenProfileMode(key);
                setView("profil-dapur");
            } else {
                alert(data.message || 'Sekolah Anda belum terhubung dengan dapur SPPG mana pun.');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal memuat informasi SPPG dapur.');
        } finally {
            setLoadingSppg(false);
        }
    };

    // ── VIEW SWITCH: LandingKitchenProfile ──
    if (view === "profil-dapur") {
        return (
            <LandingKitchenProfile
                initialMode={kitchenProfileMode}
                initialKitchenId={assignedSppgId}
                onBack={() => setView("landing")}
            />
        );
    }

    // ── VIEW SWITCH: MonitoringStatusDistribusi ──
    if (view === "distribusi") {
        return (
            <div className="lkp-root">
                <button className="lkp-back-btn" onClick={() => setView("landing")}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Kembali
                </button>
                <MonitoringStatusDistribusi />
            </div>
        );
    }

    return (
        <div className="plc-root">
            {loadingSppg && (
                <div className="plc-loading-overlay">
                    <div className="plc-loading-spinner" />
                    <span className="plc-loading-text">Memproses data dapur...</span>
                </div>
            )}
            {/* ── HERO — solid navy, no gradients per DESIGN.md §4.5 ── */}
            <section className="plc-hero">
                <div className="plc-hero-inner">
                    <span className="plc-hero-overline">
                        Platform Monitoring MBG
                    </span>

                    <h1 className="plc-hero-title">
                        Pantau. Pastikan.<br />Transparan.
                    </h1>

                    <p className="plc-hero-sub">
                        Platform transparan untuk memantau distribusi, menu, dan
                        kualitas program MBG di seluruh Indonesia.
                    </p>

                    {/* Search */}
                    <div className="plc-search-wrap" ref={searchRef}>
                        <div className="plc-search-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                            </svg>
                        </div>
                        <input
                            className="plc-search-input"
                            type="text"
                            placeholder="Cari nama sekolah atau kabupaten..."
                            value={query}
                            onChange={handleInput}
                            onFocus={handleSearchFocus}
                            autoComplete="off"
                        />
                        {loading && <div className="plc-search-spinner" />}

                        {searched && isDropdownOpen && (
                            <div className="plc-search-results">
                                {results.length === 0 ? (
                                    <div className="plc-search-empty">
                                        Tidak ada sekolah ditemukan untuk &ldquo;{query}&rdquo;
                                    </div>
                                ) : (
                                    <>
                                        <div className="plc-search-count">{results.length} sekolah ditemukan</div>
                                        <div className="plc-search-list">
                                            {results.map((s) => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    className="plc-school-item"
                                                    onClick={() => handleSelectSchool(s)}
                                                >
                                                    <div>
                                                        <div className="plc-school-name">{s.name}</div>
                                                        <div className="plc-school-loc">{s.district} · {s.province}</div>
                                                    </div>
                                                    <span className="plc-school-badge">{getSppgNames(s)}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {selectedSchool && (
                            <div className="plc-selected-school">
                                <div>
                                    <div className="plc-selected-label">Sekolah dipilih</div>
                                    <div className="plc-selected-name">{selectedSchool.name}</div>
                                    <div className="plc-selected-meta">
                                        {selectedSchool.district ?? 'Kabupaten tidak tersedia'} · {selectedSchool.province ?? 'Provinsi tidak tersedia'}
                                    </div>
                                </div>
                                <div className="plc-selected-sppg">
                                    <span>Dapur SPPG</span>
                                    <strong>{getSppgNames(selectedSchool)}</strong>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats — animated count-up */}
                    <div className="plc-stats">
                        {STATS.map((s) => (
                            <AnimatedStat key={s.label} num={s.num} label={s.label} />
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

                {/* Wave divider: smooth curve transition to features */}
                <div className="plc-wave-divider" aria-hidden="true">
                    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,60 L0,20 Q360,0 720,20 Q1080,40 1440,20 L1440,60 Z" fill="var(--surface-1)" />
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
                                className={`plc-feature-card${key === "profil" || key === "distribusi" || key === "menu" ? " plc-feature-card--link" : ""}`}
                                onClick={() => {
                                    if (role === "siswa" && (key === "menu" || key === "distribusi" || key === "profil")) {
                                        handleSiswaFeatureClick(key);
                                    } else if (onNavigate && (role === "siswa" || role === "guru")) {
                                        if (key === "menu") onNavigate("menu");
                                        if (key === "distribusi") onNavigate("distribusi");
                                        if (key === "profil") onNavigate("profil");
                                    } else {
                                        if (key === "menu") {
                                            setKitchenProfileMode("menu");
                                            setAssignedSppgId(null);
                                            setView("profil-dapur");
                                        } else if (key === "distribusi") {
                                            setKitchenProfileMode("distribusi");
                                            setAssignedSppgId(null);
                                            setView("profil-dapur");
                                        } else if (key === "profil") {
                                            setKitchenProfileMode("profil");
                                            setAssignedSppgId(null);
                                            setView("profil-dapur");
                                        }
                                    }
                                }}
                                role={key === "profil" || key === "distribusi" || key === "menu" ? "button" : undefined}
                                tabIndex={key === "profil" || key === "distribusi" || key === "menu" ? 0 : undefined}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (role === "siswa" && (key === "menu" || key === "distribusi" || key === "profil")) {
                                            handleSiswaFeatureClick(key);
                                        } else if (onNavigate && (role === "siswa" || role === "guru")) {
                                            if (key === "menu") onNavigate("menu");
                                            if (key === "distribusi") onNavigate("distribusi");
                                            if (key === "profil") onNavigate("profil");
                                        } else {
                                            if (key === "menu") {
                                                setKitchenProfileMode("menu");
                                                setAssignedSppgId(null);
                                                setView("profil-dapur");
                                            } else if (key === "distribusi") {
                                                setKitchenProfileMode("distribusi");
                                                setAssignedSppgId(null);
                                                setView("profil-dapur");
                                            } else if (key === "profil") {
                                                setKitchenProfileMode("profil");
                                                setAssignedSppgId(null);
                                                setView("profil-dapur");
                                            }
                                        }
                                    }
                                }}
                            >
                                <div className="plc-feature-icon">{icon}</div>
                                <h3 className="plc-feature-name">{name}</h3>
                                <p className="plc-feature-desc">{desc}</p>
                                {badge && (
                                    <span className="plc-feature-badge">
                                        {badge}
                                    </span>
                                )}
                                {key === "menu" && (
                                    <span className="plc-feature-cta">
                                        Lihat menu harian →
                                    </span>
                                )}
                                {key === "profil" && (
                                    <span className="plc-feature-cta">
                                        Lihat direktori →
                                    </span>
                                )}
                                {key === "distribusi" && (
                                    <span className="plc-feature-cta">
                                        Pantau status →
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER — per DESIGN.md §5.9 ───────────────────────── */}
            <footer className="plc-footer">
                <div className="plc-footer-inner">
                    {/* Row 1: CTA + Nav columns */}
                    <div className="plc-footer-top">
                        <p className="plc-footer-tagline">
                            Transparansi untuk masa depan gizi Indonesia
                        </p>
                        <nav className="plc-footer-nav">
                            <div className="plc-footer-nav-col">
                                <span>Profil Dapur</span>
                                <span>Menu Harian</span>
                                <span>Status Distribusi</span>
                                <span>Validasi Gizi AI</span>
                            </div>
                            <div className="plc-footer-nav-col">
                                <span>Ulasan Siswa</span>
                                <span>Monitoring</span>
                                <span>Tentang MBG</span>
                            </div>
                        </nav>
                    </div>

                    {/* Row 2: Oversized brand wordmark */}
                    <div className="plc-footer-brand-display" aria-hidden="true">
                        HaloMBG
                    </div>

                    {/* Row 3: Bottom bar */}
                    <div className="plc-footer-bottom">
                        <p className="plc-footer-copy">© 2026 HaloMBG</p>
                        <div className="plc-footer-legal">
                            <span>Kebijakan Privasi</span>
                            <span>Syarat Layanan</span>
                            <span>Open Data</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}