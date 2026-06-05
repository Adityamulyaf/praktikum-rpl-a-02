export default function RegisterSelectForm({ onSelect, onBack }) {
  return (
    <>
      <div className="lp-header">
        <h2>Daftar Akun</h2>
        <p>Pilih peran Anda di platform HaloMBG</p>
      </div>

      <div className="rg-select-grid">
        <button type="button" className="rg-role-card" onClick={() => onSelect('siswa')}>
          <span className="rg-role-label">Siswa</span>
          <span className="rg-role-desc">Saya adalah siswa penerima MBG</span>
        </button>
        <button type="button" className="rg-role-card" onClick={() => onSelect('guru')}>
          <span className="rg-role-label">Guru</span>
          <span className="rg-role-desc">Saya adalah guru atau pengawas sekolah</span>
        </button>
      </div>

      <p className="lp-switch">
        Sudah punya akun?{' '}
        <button type="button" className="lp-switch-btn" onClick={onBack}>Masuk</button>
      </p>
    </>
  );
}
