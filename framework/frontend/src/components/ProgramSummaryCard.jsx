import './ProgramSummaryCard.css';

export default function ProgramSummaryCard() {
  return (
    <div className="program-summary-card">
      <h3 className="program-summary-title">Ringkasan Program</h3>
      <div className="program-summary-row">
        <span className="program-summary-label">Status Validasi Hari Ini:</span>
        <span className="program-summary-value success">Tervalidasi (12 Laporan)</span>
      </div>
      <div className="program-summary-row">
        <span className="program-summary-label">Sekolah Penerima:</span>
        <span className="program-summary-value">SDN Jayasinga 01</span>
      </div>
    </div>
  );
}
