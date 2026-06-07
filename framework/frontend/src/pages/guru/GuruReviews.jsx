import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import "../../pages/admin/admin.css";

function PhotoViewerModal({ photoUrl, onClose }) {
  return (
    <div
      className="adm-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="adm-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px", padding: 0, overflow: "hidden", position: "relative" }}
      >
        <img src={photoUrl} alt="Bukti Makanan" style={{ width: "100%", height: "auto", display: "block" }} />
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default function GuruReviews() {
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const loadReviews = useCallback(async (pg = 1) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/guru/reviews", {
        params: { page: pg },
      });
      setReviews(data.data || []);
      setMeta(data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat ulasan siswa.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews(page);
  }, [page, loadReviews]);

  const handleToggleFlag = async (review) => {
    const isCurrentlyFlagged = review.flag_status === "flagged";
    const nextStatus = isCurrentlyFlagged ? "none" : "flagged";
    
    setActioningId(review.id);
    try {
      const { data } = await api.post(`/guru/reviews/${review.id}/flag`, {
        flag_status: nextStatus,
        flag_reason: nextStatus === "flagged" ? "Ditandai oleh Guru Sekolah" : null
      });
      
      // Update state
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, flag_status: nextStatus } : r))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengubah tanda ulasan.");
    } finally {
      setActioningId(null);
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p className="adm-loading">Memuat ulasan siswa...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem 0" }}>
      <div className="adm-section-header" style={{ marginBottom: "20px" }}>
        <h2>Moderasi Ulasan Siswa</h2>
        <p style={{ fontSize: "0.875rem", opacity: 0.7, marginTop: "4px" }}>
          Pantau ulasan dari siswa dan beri tanda (flag) pada ulasan yang kurang sesuai atau melanggar aturan.
        </p>
      </div>

      {error && <p className="adm-error-msg" style={{ marginBottom: "16px" }}>{error}</p>}

      {reviews.length === 0 ? (
        <div
          style={{
            padding: "3rem 2rem",
            textAlign: "center",
            border: "1px solid var(--border-default)",
            borderRadius: "12px",
            background: "var(--surface)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>💬</div>
          <h3 style={{ margin: "0 0 8px", fontWeight: 600 }}>Belum Ada Ulasan</h3>
          <p style={{ opacity: 0.6, fontSize: "0.875rem", margin: 0 }}>
            Belum ada ulasan yang dikirimkan oleh siswa dari sekolah Anda untuk dapur ini.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid var(--border-default, #e5e7eb)",
                borderRadius: "12px",
                padding: "16px 20px",
                background: "var(--surface, #fff)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    {review.user?.name ?? "Siswa"}
                  </span>
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "0.75rem",
                      background: "var(--surface-2, #f3f4f6)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {review.school?.name ?? "—"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                    {review.review_date}
                  </span>
                  {review.flag_status === "flagged" && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#d97706",
                        background: "#fef3c7",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontWeight: 600,
                      }}
                    >
                      ⚑ Ditandai
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                      color: "var(--text-primary)",
                    }}
                  >
                    {review.content}
                  </p>
                </div>
                {review.photo && (
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(review.photo)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={review.photo}
                      alt="Ulasan Makanan"
                      style={{
                        width: "80px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid var(--border-default)",
                      }}
                    />
                  </button>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  borderTop: "1px solid var(--border-default, #f3f4f6)",
                  paddingTop: "12px",
                  marginTop: "4px",
                }}
              >
                <button
                  type="button"
                  className={`adm-btn ${review.flag_status === "flagged" ? "danger" : ""}`}
                  disabled={actioningId === review.id}
                  onClick={() => handleToggleFlag(review)}
                  style={{
                    fontSize: "0.8rem",
                    height: "32px",
                    padding: "0 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill={review.flag_status === "flagged" ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
                  </svg>
                  {review.flag_status === "flagged" ? "Hapus Tanda" : "Tandai Ulasan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "24px",
          }}
        >
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1 || loading}
            className="lkp-page-btn"
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border-default)",
              cursor: "pointer",
              background: "var(--surface)",
            }}
          >
            ←
          </button>
          <span style={{ fontSize: "0.875rem", opacity: 0.7 }}>
            {meta.current_page} / {meta.last_page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === meta.last_page || loading}
            className="lkp-page-btn"
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border-default)",
              cursor: "pointer",
              background: "var(--surface)",
            }}
          >
            →
          </button>
        </div>
      )}

      {selectedPhoto && (
        <PhotoViewerModal photoUrl={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
    </div>
  );
}
