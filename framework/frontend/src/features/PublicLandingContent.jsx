import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPublicSchools } from '../api/auth';
import api from '../api/axios';
import PersonalStrip from '../components/PersonalStrip';
import LandingKitchenProfile from '../pages/landing/LandingKitchenProfile';
import MonitoringStatusDistribusi from './monitoring/MonitoringStatusDistribusi';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import '../pages/landing/PublicLanding.css';

// Import Framer Motion for premium physics-based animations
import { motion, AnimatePresence } from 'framer-motion';

// Import MBG generated assets for landing page background cards
import mbgKidsEating from '../assets/mbg_kids_eating.png';
import mbgSocialization from '../assets/mbg_socialization.png';
import mbgKitchenPrep from '../assets/mbg_kitchen_prep.png';
import mbgMealBox from '../assets/mbg_meal_box.png';

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

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div 
            className={`plc-faq-item${isOpen ? ' plc-faq-item--open' : ''}`} 
            onClick={() => setIsOpen(!isOpen)} 
            role="button" 
            tabIndex={0}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 70, damping: 15 }}
        >
            <div className="plc-faq-question">
                <span>{question}</span>
                <span className="plc-faq-toggle" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>+</span>
            </div>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="plc-faq-answer"
                    >
                        <p>{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
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
    { num: "215rb+", label: "Sekolah Terdaftar" },
    { num: "34", label: "Provinsi" },
    { num: "500", label: "Dapur SPPG" },
];

export default function PublicLandingContent({ onNavigate }) {
    const { role, token } = useAuth();
    const navigate = useNavigate();
    const [view, setView] = useState("landing");
    const [kitchenProfileMode, setKitchenProfileMode] = useState("profil");
    const [assignedSppgId, setAssignedSppgId] = useState(null);
    const [loadingSppg, setLoadingSppg] = useState(false);

    // Parallax mouse position state for landing hero
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [glowPos, setGlowPos] = useState({ x: '50%', y: '50%' });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientWidth, clientHeight } = document.documentElement;
            // Normalize cursor position between -0.5 and 0.5
            const x = (e.clientX / clientWidth) - 0.5;
            const y = (e.clientY / clientHeight) - 0.5;
            setMousePos({ x, y });

            // Glow tracking coordinate relative to the hero section
            const heroEl = document.querySelector('.plc-hero');
            if (heroEl) {
                const rect = heroEl.getBoundingClientRect();
                const glowX = `${((e.clientX - rect.left) / rect.width) * 100}%`;
                const glowY = `${((e.clientY - rect.top) / rect.height) * 100}%`;
                setGlowPos({ x: glowX, y: glowY });
            }
        };
        
        // Listen only on screen sizes larger than tablet
        const handleResize = () => {
            if (window.innerWidth > 900) {
                window.addEventListener('mousemove', handleMouseMove);
            } else {
                window.removeEventListener('mousemove', handleMouseMove);
                setMousePos({ x: 0, y: 0 }); // reset if mobile
                setGlowPos({ x: '50%', y: '50%' });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // run initial check

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
        const sppgProfiles = school.sppg_profiles ?? [];
        if (sppgProfiles.length > 0 && sppgProfiles[0].id) {
            // Langsung masuk ke profil SPPG
            setAssignedSppgId(sppgProfiles[0].id);
            setKitchenProfileMode("profil");
            setView("profil-dapur");
        } else {
            // SPPG belum tersedia — tampilkan card info
            setSelectedSchool(school);
            setQuery(school.name);
            setIsDropdownOpen(false);
        }
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

    const handleRoleFeatureClick = async (key) => {
        if (loadingSppg) return;
        setLoadingSppg(true);
        try {
            if (role === "siswa") {
                const { data } = await api.get('/siswa/sppg-info');
                if (data.served && data.id) {
                    setAssignedSppgId(data.id);
                    setKitchenProfileMode(key);
                    setView("profil-dapur");
                } else {
                    alert(data.message || 'Sekolah Anda belum terhubung dengan dapur SPPG mana pun.');
                }
            } else if (role === "guru") {
                const { data } = await api.get('/guru/sppg-profile');
                if (data && data.id) {
                    setAssignedSppgId(data.id);
                    setKitchenProfileMode(key);
                    setView("profil-dapur");
                } else {
                    alert('Sekolah Anda belum terhubung dengan dapur SPPG mana pun.');
                }
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal memuat informasi SPPG dapur.');
        } finally {
            setLoadingSppg(false);
        }
    };

    const handleScrollToSearch = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        searchRef.current?.querySelector('input')?.focus();
    };

    const handleFooterNav = (key) => {
        switch (key) {
            case 'profil':
                if (role === 'siswa' || role === 'guru') {
                    handleRoleFeatureClick('profil');
                } else {
                    setKitchenProfileMode('profil');
                    setAssignedSppgId(null);
                    setView('profil-dapur');
                }
                break;
            case 'menu':
                if (role === 'siswa' || role === 'guru') {
                    handleRoleFeatureClick('menu');
                } else {
                    setKitchenProfileMode('menu');
                    setAssignedSppgId(null);
                    setView('profil-dapur');
                }
                break;
            case 'distribusi':
                setView('distribusi');
                break;
            case 'validasi-ai':
                if (token) {
                    navigate('/validasi-ai');
                } else {
                    navigate('/login');
                }
                break;
            case 'ulasan':
                if (!token) {
                    navigate('/login');
                } else if (onNavigate) {
                    onNavigate('ulasan');
                } else {
                    navigate('/login');
                }
                break;
            case 'monitoring':
                setView('distribusi');
                break;
            case 'tentang':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            default:
                break;
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
                {/* Mouse-following radial glow background fade effect */}
                <div 
                    className="plc-hero-glow" 
                    style={{
                        '--glow-x': glowPos.x,
                        '--glow-y': glowPos.y
                    }}
                />

                {/* Parallax floating cards in the background - scattered wider, total 6 cards */}
                {/* Parallax floating cards in the background - scattered wider, total 6 cards, dark/blur/blockchain effect */}
                <div className="plc-hero-bg-cards" aria-hidden="true">
                    {/* Blockchain-like connecting network lines */}
                    <svg className="plc-hero-blockchain-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                        {/* Left side network */}
                        <line x1="13" y1="20" x2="8" y2="50" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.25" strokeDasharray="1 1" />
                        <line x1="8" y1="50" x2="12" y2="75" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.25" strokeDasharray="1 1" />
                        <line x1="13" y1="20" x2="12" y2="75" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.15" />
                        
                        {/* Right side network */}
                        <line x1="87" y1="20" x2="92" y2="54" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.25" strokeDasharray="1 1" />
                        <line x1="92" y1="54" x2="88" y2="73" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.25" strokeDasharray="1 1" />
                        <line x1="87" y1="20" x2="88" y2="73" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.15" />

                        {/* Cross-connections */}
                        <line x1="8" y1="50" x2="25" y2="52" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.15" />
                        <line x1="92" y1="54" x2="75" y2="56" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.15" />
                    </svg>

                    <motion.div 
                        className="plc-bg-card plc-bg-card-1"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 0.8, scale: 0.85 }}
                        transition={{ duration: 1.2, delay: 0.1 }}
                        style={{
                            '--mx': `${mousePos.x * 35}px`,
                            '--my': `${mousePos.y * 35}px`
                        }}
                    >
                        <img src={mbgKitchenPrep} alt="Persiapan Dapur SPPG" />
                    </motion.div>
                    <motion.div 
                        className="plc-bg-card plc-bg-card-2"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 0.8, scale: 0.95 }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        style={{
                            '--mx': `${mousePos.x * 50}px`,
                            '--my': `${mousePos.y * 50}px`
                        }}
                    >
                        <img src={mbgKidsEating} alt="Siswa Makan Sehat" />
                    </motion.div>
                    <motion.div 
                        className="plc-bg-card plc-bg-card-3"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 0.8, scale: 0.9 }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        style={{
                            '--mx': `${mousePos.x * 40}px`,
                            '--my': `${mousePos.y * 40}px`
                        }}
                    >
                        <img src={mbgSocialization} alt="Sosialisasi Program" />
                    </motion.div>
                    <motion.div 
                        className="plc-bg-card plc-bg-card-4"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 0.8, scale: 1.0 }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                        style={{
                            '--mx': `${mousePos.x * 60}px`,
                            '--my': `${mousePos.y * 60}px`
                        }}
                    >
                        <img src={mbgMealBox} alt="Menu Bergizi" />
                    </motion.div>
                    <motion.div 
                        className="plc-bg-card plc-bg-card-5"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 0.7, scale: 0.8 }}
                        transition={{ duration: 1.4, delay: 0.5 }}
                        style={{
                            '--mx': `${mousePos.x * 30}px`,
                            '--my': `${mousePos.y * 30}px`
                        }}
                    >
                        <img src={mbgSocialization} alt="Sosialisasi Program B" />
                    </motion.div>
                    <motion.div 
                        className="plc-bg-card plc-bg-card-6"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 0.7, scale: 0.85 }}
                        transition={{ duration: 1.4, delay: 0.6 }}
                        style={{
                            '--mx': `${mousePos.x * 45}px`,
                            '--my': `${mousePos.y * 45}px`
                        }}
                    >
                        <img src={mbgKidsEating} alt="Siswa Makan Sehat B" />
                    </motion.div>
                </div>

                <div className="plc-hero-inner">
                    <motion.span 
                        className="plc-hero-overline"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 0.8, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
                    >
                        Platform Monitoring MBG
                    </motion.span>

                    <motion.h1 
                        className="plc-hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
                    >
                        Pantau. Pastikan.<br />Transparan.
                    </motion.h1>

                    <motion.p 
                        className="plc-hero-sub"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 0.65, y: 0 }}
                        transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.35 }}
                    >
                        Platform transparan untuk memantau distribusi, menu, dan
                        kualitas program MBG di seluruh Indonesia.
                    </motion.p>

                    {/* Search */}
                    <motion.div 
                        className="plc-search-wrap" 
                        ref={searchRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.5 }}
                    >
                        <div className="plc-search-input-wrap">
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
                                                        <div className="plc-school-item-info">
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
                        </div>

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
                    </motion.div>

                    {/* Stats — animated count-up */}
                    <motion.div 
                        className="plc-stats"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.65 }}
                    >
                        {STATS.map((s) => (
                            <AnimatedStat key={s.label} num={s.num} label={s.label} />
                        ))}
                    </motion.div>
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
                        <path d="M0,60 L0,20 Q360,0 720,20 Q1080,40 1440,20 L1440,60 Z" fill={onNavigate ? "var(--surface-2)" : "var(--surface-1)"} />
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
                        {FEATURES.map(({ key, icon, name, desc, badge }, index) => (
                            <motion.div
                                key={key}
                                className={`plc-feature-card${key === "profil" || key === "distribusi" || key === "menu" || key === "search" ? " plc-feature-card--link" : ""}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, margin: "-100px" }}
                                transition={{ type: "spring", stiffness: 60, damping: 15, delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.015, transition: { type: "spring", stiffness: 300, damping: 15 } }}
                                onClick={() => {
                                    if (key === "search") {
                                        handleScrollToSearch();
                                    } else if ((role === "siswa" || role === "guru") && (key === "menu" || key === "distribusi" || key === "profil")) {
                                        handleRoleFeatureClick(key);
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
                                role={key === "profil" || key === "distribusi" || key === "menu" || key === "search" ? "button" : undefined}
                                tabIndex={key === "profil" || key === "distribusi" || key === "menu" || key === "search" ? 0 : undefined}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (key === "search") {
                                            handleScrollToSearch();
                                        } else if ((role === "siswa" || role === "guru") && (key === "menu" || key === "distribusi" || key === "profil")) {
                                            handleRoleFeatureClick(key);
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
                                {key === "search" && (
                                    <span className="plc-feature-cta">
                                        Cari sekarang →
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WORKFLOW / ALUR KERJA SECTION ────────────────────── */}
            <section className="plc-workflow">
                <div className="plc-workflow-inner">
                    <span className="plc-section-eyebrow">Alur Transparansi</span>
                    <h2 className="plc-workflow-title">Bagaimana Kami Memantau Program MBG?</h2>
                    <p className="plc-workflow-sub">
                        Empat tahap pemantauan untuk memastikan setiap anak menerima makanan yang bergizi, higienis, dan tepat waktu secara transparan.
                    </p>

                    <div className="plc-workflow-steps">
                        <div className="plc-workflow-line" />
                        
                        {[
                            {
                                num: "01",
                                title: "Penyusunan Menu Gizi",
                                desc: "Dapur SPPG merancang menu makanan mingguan dengan takaran nutrisi yang seimbang, disesuaikan untuk kebutuhan energi anak.",
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                                        <path d="M9 6h7M9 10h7M9 14h7" />
                                    </svg>
                                )
                            },
                            {
                                num: "02",
                                title: "Verifikasi AI Terbuka",
                                desc: "Makanan yang dimasak diambil fotonya dan diunggah ke sistem. Algoritma AI menganalisis jenis lauk, berat, serta kalori makanan secara real-time.",
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                )
                            },
                            {
                                num: "03",
                                title: "Pelacakan Pengiriman",
                                desc: "Kurir mengaktifkan lokasi GPS saat mengantar kotak makanan dari dapur ke sekolah tujuan, menjamin makanan tiba sebelum jam istirahat.",
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="1" y="3" width="15" height="13" />
                                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                        <circle cx="5.5" cy="18.5" r="2.5" />
                                        <circle cx="18.5" cy="18.5" r="2.5" />
                                    </svg>
                                )
                            },
                            {
                                num: "04",
                                title: "Rating & Ulasan Masukan",
                                desc: "Guru dan perwakilan siswa melakukan pemindaian barcode penerimaan, lalu memberikan bintang rating serta ulasan kualitas rasa masakan.",
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                )
                            }
                        ].map((step, idx) => (
                            <motion.div 
                                key={idx} 
                                className="plc-workflow-card"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, margin: "-50px" }}
                                transition={{ type: "spring", stiffness: 60, damping: 15, delay: idx * 0.15 }}
                                whileHover={{ y: -6, scale: 1.015, transition: { type: "spring", stiffness: 300, damping: 15 } }}
                            >
                                <div className="plc-workflow-num">{step.num}</div>
                                <div className="plc-workflow-icon-box">{step.icon}</div>
                                <h3 className="plc-workflow-card-title">{step.title}</h3>
                                <p className="plc-workflow-card-desc">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ SECTION ──────────────────────────────────────── */}
            <section className="plc-faq">
                <div className="plc-faq-inner">
                    <span className="plc-section-eyebrow">Tanya Jawab</span>
                    <h2 className="plc-faq-title">Pertanyaan yang Sering Diajukan</h2>
                    
                    <div className="plc-faq-list">
                        <FAQItem 
                            question="Apa itu platform HaloMBG?" 
                            answer="HaloMBG adalah platform pengawasan independen untuk memantau kualitas makanan, porsi nutrisi, kepatuhan jadwal, dan transparansi distribusi program Makan Bergizi Gratis (MBG) yang didanai pemerintah." 
                        />
                        <FAQItem 
                            question="Bagaimana cara kerja validasi gizi menggunakan AI?" 
                            answer="Petugas dapur SPPG memfoto makanan sebelum dikirim. Sistem kecerdasan buatan (AI) kami akan menganalisis foto tersebut untuk mendeteksi kandungan kelompok makanan (karbohidrat, lauk pauk, sayuran, susu) dan memberikan estimasi porsi gizi secara otomatis." 
                        />
                        <FAQItem 
                            question="Apakah masyarakat umum bisa memantau?" 
                            answer="Ya, platform ini bersifat terbuka. Masyarakat dapat mencari sekolah mereka di halaman beranda untuk melihat profil dapur SPPG yang melayani, menu harian, status pengiriman hari ini, dan ulasan dari guru/siswa." 
                        />
                        <FAQItem 
                            question="Bagaimana ulasan dari sekolah dikumpulkan?" 
                            answer="Guru dan perwakilan siswa memiliki akun khusus untuk memindai penerimaan makanan, mengisi form ulasan rasa, porsi, kebersihan, dan melampirkan foto jika ada keluhan kualitas." 
                        />
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────── */}
            <footer className="plc-footer">
                <div className="plc-footer-inner">
                    {/* Row 1: CTA + Nav columns */}
                    <div className="plc-footer-top">
                        <div className="plc-footer-tagline-container">
                            <div className="plc-footer-logo-wrap">
                                <Logo size={32} />
                                <span>HaloMBG</span>
                            </div>
                            <p className="plc-footer-tagline">
                                Transparansi untuk masa depan gizi Indonesia
                            </p>
                        </div>
                        <nav className="plc-footer-nav">
                            <div className="plc-footer-nav-col">
                                <h4>Platform</h4>
                                <button onClick={() => handleFooterNav('profil')}>Profil Dapur</button>
                                <button onClick={() => handleFooterNav('menu')}>Menu Harian</button>
                                <button onClick={() => handleFooterNav('distribusi')}>Status Distribusi</button>
                                <button onClick={() => handleFooterNav('validasi-ai')}>Validasi Gizi AI</button>
                            </div>
                            <div className="plc-footer-nav-col">
                                <h4>Program</h4>
                                <button onClick={() => handleFooterNav('ulasan')}>Ulasan Siswa</button>
                                <button onClick={() => handleFooterNav('monitoring')}>Monitoring</button>
                                <button onClick={() => handleFooterNav('tentang')}>Tentang MBG</button>
                            </div>
                        </nav>
                    </div>

                    {/* Row 2: Oversized brand wordmark */}
                    <div className="plc-footer-brand-display" aria-hidden="true">
                        HaloMBG
                    </div>

                    {/* Row 3: Bottom bar */}
                    <div className="plc-footer-bottom">
                        <p className="plc-footer-copy">© 2026 HaloMBG. Semua Hak Dilindungi.</p>
                        <div className="plc-footer-legal">
                            <button onClick={() => handleFooterNav('kebijakan')}>Kebijakan Privasi</button>
                            <button onClick={() => handleFooterNav('syarat')}>Syarat Layanan</button>
                            <button onClick={() => handleFooterNav('open-data')}>Open Data</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}