import { useState, useEffect, useCallback } from "react";
import api from "../../../api/axios";
import "../../admin/admin.css";

const IconBellLarge = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--text-tertiary)"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

export default function NotifikasiList({ onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);

  const loadNotifications = useCallback(async (pg = 1) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/notifications", {
        params: { page: pg },
      });
      setNotifications(data.data || []);
      setMeta(data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat notifikasi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(page);
  }, [page, loadNotifications]);

  const handleMarkAsRead = async (id) => {
    setActioningId(id);
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menandai notifikasi dibaca.");
    } finally {
      setActioningId(null);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) return;
    
    setLoading(true);
    try {
      await api.post("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      alert("Gagal menandai semua notifikasi.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p className="adm-loading">Memuat notifikasi...</p>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem 0" }}>
      <div className="adm-section-header" style={{ marginBottom: "20px" }}>
        <div>
          <h2>Notifikasi</h2>
          <p style={{ fontSize: "0.875rem", opacity: 0.7, marginTop: "4px" }}>
            Pemberitahuan aktivitas penting dari ulasan siswa dan distribusi makanan.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            className="adm-btn"
            onClick={handleMarkAllRead}
            style={{ fontSize: "0.8rem", height: "36px" }}
          >
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {error && <p className="adm-error-msg" style={{ marginBottom: "16px" }}>{error}</p>}

      {notifications.length === 0 ? (
        <div
          style={{
            padding: "3rem 2rem",
            textAlign: "center",
            border: "1px solid var(--border-default)",
            borderRadius: "6px",
            background: "var(--surface-2)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <IconBellLarge />
          </div>
          <h3 style={{ margin: "0 0 8px", fontWeight: 600, color: "var(--text-primary)" }}>Tidak Ada Notifikasi</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: 0 }}>
            Semua notifikasi baru telah dibaca atau belum ada notifikasi masuk.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {notifications.map((notification) => {
            const formattedDate = new Date(notification.created_at).toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            });
            return (
              <div
                key={notification.id}
                style={{
                  border: "1px solid var(--border-default)",
                  borderRadius: "6px",
                  padding: "16px 20px",
                  background: notification.read
                    ? "var(--surface-1)"
                    : "rgba(7, 30, 73, 0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  borderLeft: notification.read
                    ? "1px solid var(--border-default)"
                    : "4px solid var(--color-primary)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        background: notification.type === "review_critical" ? "#FFEBEE" : "#F0EEEB",
                        color: notification.type === "review_critical" ? "#C62828" : "#5C5B57",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontWeight: 500,
                      }}
                    >
                      {notification.type === "review_critical" ? "Ulasan Kritis" : "Notifikasi"}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)", opacity: 0.8 }}>
                      {formattedDate}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                    {notification.body}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    type="button"
                    className="adm-btn primary"
                    onClick={() => onNavigate?.("tindak_lanjut")}
                    style={{ fontSize: "0.75rem", height: "30px", padding: "0 10px" }}
                  >
                    Tindak Lanjut
                  </button>
                  {!notification.read && (
                    <button
                      type="button"
                      className="adm-btn success"
                      disabled={actioningId === notification.id}
                      onClick={() => handleMarkAsRead(notification.id)}
                      style={{ fontSize: "0.75rem", height: "30px", padding: "0 10px" }}
                    >
                      Tandai Dibaca
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="adm-pagination">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1 || loading}
            className="adm-btn"
            style={{ padding: "6px 12px" }}
          >
            ←
          </button>
          <span className="adm-page-info">
            {meta.current_page} / {meta.last_page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === meta.last_page || loading}
            className="adm-btn"
            style={{ padding: "6px 12px" }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
