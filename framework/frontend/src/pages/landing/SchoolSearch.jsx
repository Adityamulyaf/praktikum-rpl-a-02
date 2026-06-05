import { useState, useEffect, useRef } from 'react';
import { searchPublicSchools } from '../../api/auth';

export default function SchoolSearch({ id, value, onChange, required }) {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [open, setOpen]         = useState(false);
  const [selected, setSelected] = useState(null);
  const debounceRef = useRef(null);
  const wrapRef     = useRef(null);

  useEffect(() => {
    if (!value) { setSelected(null); setQuery(''); }
  }, [value]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = (e) => {
    const q = e.target.value;
    setQuery(q);
    setSelected(null);
    onChange('');

    clearTimeout(debounceRef.current);
    if (q.length < 2) { setResults([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await searchPublicSchools(q);
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);
  };

  const pick = (school) => {
    setSelected(school);
    setQuery(school.name);
    setResults([]);
    setOpen(false);
    onChange(school.id);
  };

  return (
    <div className="ss-wrap" ref={wrapRef}>
      <input
        id={id}
        className="lp-input"
        type="text"
        placeholder="Ketik nama sekolah..."
        value={query}
        onChange={handleInput}
        onFocus={() => results.length > 0 && setOpen(true)}
        autoComplete="off"
        required={required && !selected}
      />
      {open && results.length > 0 && (
        <ul className="ss-dropdown">
          {results.map((s) => (
            <li key={s.id} className="ss-item" onMouseDown={() => pick(s)}>
              <span className="ss-name">{s.name}</span>
              <span className="ss-sub">{s.district} &bull; {s.province}</span>
            </li>
          ))}
        </ul>
      )}
      {open && results.length === 0 && query.length >= 2 && (
        <ul className="ss-dropdown">
          <li className="ss-item ss-empty">Sekolah tidak ditemukan</li>
        </ul>
      )}
    </div>
  );
}
