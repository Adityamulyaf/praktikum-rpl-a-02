import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import '../admin/admin.css';

const EMPTY_FORM = {
  served_at: new Date().toISOString().split('T')[0],
  menu_name: '',
  components: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
};

function MenuFormModal({ menu, onClose, onSaved }) {
  const isEdit = !!menu;
  const [form, setForm] = useState(
    isEdit
      ? {
          served_at:  menu.served_at  ?? '',
          menu_name:  menu.menu_name  ?? '',
          components: menu.components ?? '',
          calories:   menu.calories   ?? '',
          protein:    menu.protein    ?? '',
          carbs:      menu.carbs      ?? '',
          fat:        menu.fat        ?? '',
        }
      : { ...EMPTY_FORM }
  );
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
        calories: form.calories !== '' ? Number(form.calories) : null,
        protein:  form.protein  !== '' ? Number(form.protein)  : null,
        carbs:    form.carbs    !== '' ? Number(form.carbs)    : null,
        fat:      form.fat      !== '' ? Number(form.fat)      : null,
      };
      if (isEdit) {
        await api.put(`/sppg/menu/${menu.id}`, payload);
      } else {
        await api.post('/sppg/menu', payload);
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
          <h3>{isEdit ? 'Edit Menu' : 'Tambah Menu Harian'}</h3>
          <button className="adm-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="adm-modal-body">
            {error && <p className="adm-error-msg">{error}</p>}
            <div className="adm-field">
              <label className="adm-label" htmlFor="mh-date">Tanggal Sajian</label>
              <input id="mh-date" className="adm-input" type="date"
                value={form.served_at} onChange={set('served_at')} required />
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="mh-name">Nama Menu</label>
              <input id="mh-name" className="adm-input" type="text"
                placeholder="cth. Nasi, Ayam Goreng, Sayur Bayam"
                value={form.menu_name} onChange={set('menu_name')} required />
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="mh-components">Komponen Makanan</label>
              <textarea id="mh-components" className="adm-textarea"
                placeholder="Uraikan komponen makanan secara detail..."
                value={form.components} onChange={set('components')} />
            </div>
            <div className="adm-field-group">
              <h4>Klaim Kandungan Nutrisi</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="adm-field">
                  <label className="adm-label" htmlFor="mh-calories">Kalori (kkal)</label>
                  <input id="mh-calories" className="adm-input" type="number" min="0"
                    value={form.calories} onChange={set('calories')} />
                </div>
                <div className="adm-field">
                  <label className="adm-label" htmlFor="mh-protein">Protein (g)</label>
                  <input id="mh-protein" className="adm-input" type="number" min="0"
                    value={form.protein} onChange={set('protein')} />
                </div>
                <div className="adm-field">
                  <label className="adm-label" htmlFor="mh-carbs">Karbohidrat (g)</label>
                  <input id="mh-carbs" className="adm-input" type="number" min="0"
                    value={form.carbs} onChange={set('carbs')} />
                </div>
                <div className="adm-field">
                  <label className="adm-label" htmlFor="mh-fat">Lemak (g)</label>
                  <input id="mh-fat" className="adm-input" type="number" min="0"
                    value={form.fat} onChange={set('fat')} />
                </div>
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

export default function MenuHarian() {
  const [menus,       setMenus]       = useState([]);
  const [meta,        setMeta]        = useState(null);
  const [page,        setPage]        = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState(null);

  const load = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/sppg/menu', { params: { page: pg } });
      setMenus(data.data);
      setMeta(data);
    } catch {
      setMenus([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const openAdd   = ()     => { setEditTarget(null); setModalOpen(true); };
  const openEdit  = (menu) => { setEditTarget(menu); setModalOpen(true); };
  const closeModal  = () => setModalOpen(false);
  const handleSaved = () => { closeModal(); load(page); };

  const handleDelete = async (menu) => {
    if (!confirm(`Hapus menu "${menu.menu_name}" tanggal ${menu.served_at}?`)) return;
    try {
      await api.delete(`/sppg/menu/${menu.id}`);
      load(page);
    } catch {
      alert('Gagal menghapus menu.');
    }
  };

  const fmt = (val, unit) => val != null ? `${val} ${unit}` : '—';

  return (
    <div>
      <div className="adm-section-header">
        <h2>Menu Harian</h2>
        <button className="adm-btn primary" onClick={openAdd}>+ Tambah Menu</button>
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <p className="adm-loading">Memuat data...</p>
        ) : menus.length === 0 ? (
          <p className="adm-empty">Belum ada menu yang diinput. Klik "+ Tambah Menu" untuk memulai.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama Menu</th>
                <th>Komponen</th>
                <th>Kalori</th>
                <th>Protein</th>
                <th>Karbo</th>
                <th>Lemak</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((menu) => (
                <tr key={menu.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{menu.served_at}</td>
                  <td>{menu.menu_name}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {menu.components || '—'}
                  </td>
                  <td>{fmt(menu.calories, 'kkal')}</td>
                  <td>{fmt(menu.protein,  'g')}</td>
                  <td>{fmt(menu.carbs,    'g')}</td>
                  <td>{fmt(menu.fat,      'g')}</td>
                  <td>
                    <div className="adm-actions">
                      <button className="adm-btn" onClick={() => openEdit(menu)}>Edit</button>
                      <button className="adm-btn danger" onClick={() => handleDelete(menu)}>Hapus</button>
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
          <button className="adm-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Sebelumnya
          </button>
          <span className="adm-page-info">
            Halaman {meta.current_page} dari {meta.last_page} &bull; {meta.total} menu
          </span>
          <button className="adm-btn" disabled={page === meta.last_page} onClick={() => setPage((p) => p + 1)}>
            Berikutnya
          </button>
        </div>
      )}

      {modalOpen && (
        <MenuFormModal menu={editTarget} onClose={closeModal} onSaved={handleSaved} />
      )}
    </div>
  );
}
