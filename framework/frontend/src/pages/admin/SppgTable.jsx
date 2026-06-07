import { useState, useEffect, useCallback, useRef } from 'react';
import { getSppgs, deleteSppg, activateSppg } from '../../api/admin';
import SppgFormModal from './SppgFormModal';
import SppgSchoolModal from './SppgSchoolModal';
import './admin.css';

export default function SppgTable() {
  const [sppgs, setSppgs]                         = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [modalOpen, setModalOpen]                 = useState(false);
  const [editTarget, setEditTarget]               = useState(null);
  const [schoolModalTarget, setSchoolModalTarget] = useState(null);
  const [search, setSearch]                       = useState('');
  const debounceRef = useRef(null);

  const load = useCallback(async (q = search) => {
    setLoading(true);
    try {
      const params = {};
      if (q) params.search = q;
      const { data } = await getSppgs(params);
      setSppgs(data);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      load(q);
    }, 350);
  };

  const openAdd    = ()     => { setEditTarget(null); setModalOpen(true); };
  const openEdit   = (sppg) => { setEditTarget(sppg); setModalOpen(true); };
  const closeModal  = ()    => setModalOpen(false);
  const handleSaved = ()    => { closeModal(); load(); };

  const openSchoolModal   = (sppg) => setSchoolModalTarget(sppg);
  const closeSchoolModal  = ()     => setSchoolModalTarget(null);
  const handleSchoolSaved = ()     => { closeSchoolModal(); load(); };

  const handleDeactivate = async (sppg) => {
    if (!confirm(`Nonaktifkan SPPG "${sppg.kitchen_name}"?`)) return;
    try {
      await deleteSppg(sppg.id);
      load();
    } catch {
      alert('Gagal menonaktifkan SPPG. Silakan coba lagi.');
    }
  };

  const handleActivate = async (sppg) => {
    if (!confirm(`Aktifkan kembali SPPG "${sppg.kitchen_name}"?`)) return;
    try {
      await activateSppg(sppg.id);
      load();
    } catch {
      alert('Gagal mengaktifkan SPPG. Silakan coba lagi.');
    }
  };

  return (
    <div>
      <div className="adm-section-header">
        <h2>SPPG</h2>
        <button className="adm-btn primary" onClick={openAdd}>+ Tambah SPPG</button>
      </div>

      <div className="adm-filters">
        <input
          className="adm-search"
          type="text"
          placeholder="Cari nama dapur, wilayah, atau penanggung jawab..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <p className="adm-loading">Memuat data...</p>
        ) : sppgs.length === 0 ? (
          <p className="adm-empty">Tidak ada SPPG ditemukan.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Nama Dapur</th>
                <th>Wilayah</th>
                <th>Contact Person</th>
                <th>Sekolah</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sppgs.map((sppg) => (
                <tr key={sppg.id}>
                  <td>{sppg.kitchen_name}</td>
                  <td>{sppg.district}, {sppg.province}</td>
                  <td>{sppg.contact_person_name}</td>
                  <td>{sppg.schools?.length ?? 0} sekolah</td>
                  <td>
                    <span className={`adm-badge ${sppg.user?.is_active ? 'active' : 'inactive'}`}>
                      {sppg.user?.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div className="adm-actions">
                      <button className="adm-btn" onClick={() => openEdit(sppg)}>Edit</button>
                      <button className="adm-btn" onClick={() => openSchoolModal(sppg)}>Kelola Sekolah</button>
                      {sppg.user?.is_active ? (
                        <button className="adm-btn danger" onClick={() => handleDeactivate(sppg)}>
                          Nonaktifkan
                        </button>
                      ) : (
                        <button className="adm-btn success" onClick={() => handleActivate(sppg)}>
                          Aktifkan
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <SppgFormModal sppg={editTarget} onClose={closeModal} onSaved={handleSaved} />
      )}

      {schoolModalTarget && (
        <SppgSchoolModal sppg={schoolModalTarget} onClose={closeSchoolModal} onSaved={handleSchoolSaved} />
      )}
    </div>
  );
}
