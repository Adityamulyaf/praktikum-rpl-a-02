import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import '../admin/admin.css';

const STATUS_LABELS = {
  belum_diantar: 'Belum Diantar',
  siap_diantar:  'Siap Diantar',
  sudah_diantar: 'Sudah Diantar',
  batal:         'Batal',
};

const STATUS_BADGE = {
  belum_diantar: 'inactive',
  siap_diantar:  '',        // neutral — will use a custom style inline
  sudah_diantar: 'active',
  batal:         'danger',
};

export default function DistribusiHarian() {
  const [records,  setRecords]  = useState([]);
  const [date,     setDate]     = useState(new Date().toISOString().split('T')[0]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(null); // id of record being updated

  const load = useCallback(async (d = date) => {
    setLoading(true);
    try {
      const { data } = await api.get('/sppg/distribution', { params: { date: d } });
      setRecords(data);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { load(date); }, [date]);

  const handleStatusChange = async (record, newStatus) => {
    setUpdating(record.id);
    try {
      const { data } = await api.put(`/sppg/distribution/${record.id}`, { status: newStatus });
      setRecords((prev) => prev.map((r) => (r.id === record.id ? data : r)));
    } catch {
      alert('Gagal memperbarui status.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="adm-section-header">
        <h2>Status Distribusi</h2>
        <input
          type="date"
          className="adm-input"
          style={{ width: 'auto' }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <p className="adm-loading">Memuat data...</p>
        ) : records.length === 0 ? (
          <p className="adm-empty">Tidak ada sekolah yang terdaftar untuk dapur ini.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Sekolah</th>
                <th>Kecamatan</th>
                <th>Status</th>
                <th>Diperbarui</th>
                <th>Ubah Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.school?.name ?? '—'}</td>
                  <td>{rec.school?.district ?? '—'}</td>
                  <td>
                    <span className={`adm-badge ${STATUS_BADGE[rec.status] ?? ''}`}>
                      {STATUS_LABELS[rec.status]}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', opacity: 0.7 }}>
                    {rec.status_updated_at
                      ? new Date(rec.status_updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </td>
                  <td>
                    <select
                      className="adm-input"
                      style={{ width: 'auto', padding: '4px 8px' }}
                      value={rec.status}
                      disabled={updating === rec.id}
                      onChange={(e) => handleStatusChange(rec, e.target.value)}
                    >
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
