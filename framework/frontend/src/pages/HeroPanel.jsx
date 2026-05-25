import heroBg from '../assets/mbg-ilustration.png';

const STATS = [
  { value: '12.482', label: 'sekolah aktif' },
  { value: '2,3 juta', label: 'siswa terlayani' },
  { value: '98%', label: 'laporan masuk' },
];

export default function HeroPanel() {
  return (
    <div
      className="lp-hero"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <span className="lp-brand">HaloMBG</span>
      <div className="lp-hero-copy">
        <h1>Sistem Monitoring Makan Bergizi Gratis</h1>
        <p>
          Platform pemantauan nasional untuk memastikan anak-anak Indonesia
          mendapatkan akses penuh terhadap program Makan Bergizi Gratis setiap hari.
        </p>
        <div className="lp-stats">
          {STATS.map(({ value, label }) => (
            <div key={label} className="lp-stat-item">
              <span className="lp-stat-value">{value}</span>
              <span className="lp-stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
