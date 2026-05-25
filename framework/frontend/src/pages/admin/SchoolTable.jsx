import { useState, useEffect, useCallback } from 'react';
import { getSchools, deleteSchool } from '../../api/admin';
import SchoolFormModal from './SchoolFormModal';
import './admin.css';

export default function SchoolTable() {
  const [schools, setSchools]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getSchools();
      setSchools(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = ()       => { setEditTarget(null);   setModalOpen(true); };
  const openEdit = (school) => { setEditTarget(school); setModalOpen(true); };
  const closeModal  = () => setModalOpen(false);
  const handleSaved = () => { closeModal(); load(); };

  const handleDelete = async (school) => {
    if (!confirm(`Hapus sekolah "${school.name}"?`)) return;
    try {
      await deleteSchool(school.id);
      load();
    } catch {
      alert('Gagal menghapus sekolah. Silakan coba lagi.');
    }
  };

  return (
    <div>
      <div className="adm-section-header">
        <h2>Sekolah</h2>
        <button className="adm-btn primary" onClick={openAdd}>+ Tambah Sekolah</button>
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <p className="adm-loading">Memuat data...</p>
        ) : schools.length === 0 ? (
          <p className="adm-empty">Belum ada sekolah.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Nama Sekolah</th>
                <th>Kecamatan</th>
                <th>Provinsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.id}>
                  <td>{school.name}</td>
                  <td>{school.district}</td>
                  <td>{school.province}</td>
                  <td>
                    <div className="adm-actions">
                      <button className="adm-btn" onClick={() => openEdit(school)}>Edit</button>
                      <button className="adm-btn danger" onClick={() => handleDelete(school)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <SchoolFormModal school={editTarget} onClose={closeModal} onSaved={handleSaved} />
      )}
    </div>
  );
}
