import { useState, useEffect } from 'react';
import { getSchools, getSchoolProvinces, syncSppgSchools } from '../../api/admin';
import './admin.css';

export default function SppgSchoolModal({ sppg, onClose, onSaved }) {
  const [allSchools, setAllSchools] = useState([]);
  const [assigned, setAssigned]     = useState(new Set());
  const [provinces, setProvinces]   = useState([]);
  const [province, setProvince]     = useState('');
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');

  // load provinces + pre-set assigned schools on mount
  useEffect(() => {
    getSchoolProvinces().then(({ data }) => setProvinces(data));
    setAssigned(new Set((sppg.schools ?? []).map((s) => s.id)));
  }, [sppg]);

  // load schools when province changes
  useEffect(() => {
    if (!province) {
      setAllSchools([]);
      return;
    }
    setLoading(true);
    getSchools({ province, per_page: 9999 }).then(({ data }) => {
      setAllSchools(Array.isArray(data) ? data : data.data ?? []);
      setLoading(false);
    }).catch(() => {
      setError('Gagal memuat daftar sekolah.');
      setLoading(false);
    });
  }, [province]);

  const toggle = (id) =>
    setAssigned((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await syncSppgSchools(sppg.id, [...assigned]);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = allSchools.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal wide" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h3>Kelola Sekolah — {sppg.kitchen_name}</h3>
          <button className="adm-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="adm-modal-body">
          {error && <p className="adm-error-msg">{error}</p>}

          {/* Province selector */}
          <select
            className="adm-search"
            value={province}
            onChange={(e) => { setProvince(e.target.value); setSearch(''); }}
            style={{ marginBottom: '8px' }}
          >
            <option value="">-- Pilih Provinsi --</option>
            {provinces.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Search within province */}
          {province && (
            <input
              className="adm-search"
              placeholder="Cari nama sekolah atau kecamatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          {/* School list */}
          {!province ? (
            <p className="adm-empty">Pilih provinsi untuk melihat daftar sekolah.</p>
          ) : loading ? (
            <p className="adm-loading">Memuat data...</p>
          ) : (
            <div className="adm-school-list">
              {filtered.length === 0 && (
                <p className="adm-empty">Sekolah tidak ditemukan.</p>
              )}
              {filtered.map((school) => (
                <label key={school.id} className="adm-school-item">
                  <input
                    type="checkbox"
                    checked={assigned.has(school.id)}
                    onChange={() => toggle(school.id)}
                  />
                  <span className="adm-school-item-label">{school.name}</span>
                  <span className="adm-school-item-sub">{school.district}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="adm-modal-footer">
          <span className="adm-modal-count">
            {assigned.size} sekolah dipilih
          </span>
          <button className="adm-btn" onClick={onClose}>Batal</button>
          <button className="adm-btn primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}