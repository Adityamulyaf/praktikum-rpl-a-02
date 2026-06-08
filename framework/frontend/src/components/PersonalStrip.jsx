import { useAuth } from '../context/AuthContext';
import './PersonalStrip.css';

/* Map role → daftar aksi. key harus cocok dengan menu key di masing-masing dashboard. */
const ROLE_ACTIONS = {
  admin: [
    { key: 'sppg', label: 'Ke Dashboard Admin' },
  ],
  sppg: [
    { key: 'menu',          label: 'Input Menu' },
    { key: 'distribusi',    label: 'Konfirmasi Distribusi' },
    { key: 'profil',        label: 'Profil Dapur' },
    { key: 'tindak_lanjut', label: 'Tindak Lanjut' },
  ],
  siswa: [
    { key: 'ulasan',  label: 'Kirim Ulasan' },
    { key: 'riwayat', label: 'Riwayat Ulasan' },
  ],
  guru: [
    { key: 'ulasan', label: 'Ulasan Siswa' },
  ],
};

const ROLE_LABELS = {
  admin: 'Administrator',
  sppg:  'Dapur SPPG',
  siswa: 'Siswa',
  guru:  'Guru',
};

/* Outlined 40px icons per DESIGN.md §8.1 — no colored fill circles */
const ROLE_ILLUSTRATIONS = {
  siswa: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {/* Graduation cap */}
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  guru: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {/* Presentation screen */}
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21l4-4 4 4M12 17v4"/>
      <line x1="7" y1="9" x2="17" y2="9"/>
      <line x1="7" y1="12" x2="13" y2="12"/>
    </svg>
  ),
  admin: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {/* Shield with check — authority */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  sppg: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {/* Chef hat */}
      <path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 019.18 0A4 4 0 0118 13.87V21H6z"/>
      <line x1="6" y1="17" x2="18" y2="17"/>
    </svg>
  ),
};

/**
 * Welcome card dengan ilustrasi role — muncul antara hero dan features di beranda.
 *
 * Props:
 *   onNavigate(key) — callback untuk ubah active menu di DashboardLayout
 */
export default function PersonalStrip({ onNavigate }) {
  const { user, role } = useAuth();
  const actions = ROLE_ACTIONS[role] ?? [];

  if (!user || actions.length === 0) return null;

  const illustration = ROLE_ILLUSTRATIONS[role] ?? null;
  const roleLabel    = ROLE_LABELS[role] ?? role;

  return (
    <div className="ps-root">
      <div className="ps-inner">

        {illustration && (
          <div className="ps-illus">
            {illustration}
          </div>
        )}

        <div className="ps-text">
          <span className="ps-greeting">Selamat datang, {user.name ?? 'Pengguna'}!</span>
          <span className="ps-role">{roleLabel}</span>
        </div>

        <div className="ps-actions">
          {actions.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className="ps-action-btn"
              onClick={() => onNavigate?.(key)}
            >
              {label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
