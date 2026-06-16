import { useState, useEffect } from "react";
import api from "../../api/axios";

const STATUS_LABELS = {
  belum_diantar: "Belum Diantar",
  siap_diantar: "Siap Diantar",
  sudah_diantar: "Sudah Diantar",
  batal: "Batal",
};

const STATUS_COLOR = {
  belum_diantar: "#6b7280",
  siap_diantar: "#2563eb",
  sudah_diantar: "#16a34a",
  batal: "#dc2626",
};

function PhotoViewerModal({ photoUrl, onClose }) {
  return (
    <div className="adm-overlay" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: 0, overflow: 'hidden', position: 'relative' }}>
        <img src={photoUrl} alt="Bukti pengiriman" style={{ width: '100%', height: 'auto', display: 'block' }} />
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default function MonitoringStatusDistribusi() {
  const [records, setRecords] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/public/distribution", { params: { date } })
      .then(({ data }) => setRecords(data))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [date]);

  // Group by sppg
  const grouped = records.reduce((acc, rec) => {
    const key = rec.sppg?.id ?? "unknown";
    if (!acc[key]) acc[key] = { sppg: rec.sppg, records: [] };
    acc[key].records.push(rec);
    return acc;
  }, {});

  const summary = (recs) => {
    const sudah = recs.filter((r) => r.status === "sudah_diantar").length;
    return `${sudah} / ${recs.length} sekolah terdistribusi`;
  };

  return (
    <div className="mon-root">
      <div className="mon-header">
        <h1 className="mon-title">Status Distribusi</h1>
        <p className="mon-sub">
          Pantau status pengiriman makanan MBG ke setiap sekolah secara
          real-time.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <label style={{ fontWeight: 600, fontSize: "0.875rem" }}>
          Tanggal:
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid var(--border, #d1d5db)",
            fontSize: "0.875rem",
          }}
        />
      </div>

      {loading ? (
        <p className="mon-hint" style={{ textAlign: "center" }}>
          Memuat data...
        </p>
      ) : records.length === 0 ? (
        <div className="mon-empty">
          <p>
            Belum ada data distribusi untuk tanggal <strong>{date}</strong>.
          </p>
        </div>
      ) : (
        Object.values(grouped).map(({ sppg, records: recs }) => (
          <div key={sppg?.id} style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>
                {sppg?.kitchen_name ?? "Dapur Tidak Diketahui"}
                <span
                  style={{
                    fontWeight: 400,
                    opacity: 0.6,
                    marginLeft: "8px",
                    fontSize: "0.85rem",
                  }}
                >
                  {sppg?.district}, {sppg?.city}, {sppg?.province}
                </span>
              </h3>
              <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                {summary(recs)}
              </span>
            </div>
            <div className="mon-table-wrap">
              <table className="mon-table">
                <thead>
                  <tr>
                    <th>Sekolah</th>
                    <th>Kecamatan</th>
                    <th>Status</th>
                    <th>Foto Bukti</th>
                    <th>Diperbarui</th>
                  </tr>
                </thead>
                <tbody>
                  {recs.map((rec) => (
                    <tr key={rec.id}>
                      <td>{rec.school?.name ?? "—"}</td>
                      <td>{rec.school?.district ?? "—"}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: "12px",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "#fff",
                            backgroundColor:
                              STATUS_COLOR[rec.status] ?? "#6b7280",
                          }}
                        >
                          {STATUS_LABELS[rec.status]}
                        </span>
                      </td>
                      <td>
                        {rec.photo ? (
                          <button
                            type="button"
                            onClick={() => setSelectedPhoto(rec.photo)}
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={rec.photo}
                              alt="Bukti"
                              style={{
                                width: "60px",
                                height: "45px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                border: "1px solid #d1d5db",
                              }}
                            />
                          </button>
                        ) : (
                          <span style={{ fontSize: "0.85rem", opacity: 0.5 }}>
                            —
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                        {rec.status_updated_at
                          ? new Date(rec.status_updated_at).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" },
                            )
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
      {selectedPhoto && (
        <PhotoViewerModal
          photoUrl={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}
