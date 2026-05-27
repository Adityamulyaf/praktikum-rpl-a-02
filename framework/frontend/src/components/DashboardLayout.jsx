import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

/**
 * Shared dashboard shell untuk semua role.
 *
 * Props:
 *   menuGroups – array of { label?: string, items: { key, label, icon }[] }
 *   children   – render prop: (activeMenu: string) => ReactNode
 *   pageClass  – optional string ditambahkan ke #root element
 */
export default function DashboardLayout({ menuGroups, children, pageClass }) {
  const firstKey = menuGroups?.[0]?.items?.[0]?.key ?? '';
  const [activeMenu, setActiveMenu] = useState(firstKey);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleNav = (key) => {
    setActiveMenu(key);
    setSidebarOpen(false);
  };

  const isHome = activeMenu === firstKey;

  return (
    <div className="dl-root">
      {/* Top bar — always visible */}
      <header className="dl-topbar">
        <button
          className="dl-hamburger"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
        <span className="dl-topbar-brand">HaloMBG</span>
        <div className="dl-topbar-right">
          <span className="dl-topbar-username">{user?.name}</span>
          <button className="dl-topbar-logout" onClick={handleLogout}>Keluar</button>
        </div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="dl-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Drawer sidebar */}
      <aside className={`dl-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="dl-sidebar-head">
          <span className="dl-brand">Menu</span>
          <button className="dl-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Tutup menu">✕</button>
        </div>
        <nav className="dl-nav">
          {menuGroups.map((group, gi) => (
            <div key={gi}>
              {gi > 0 && <div className="dl-nav-divider" />}
              {group.label && (
                <span className="dl-nav-group-label">{group.label}</span>
              )}
              {group.items.map(({ key, label, icon }) => (
                <button
                  key={key}
                  className={`dl-nav-item${activeMenu === key ? ' active' : ''}`}
                  onClick={() => handleNav(key)}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="dl-sidebar-footer">
          <div className="dl-user-info">
            <span className="dl-user-name">{user?.name}</span>
            <span className="dl-user-role">{user?.role}</span>
          </div>
          <button className="dl-logout" onClick={handleLogout}>Keluar</button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`dl-content${isHome ? ' dl-content-home' : ''}`}>
        {children(activeMenu)}
      </main>
    </div>
  );
}
