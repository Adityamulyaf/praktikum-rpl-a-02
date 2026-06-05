import ValidationAICard from '../components/ValidationAICard';
import ProgramSummaryCard from '../components/ProgramSummaryCard';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Selamat Datang Kembali</h1>
      <p className="dashboard-subtitle">
        Ini adalah pusat monitoring program Makan Bergizi Gratis (MBG) untuk sekolah Anda.
      </p>
      <div className="dashboard-grid">
        <ValidationAICard />
        <ProgramSummaryCard />
      </div>
    </div>
  );
}
