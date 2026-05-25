import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SppgTable from './admin/SppgTable';
import SchoolTable from './admin/SchoolTable';
import './AdminDashboard.css';

const MENU_ITEMS = [
  { key: 'sppg',    label: 'SPPG' },
  { key: 'sekolah', label: 'Sekolah' },
];

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu]   = useState('sppg');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.getElementById('root');
    root.classList.add('admin-page');
    return () => root.classList.remove('admin-page');
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNav = (key) => {
    setActiveMenu(key);
    setSidebarOpen(false);
  };

  return (
    <div className="ad-root">
      {/* mobile top bar */}
      <header className="ad-topbar">
        <button className="ad-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
          <span /><span /><span />
        </button>
        <span className="ad-topbar-brand">HaloMBG</span>
      </header>

      {/* overlay — tutup sidebar saat klik di luar */}
      {sidebarOpen && (
        <div className="ad-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`ad-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="ad-brand">HaloMBG</div>
        <nav className="ad-nav">
          {MENU_ITEMS.map(({ key, label }) => (
            <button
              key={key}
              className={`ad-nav-item${activeMenu === key ? ' active' : ''}`}
              onClick={() => handleNav(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="ad-sidebar-footer">
          <span className="ad-user-name">{user?.name}</span>
          <button className="ad-logout" onClick={handleLogout}>Keluar</button>
        </div>
      </aside>

      <main className="ad-content">
        {activeMenu === 'sppg'    && <SppgTable />}
        {activeMenu === 'sekolah' && <SchoolTable />}
      </main>
    </div>
  );
}