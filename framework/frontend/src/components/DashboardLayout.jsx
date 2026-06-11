import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUnreadCount } from '../api/notification';
import Logo from './Logo';
import './DashboardLayout.css';

// Import Framer Motion for unified page transition animations
import { motion, AnimatePresence } from 'framer-motion';


/**
 * Shared dashboard shell untuk semua role.
 *
 * Props:
 *   menuGroups – array of { label?: string, items: { key, label, icon }[] }
 *   children   – render prop: (activeMenu: string) => ReactNode
 *   pageClass  – optional string ditambahkan ke #root element
 */
export default function DashboardLayout({ menuGroups, children, pageClass, hasSidebar = false }) {
  const firstKey = menuGroups?.[0]?.items?.[0]?.key ?? '';
  const [activeMenu, setActiveMenu] = useState(firstKey);
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const topbarRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!role) return;
    
    let isMounted = true;
    const fetchCount = async () => {
      try {
        const { data } = await getUnreadCount();
        if (!isMounted) return;
        setUnreadCount(data.unread_count || 0);
      } catch (err) {
        // Ignore
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [role]);

  useEffect(() => {
    if (!pageClass) return;
    const root = document.getElementById('root');
    root.classList.add(pageClass);
    return () => root.classList.remove(pageClass);
  }, [pageClass]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Scroll-based topbar: full-width → floating rounded
  useEffect(() => {
    const handleScroll = () => {
      if (!topbarRef.current) return;
      if (window.scrollY > 80) {
        topbarRef.current.classList.add('dl-topbar--scrolled');
      } else {
        topbarRef.current.classList.remove('dl-topbar--scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = activeMenu === firstKey;
  const showSidebar = hasSidebar && !isHome;

  return (
    <div className="dl-root">
      {/* Top bar — always visible, scroll-to-rounded */}
      <header className="dl-topbar" ref={topbarRef}>
        {!isHome && !hasSidebar && (
          <button
            className="dl-back-btn"
            aria-label="Kembali ke Beranda"
            onClick={() => setActiveMenu(firstKey)}
          >
            ← Beranda
          </button>
        )}
        <span className="dl-topbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo size={28} />
          <span>HaloMBG</span>
        </span>
        <div className="dl-topbar-right">
          {role && (
            <button
              className={`dl-topbar-notif-btn${activeMenu === 'notif' ? ' dl-topbar-notif-btn--active' : ''}`}
              onClick={() => setActiveMenu('notif')}
              title="Notifikasi"
              aria-label="Notifikasi"
              style={{ marginRight: '8px' }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22zm7-6v-6a7 7 0 0 0-14 0v6l-2 2h18l-2-2z" />
              </svg>
              {unreadCount > 0 && <span className="dl-topbar-notif-badge">{unreadCount}</span>}
            </button>
          )}
          <span className="dl-topbar-username">{user?.name}</span>
          <button className="dl-topbar-logout" onClick={handleLogout}>Keluar</button>
        </div>
      </header>


      {/* Sidebar layout (admin) — hanya saat hasSidebar && !isHome */}
      {showSidebar ? (
        <div className="dl-body">
          <aside className="dl-sidebar">
            {menuGroups.map((group, gi) => (
              <div key={gi} className="dl-nav-group">
                {group.label && (
                  <span className="dl-nav-group-label">{group.label}</span>
                )}
                {group.items.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    type="button"
                    className={`dl-nav-item${activeMenu === key ? ' dl-nav-item--active' : ''}`}
                    onClick={() => setActiveMenu(key)}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            ))}
          </aside>

          <main className="dl-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMenu}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {children(activeMenu, setActiveMenu)}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      ) : (
        /* Non-sidebar layout — back button di topbar, atau isHome full-width */
        <main className={`dl-content${isHome ? ' dl-content-home' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              {children(activeMenu, setActiveMenu)}
            </motion.div>
          </AnimatePresence>
        </main>
      )}
    </div>
  );
}
