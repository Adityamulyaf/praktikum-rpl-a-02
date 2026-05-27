import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

/**
 * Shared dashboard shell untuk semua role (SPPG, Siswa, Guru).
 *
 * Props:
 *   menuItems  – array of { key: string, label: string, icon: ReactNode }
 *   children   – render prop: (activeMenu: string) => ReactNode
 *   pageClass  – optional string ditambahkan ke #root element
 */
export default function DashboardLayout({ menuItems, children, pageClass }) {
  const [activeMenu, setActiveMenu] = useState(menuItems[0]?.key ?? '');
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
    navigate('/login');
  };

  const handleNav = (key) => {
    setActiveMenu(key);
    setSidebarOpen(false);
  };

  return (
    <div className="dl-root">
      {/* Mobile top bar */}
      <header className="dl-topbar">
        <button
          className="dl-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Buka menu"
        >
          <span /><span /><span />
        </button>
        <span className="dl-topbar-brand">HaloMBG</span>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="dl-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`dl-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="dl-brand">HaloMBG</div>
        <nav className="dl-nav">
          {menuItems.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`dl-nav-item${activeMenu === key ? ' active' : ''}`}
              onClick={() => handleNav(key)}
            >
              {icon}
              {label}
            </button>
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
      <main className="dl-content">
        {children(activeMenu)}
      </main>
    </div>
  );
}
