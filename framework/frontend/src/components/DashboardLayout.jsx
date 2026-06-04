import { useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Set the dashboard-page class on root element
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.classList.add('dashboard-page');
    }
    return () => {
      if (root) {
        root.classList.remove('dashboard-page');
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Determine current page for breadcrumbs
  const getBreadcrumbName = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard Utama';
      case '/validasi-ai':
        return 'Validasi Kelayakan Nutrisi (AI)';
      case '/admin':
        return 'Panel Admin';
      default:
        return 'HaloMBG';
    }
  };

  // Nav items based on role
  const getNavItems = () => {
    const defaultItems = [
      { path: '/dashboard', label: 'Overview', icon: <DashboardIcon /> },
      { path: '/validasi-ai', label: 'Validasi AI', icon: <ScanIcon /> },
    ];

    if (user?.role === 'admin') {
      return [
        ...defaultItems,
        { path: '/admin', label: 'Admin Panel', icon: <AdminIcon /> },
      ];
    }

    return defaultItems;
  };

  return (
    <div className="dbl-container">
      {/* Sidebar */}
      <aside className="dbl-sidebar">
        <div className="dbl-logo-area">
          <span className="dbl-logo-text">HaloMBG</span>
        </div>

        <div className="dbl-nav-sections">
          <div className="dbl-nav-group">
            <span className="dbl-nav-group-label">Menu Utama</span>
            {getNavItems().map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `dbl-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="dbl-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="dbl-nav-group">
            <span className="dbl-nav-group-label">Layanan</span>
            <div className="dbl-nav-item" onClick={() => alert('Fitur ini akan segera hadir pada rilis berikutnya.')}>
              <span className="dbl-nav-icon"><MenuIcon /></span>
              <span>Menu Harian</span>
            </div>
            <div className="dbl-nav-item" onClick={() => alert('Fitur ini akan segera hadir pada rilis berikutnya.')}>
              <span className="dbl-nav-icon"><ReportIcon /></span>
              <span>Laporan Distribusi</span>
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="dbl-sidebar-footer">
          <div className="dbl-user-profile">
            <div className="dbl-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="dbl-user-info">
              <span className="dbl-user-name">{user?.name || 'User'}</span>
              <span className="dbl-user-role">{user?.role || 'Guest'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="dbl-main">
        {/* Topbar */}
        <header className="dbl-topbar">
          <div className="dbl-breadcrumb">
            HaloMBG / <span className="dbl-breadcrumb-active">{getBreadcrumbName(location.pathname)}</span>
          </div>

          <div className="dbl-topbar-actions">
            <span className={`dbl-role-badge dbl-role-${user?.role || 'guest'}`}>
              {user?.role === 'sppg' ? 'SPPG (Dapur)' : user?.role || 'User'}
            </span>
            <button className="dbl-logout-btn" onClick={handleLogout}>
              <LogoutIcon />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* Content View */}
        <div className="dbl-content-wrapper">
          <div className="dbl-content">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

// ── SVG INLINE ICONS ──────────────────────────────────────

function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M5 21H3a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
      <path d="M12 7v10" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18" />
      <path d="M3 6h18" />
      <path d="M3 18h18" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
