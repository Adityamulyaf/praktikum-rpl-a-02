import { useState, useEffect } from 'react';
import { createSchool, updateSchool } from '../../api/admin';
import './admin.css';

export default function SchoolFormModal({ school, onClose, onSaved }) {
  const isEdit = !!school;
  const [form, setForm] = useState({ name: '', address: '', district: '', province: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (school) {
      setForm({
        name:     school.name     ?? '',
        address:  school.address  ?? '',
        district: school.district ?? '',
        province: school.province ?? '',
      });
    }
  }, [school]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      isEdit ? await updateSchool(school.id, form) : await createSchool(form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h3>{isEdit ? 'Edit Sekolah' : 'Tambah Sekolah'}</h3>
          <button className="adm-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="adm-modal-body">
            {error && <p className="adm-error-msg">{error}</p>}
            <div className="adm-field">
              <label className="adm-label" htmlFor="sf-name">Nama Sekolah</label>
              <input id="sf-name" className="adm-input" value={form.name} onChange={set('name')} required />
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="sf-address">Alamat</label>
              <input id="sf-address" className="adm-input" value={form.address} onChange={set('address')} />
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="sf-district">Kecamatan</label>
              <input id="sf-district" className="adm-input" value={form.district} onChange={set('district')} required />
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="sf-province">Provinsi</label>
              <input id="sf-province" className="adm-input" value={form.province} onChange={set('province')} required />
            </div>
          </div>
          <div className="adm-modal-footer">
            <button type="button" className="adm-btn" onClick={onClose}>Batal</button>
            <button type="submit" className="adm-btn primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
