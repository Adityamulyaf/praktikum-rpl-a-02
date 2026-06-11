import { useState, useEffect } from 'react';
import { getSchools, syncSppgSchools } from '../../api/admin';
import './admin.css';

export default function SppgSchoolModal({ sppg, onClose, onSaved }) {
  const [allSchools, setAllSchools] = useState([]);
  const [assigned, setAssigned]     = useState(new Set());
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');

  const sppgProvince = sppg.province ?? '';
  const sppgDistrict = sppg.district ?? '';

  // load schools filtered by SPPG's kabupaten/kota on mount
  useEffect(() => {
    setAssigned(new Set((sppg.schools ?? []).map((s) => s.id)));

    if (!sppgDistrict) {
      setError('SPPG tidak memiliki data wilayah/kabupaten.');
      return;
    }

    setLoading(true);
    getSchools({ province: sppgProvince, district: sppgDistrict, per_page: 9999 }).then(({ data }) => {
      setAllSchools(Array.isArray(data) ? data : data.data ?? []);
      setLoading(false);
    }).catch(() => {
      setError('Gagal memuat daftar sekolah.');
      setLoading(false);
    });
  }, [sppg, sppgProvince, sppgDistrict]);

  const toggle = (id) => {
    const school = allSchools.find((s) => s.id === id);
    if (school && school.sppg_profiles && school.sppg_profiles.length > 0) {
      const otherSppg = school.sppg_profiles.find((p) => p.id !== sppg.id);
      if (otherSppg) {
        alert(`Sekolah "${school.name}" sudah terhubung dengan SPPG "${otherSppg.kitchen_name}".`);
        return;
      }
    }

    setAssigned((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

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

          {/* Wilayah info (read-only, based on SPPG kabupaten) */}
          <div style={{ marginBottom: '8px', padding: '8px 12px', background: '#f0f4ff', borderRadius: '6px', fontSize: '0.9rem', color: '#334155' }}>
            <strong>Wilayah:</strong> {sppgDistrict}, {sppgProvince}
            <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: '#64748b' }}>
              (Hanya menampilkan sekolah di kabupaten/kota yang sama)
            </span>
          </div>

          {/* Search within province */}
          <input
            className="adm-search"
            placeholder="Cari nama sekolah atau kecamatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* School list */}
          {loading ? (
            <p className="adm-loading">Memuat data...</p>
          ) : (
            <div className="adm-school-list">
              {filtered.length === 0 && (
                <p className="adm-empty">Sekolah tidak ditemukan.</p>
              )}
              {filtered.map((school) => {
                const otherSppg = school.sppg_profiles?.find((p) => p.id !== sppg.id);
                return (
                  <label key={school.id} className="adm-school-item">
                    <input
                      type="checkbox"
                      checked={assigned.has(school.id)}
                      onChange={() => toggle(school.id)}
                    />
                    <span className="adm-school-item-label">{school.name}</span>
                    {otherSppg && (
                      <span className="adm-school-badge">
                        Terhubung: {otherSppg.kitchen_name}
                      </span>
                    )}
                    <span className="adm-school-item-sub">{school.district}</span>
                  </label>
                );
              })}
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