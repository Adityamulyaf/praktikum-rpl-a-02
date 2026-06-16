import { useState, useEffect } from 'react';
import { createSppg, updateSppg } from '../../api/admin';
import './admin.css';

const INITIAL = {
  name: '', email: '', password: '', phone_number: '',
  kitchen_name: '', address: '', district: '', city: '', province: '',
  contact_person_name: '', contact_phone: '', contact_email: '',
  description: '', production_capacity: '',
};

export default function SppgFormModal({ sppg, onClose, onSaved }) {
  const isEdit = !!sppg;
  const [form, setForm]     = useState(INITIAL);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sppg) {
      setForm((f) => ({
        ...f,
        kitchen_name:        sppg.kitchen_name        ?? '',
        address:             sppg.address             ?? '',
        district:            sppg.district            ?? '',
        city:                sppg.city                ?? '',
        province:            sppg.province            ?? '',
        contact_person_name: sppg.contact_person_name ?? '',
        contact_phone:       sppg.contact_phone       ?? '',
        contact_email:       sppg.contact_email       ?? '',
        description:         sppg.description         ?? '',
        production_capacity: sppg.production_capacity ?? '',
      }));
    }
  }, [sppg]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await updateSppg(sppg.id, {
          kitchen_name:        form.kitchen_name,
          address:             form.address,
          district:            form.district,
          city:                form.city,
          province:            form.province,
          contact_person_name: form.contact_person_name,
          contact_phone:       form.contact_phone,
          contact_email:       form.contact_email       || undefined,
          description:         form.description         || undefined,
          production_capacity: form.production_capacity ? Number(form.production_capacity) : undefined,
        });
      } else {
        await createSppg({
          ...form,
          contact_email:       form.contact_email       || undefined,
          description:         form.description         || undefined,
          production_capacity: form.production_capacity ? Number(form.production_capacity) : undefined,
        });
      }
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
          <h3>{isEdit ? 'Edit SPPG' : 'Tambah SPPG'}</h3>
          <button className="adm-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="adm-modal-body">
            {error && <p className="adm-error-msg">{error}</p>}

            {!isEdit && (
              <div className="adm-field-group">
                <h4>Akun Login</h4>
                <div className="adm-field">
                  <label className="adm-label" htmlFor="spf-name">Nama</label>
                  <input id="spf-name" className="adm-input" value={form.name} onChange={set('name')} required />
                </div>
                <div className="adm-field">
                  <label className="adm-label" htmlFor="spf-email">Email</label>
                  <input id="spf-email" className="adm-input" type="email" value={form.email} onChange={set('email')} required />
                </div>
                <div className="adm-field">
                  <label className="adm-label" htmlFor="spf-password">Password</label>
                  <input id="spf-password" className="adm-input" type="password" value={form.password} onChange={set('password')} required minLength={8} />
                </div>
                <div className="adm-field">
                  <label className="adm-label" htmlFor="spf-phone">Telepon</label>
                  <input id="spf-phone" className="adm-input" value={form.phone_number} onChange={set('phone_number')} />
                </div>
              </div>
            )}

            <div className="adm-field-group">
              <h4>Data Dapur</h4>
              <div className="adm-field">
                <label className="adm-label" htmlFor="spf-kitchen-name">Nama Dapur</label>
                <input id="spf-kitchen-name" className="adm-input" value={form.kitchen_name} onChange={set('kitchen_name')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="spf-address">Alamat</label>
                <input id="spf-address" className="adm-input" value={form.address} onChange={set('address')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="spf-district">Kecamatan</label>
                <input id="spf-district" className="adm-input" value={form.district} onChange={set('district')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="spf-city">Kota/Kabupaten</label>
                <input id="spf-city" className="adm-input" value={form.city} onChange={set('city')} required /> 
              </div> 
              <div className="adm-field">
                <label className="adm-label" htmlFor="spf-province">Provinsi</label>
                <input id="spf-province" className="adm-input" value={form.province} onChange={set('province')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="spf-contact-name">Nama Contact Person</label>
                <input id="spf-contact-name" className="adm-input" value={form.contact_person_name} onChange={set('contact_person_name')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="spf-contact-phone">Telepon Contact</label>
                <input id="spf-contact-phone" className="adm-input" value={form.contact_phone} onChange={set('contact_phone')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="spf-contact-email">Email Contact</label>
                <input id="spf-contact-email" className="adm-input" type="email" value={form.contact_email} onChange={set('contact_email')} />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="spf-description">Deskripsi</label>
                <textarea id="spf-description" className="adm-textarea" value={form.description} onChange={set('description')} />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="spf-capacity">Kapasitas Produksi</label>
                <input id="spf-capacity" className="adm-input" type="number" min="1" value={form.production_capacity} onChange={set('production_capacity')} />
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
