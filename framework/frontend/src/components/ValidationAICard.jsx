import './ValidationAICard.css';

export default function ValidationAICard() {
  return (
    <div className="vai-card-entry">
      <h3 className="vai-card-entry-title">Validasi Gizi AI</h3>
      <p className="vai-card-entry-desc">
        Pindai porsi makan siang bergizi siswa menggunakan teknologi AI kamera langsung.
      </p>
      <a href="/validasi-ai" className="vai-card-entry-link">
        Buka Fitur Pemindai &rarr;
      </a>
    </div>
  );
}
