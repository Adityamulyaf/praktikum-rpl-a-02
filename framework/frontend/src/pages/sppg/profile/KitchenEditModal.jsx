import { useState } from 'react';
import api from '../../../api/axios';
import '../../admin/admin.css';

export default function KitchenEditModal({ profile, onClose, onSaved }) {
  const [form, setForm] = useState({
    kitchen_name:        profile.kitchen_name        ?? '',
    address:             profile.address             ?? '',
    district:            profile.district            ?? '',
    city:                profile.city                ?? '',
    province:            profile.province            ?? '',
    contact_person_name: profile.contact_person_name ?? '',
    contact_phone:       profile.contact_phone       ?? '',
    contact_email:       profile.contact_email       ?? '',
    description:         profile.description         ?? '',
    production_capacity: profile.production_capacity ?? '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        production_capacity: form.production_capacity ? Number(form.production_capacity) : null,
        contact_email: form.contact_email || null,
      };
      const { data } = await api.put('/sppg/profile', payload);
      onSaved(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h3>Edit Profil Dapur</h3>
          <button className="adm-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="adm-modal-body">
            {error && <p className="adm-error-msg">{error}</p>}
            <div className="adm-field-group">
              <h4>Informasi Dapur</h4>
              <div className="adm-field">
                <label className="adm-label" htmlFor="ke-kitchen-name">Nama Dapur</label>
                <input id="ke-kitchen-name" className="adm-input" value={form.kitchen_name} onChange={set('kitchen_name')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="ke-address">Alamat</label>
                <input id="ke-address" className="adm-input" value={form.address} onChange={set('address')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="ke-district">Kecamatan</label>
                <input id="ke-district" className="adm-input" value={form.district} onChange={set('district')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="ke-city">Kota/Kabupaten</label>
                <input id="ke-city" className="adm-input" value={form.city} onChange={set('city')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="ke-province">Provinsi</label>
                <input id="ke-province" className="adm-input" value={form.province} onChange={set('province')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="ke-description">Deskripsi</label>
                <textarea id="ke-description" className="adm-textarea" value={form.description} onChange={set('description')} />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="ke-capacity">Kapasitas Produksi (porsi/hari)</label>
                <input id="ke-capacity" className="adm-input" type="number" min="1" value={form.production_capacity} onChange={set('production_capacity')} />
              </div>
            </div>
            <div className="adm-field-group">
              <h4>Kontak</h4>
              <div className="adm-field">
                <label className="adm-label" htmlFor="ke-contact-name">Nama Contact Person</label>
                <input id="ke-contact-name" className="adm-input" value={form.contact_person_name} onChange={set('contact_person_name')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="ke-contact-phone">Nomor Telepon</label>
                <input id="ke-contact-phone" className="adm-input" value={form.contact_phone} onChange={set('contact_phone')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="ke-contact-email">Email Contact</label>
                <input id="ke-contact-email" className="adm-input" type="email" value={form.contact_email} onChange={set('contact_email')} />
              </div>
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
