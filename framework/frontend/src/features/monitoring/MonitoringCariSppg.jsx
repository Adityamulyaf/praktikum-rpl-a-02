import { useState, useRef } from 'react';
import { searchPublicSchools } from '../../api/auth';

export default function MonitoringCariSppg() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  const getSppgNames = (school) => {
    const names = school.sppg_profiles?.map((sppg) => sppg.kitchen_name).filter(Boolean) ?? [];
    return names.length > 0 ? names.join(', ') : 'Belum tersedia';
  };

  const handleInput = (e) => {
    const q = e.target.value;
    setQuery(q);

    clearTimeout(debounceRef.current);
    if (q.length < 2) { setResults([]); setSearched(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await searchPublicSchools(q);
        setResults(data);
        setSearched(true);
      } catch {
        setResults([]);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="mon-root">
      <div className="mon-header">
        <h1 className="mon-title">Cari SPPG / Sekolah</h1>
        <p className="mon-sub">
          Temukan dapur MBG yang melayani sekolah tertentu dengan mengetik nama sekolah atau kabupaten.
        </p>
      </div>

      <div className="mon-search-wrap">
        <div className="mon-search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <input
          className="mon-search-input"
          type="text"
          placeholder="Cari nama sekolah atau kabupaten..."
          value={query}
          onChange={handleInput}
          autoComplete="off"
        />
        {loading && <div className="mon-search-spinner" />}
      </div>

      {searched && results.length === 0 && (
        <div className="mon-empty">
          <p>Tidak ada sekolah ditemukan untuk "<strong>{query}</strong>"</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mon-results">
          <p className="mon-results-count">{results.length} sekolah ditemukan</p>
          <div className="mon-table-wrap">
            <table className="mon-table">
              <thead>
                <tr>
                  <th>Nama Sekolah</th>
                  <th>Kabupaten / Kota</th>
                  <th>Provinsi</th>
                  <th>Dapur SPPG</th>
                </tr>
              </thead>
              <tbody>
                {results.map((school) => (
                  <tr key={school.id}>
                    <td>{school.name}</td>
                    <td>{school.district ?? '—'}</td>
                    <td>{school.province ?? '—'}</td>
                    <td>
                      <span className="mon-badge-pending">{getSppgNames(school)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!searched && (
        <div className="mon-hint">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: 'var(--text-tertiary)' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <p>Ketik minimal 2 karakter untuk memulai pencarian</p>
        </div>
      )}
    </div>
  );
}
