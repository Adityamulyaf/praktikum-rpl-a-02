import { useState, useEffect, useCallback, useRef } from 'react';
import { getSchools, getSchoolProvinces, deleteSchool } from '../../api/admin';
import SchoolFormModal from './SchoolFormModal';
import './admin.css';

export default function SchoolTable() {
  const [schools, setSchools]       = useState([]);
  const [meta, setMeta]             = useState(null);
  const [provinces, setProvinces]   = useState([]);
  const [search, setSearch]         = useState('');
  const [province, setProvince]     = useState('');
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    getSchoolProvinces().then(({ data }) => setProvinces(data)).catch(() => {});
  }, []);

  const load = useCallback(async (pg = 1, q = search, prov = province) => {
    setLoading(true);
    try {
      const params = { page: pg };
      if (q)    params.search   = q;
      if (prov) params.province = prov;
      const { data } = await getSchools(params);
      setSchools(data.data);
      setMeta(data);
    } finally {
      setLoading(false);
    }
  }, [search, province]);

  useEffect(() => { load(page); }, [page]);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      load(1, q, province);
    }, 350);
  };

  const handleProvince = (e) => {
    const prov = e.target.value;
    setProvince(prov);
    setPage(1);
    load(1, search, prov);
  };

  const openAdd  = ()       => { setEditTarget(null);   setModalOpen(true); };
  const openEdit = (school) => { setEditTarget(school); setModalOpen(true); };
  const closeModal  = () => setModalOpen(false);
  const handleSaved = () => { closeModal(); load(page); };

  const handleDelete = async (school) => {
    if (!confirm(`Hapus sekolah "${school.name}"?`)) return;
    try {
      await deleteSchool(school.id);
      load(page);
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

      <div className="adm-filters">
        <input
          className="adm-search"
          type="text"
          placeholder="Cari nama sekolah..."
          value={search}
          onChange={handleSearch}
        />
        <select
          className="adm-filter-select"
          value={province}
          onChange={handleProvince}
        >
          <option value="">Semua Provinsi</option>
          {provinces.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <p className="adm-loading">Memuat data...</p>
        ) : schools.length === 0 ? (
          <p className="adm-empty">Tidak ada sekolah ditemukan.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Nama Sekolah</th>
                <th>Kabupaten / Kota</th>
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

      {meta && meta.last_page > 1 && (
        <div className="adm-pagination">
          <button
            className="adm-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Sebelumnya
          </button>
          <span className="adm-page-info">
            Halaman {meta.current_page} dari {meta.last_page}
            {' '}&bull;{' '} {meta.total} sekolah
          </span>
          <button
            className="adm-btn"
            disabled={page === meta.last_page}
            onClick={() => setPage((p) => p + 1)}
          >
            Berikutnya
          </button>
        </div>
      )}

      {modalOpen && (
        <SchoolFormModal school={editTarget} onClose={closeModal} onSaved={handleSaved} />
      )}
    </div>
  );
}
