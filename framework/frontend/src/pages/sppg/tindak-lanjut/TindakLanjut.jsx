import { useState, useEffect, useCallback } from "react";
import api from "../../../api/axios";
import "../../admin/admin.css";

const IconShieldLarge = () => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

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
        zIndex: 1100,
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

function FollowupModal({ followup, onClose, onSaved }) {
  const [status, setStatus] = useState(followup.followup_status);
  const [note, setNote] = useState(followup.handling_note || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.put(`/sppg/followups/${followup.id}`, {
        followup_status: status,
        handling_note: note,
      });
      onSaved(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui status tindak lanjut.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (st) => {
    switch (st) {
      case "belum_diproses":
        return "Belum Diproses";
      case "dalam_proses":
        return "Dalam Proses";
      case "selesai":
        return "Selesai";
      default:
        return st;
    }
  };

  return (
    <div className="adm-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="adm-modal wide" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh", width: "580px" }}>
        <div className="adm-modal-header">
          <h3>Tindak Lanjut Ulasan Kritis</h3>
          <button className="adm-modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="adm-modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
          {error && <p className="adm-error-msg">{error}</p>}

          {/* Info Ulasan */}
          <div style={{ background: "var(--surface-2, #f9fafb)", padding: "14px 18px", borderRadius: "8px", border: "1px solid var(--border-default)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                {followup.review?.user?.name ?? "Siswa"} ({followup.review?.school?.name ?? "Sekolah"})
              </span>
              <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                {followup.review?.review_date}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-primary)", fontStyle: "italic" }}>
              "{followup.review?.content}"
            </p>
            {followup.review?.photo && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={followup.review.photo}
                  alt="Bukti Makanan"
                  style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border-default)" }}
                />
              </div>
            )}
          </div>

          {/* Timeline Riwayat */}
          <div>
            <h4 style={{ margin: "0 0 10px", fontSize: "0.85rem", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.5px" }}>
              Riwayat Perubahan Status (Audit Log)
            </h4>
            {(!followup.histories || followup.histories.length === 0) ? (
              <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>Belum ada riwayat perubahan status.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "2px solid var(--border-default)", paddingLeft: "14px", marginLeft: "6px" }}>
                {followup.histories.map((hist) => {
                  const histDate = new Date(hist.changed_at).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  });
                  return (
                    <div key={hist.id} style={{ position: "relative", fontSize: "0.85rem" }}>
                      {/* bullet dot */}
                      <div style={{
                        position: "absolute",
                        left: "-21px",
                        top: "4px",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "var(--color-primary)",
                      }} />
                      <div style={{ fontWeight: 500 }}>
                        {getStatusText(hist.previous_status)} &rarr; {getStatusText(hist.new_status)}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                        Oleh: {hist.changer?.name ?? "Sistem"} | {histDate}
                      </div>
                      {hist.note && (
                        <div style={{ background: "var(--surface-2)", padding: "6px 10px", borderRadius: "4px", marginTop: "4px", fontStyle: "italic", fontSize: "0.8rem" }}>
                          Catatan: "{hist.note}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <hr style={{ border: 0, borderTop: "1px solid var(--border-default)", margin: "8px 0" }} />

          {/* Form Update */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label className="adm-label">Perbarui Status</label>
              <select
                className="adm-filter-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="belum_diproses">Belum Diproses</option>
                <option value="dalam_proses">Dalam Proses Tindak Lanjut</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>

            <div>
              <label className="adm-label">Catatan Penanganan / Tindak Lanjut</label>
              <textarea
                className="adm-textarea"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Masukkan rincian tindakan investigasi atau perbaikan yang dilakukan..."
                required
              />
            </div>
          </div>

          <div className="adm-modal-footer" style={{ padding: "12px 0 0" }}>
            <button type="button" className="adm-btn" onClick={onClose} disabled={loading}>
              Batal
            </button>
            <button type="submit" className="adm-btn primary" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TindakLanjut() {
  const [followups, setFollowups] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedFollowup, setSelectedFollowup] = useState(null);

  const loadFollowups = useCallback(async (pg = 1, filter = "") => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/sppg/followups", {
        params: { page: pg, status: filter || undefined },
      });
      setFollowups(data.data || []);
      setMeta(data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat daftar tindak lanjut.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFollowups(page, statusFilter);
  }, [page, statusFilter, loadFollowups]);

  const handleSaved = (updated) => {
    setFollowups((prev) =>
      prev.map((f) => (f.id === updated.id ? updated : f))
    );
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "belum_diproses":
        return { color: "#C62828", background: "#FFEBEE" };
      case "dalam_proses":
        return { color: "#1565C0", background: "#E3F2FD" };
      case "selesai":
        return { color: "#2E7D32", background: "#E8F5E9" };
      default:
        return { color: "var(--text-secondary)", background: "var(--surface-3)" };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "belum_diproses":
        return "Belum Diproses";
      case "dalam_proses":
        return "Dalam Proses";
      case "selesai":
        return "Selesai";
      default:
        return status;
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1.5rem 0" }}>
      <div className="adm-section-header" style={{ marginBottom: "20px" }}>
        <div>
          <h2>Tindak Lanjut Ulasan Kritis</h2>
          <p style={{ fontSize: "0.875rem", opacity: 0.7, marginTop: "4px" }}>
            Kelola tanggapan, investigasi, dan laporan penyelesaian untuk ulasan kritis siswa.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="adm-filters" style={{ marginBottom: "20px" }}>
        <select
          className="adm-filter-select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{ minWidth: "180px" }}
        >
          <option value="">Semua Status</option>
          <option value="belum_diproses">Belum Diproses</option>
          <option value="dalam_proses">Dalam Proses</option>
          <option value="selesai">Selesai</option>
        </select>
      </div>

      {error && <p className="adm-error-msg" style={{ marginBottom: "16px" }}>{error}</p>}

      {loading && followups.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p className="adm-loading">Memuat daftar tindak lanjut...</p>
        </div>
      ) : followups.length === 0 ? (
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
            <IconShieldLarge />
          </div>
          <h3 style={{ margin: "0 0 8px", fontWeight: 600, color: "var(--text-primary)" }}>Bersih dari Keluhan Kritis</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: 0 }}>
            Tidak ada ulasan kritis dari siswa yang memerlukan penanganan saat ini.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {followups.map((f) => (
            <div
              key={f.id}
              style={{
                border: "1px solid var(--border-default)",
                borderRadius: "6px",
                padding: "18px 22px",
                background: "var(--surface-1)",
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
                    {f.review?.user?.name ?? "Siswa"}
                  </span>
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "11px",
                      background: "var(--surface-2)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      color: "var(--text-secondary)",
                      fontWeight: 500,
                    }}
                  >
                    {f.review?.school?.name ?? "—"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                    {f.review?.review_date}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontWeight: 500,
                      ...getStatusBadgeStyle(f.followup_status),
                    }}
                  >
                    {getStatusLabel(f.followup_status)}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                      color: "var(--text-primary)",
                      fontWeight: 500,
                    }}
                  >
                    "{f.review?.content}"
                  </p>
                  {f.handling_note && (
                    <div style={{ marginTop: "10px", padding: "10px 14px", background: "var(--surface-2)", borderRadius: "6px", borderLeft: "3px solid var(--color-primary)", fontSize: "0.85rem" }}>
                      <span style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>Catatan Penanganan:</span>
                      "{f.handling_note}"
                    </div>
                  )}
                </div>
                {f.review?.photo && (
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(f.review.photo)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={f.review.photo}
                      alt="Ulasan Makanan"
                      style={{
                        width: "90px",
                        height: "68px",
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
                  className="adm-btn primary"
                  onClick={() => setSelectedFollowup(f)}
                  style={{
                    fontSize: "0.8rem",
                    height: "32px",
                    padding: "0 14px",
                  }}
                >
                  Tindak Lanjut & Detail
                </button>
              </div>
            </div>
          ))}
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

      {selectedPhoto && (
        <PhotoViewerModal photoUrl={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}

      {selectedFollowup && (
        <FollowupModal
          followup={selectedFollowup}
          onClose={() => setSelectedFollowup(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
