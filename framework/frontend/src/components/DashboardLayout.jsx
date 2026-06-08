import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './DashboardLayout.css';

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
    if (role !== 'sppg') return;
    
    let isMounted = true;
    const fetchUnreadCount = async () => {
      try {
        const { data } = await api.get('/sppg/notifications');
        if (!isMounted) return;
        const unread = (data.data || []).filter(n => !n.is_read).length;
        setUnreadCount(unread);
      } catch (err) {
        // Ignore
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000);

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
        <span className="dl-topbar-brand">HaloMBG</span>
        <div className="dl-topbar-right">
          {(role === 'sppg' || role === 'guru') && (
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
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
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
            {children(activeMenu, setActiveMenu)}
          </main>
        </div>
      ) : (
        /* Non-sidebar layout — back button di topbar, atau isHome full-width */
        <main className={`dl-content${isHome ? ' dl-content-home' : ''}`}>
          {children(activeMenu, setActiveMenu)}
        </main>
      )}
    </div>
  );
}
