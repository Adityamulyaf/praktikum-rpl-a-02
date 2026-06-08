import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconBell } from './Icons';
import { getNotifications, getUnreadCount, markAsRead, markAllRead } from '../api/notification';
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const topbarRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins}m lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}j lalu`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}h lalu`;
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data.unread_count);
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (isNotifOpen) {
      fetchNotifications();
    }
  }, [isNotifOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notif) => {
    if (notif.read) return;
    try {
      await markAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };


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
          <div className="dl-notif-container" ref={notifRef}>
            <button
              className="dl-notif-bell"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label="Notifikasi"
            >
              <IconBell />
              {unreadCount > 0 && <span className="dl-notif-badge">{unreadCount}</span>}
            </button>

            {isNotifOpen && (
              <div className="dl-notif-dropdown">
                <div className="dl-notif-header">
                  <h3>Notifikasi</h3>
                  {unreadCount > 0 && (
                    <button className="dl-notif-mark-all" onClick={handleMarkAllRead}>
                      Tandai semua dibaca
                    </button>
                  )}
                </div>

                <div className="dl-notif-list">
                  {notifications.length === 0 ? (
                    <div className="dl-notif-empty">Tidak ada notifikasi</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`dl-notif-item${!notif.read ? ' dl-notif-item--unread' : ''}`}
                        onClick={() => handleMarkAsRead(notif)}
                      >
                        <div className="dl-notif-item-title">{notif.title}</div>
                        <div className="dl-notif-item-body">{notif.body}</div>
                        <div className="dl-notif-item-time">{formatTime(notif.created_at)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
