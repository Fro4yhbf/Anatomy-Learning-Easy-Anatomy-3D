import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { STRUCTURES, SYSTEMS } from '../data/anatomyData';

export default function SearchBar({ onSelectStructure, onHighlight }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    const lq = q.toLowerCase();
    const found = STRUCTURES.filter(s =>
      s.nameLat.toLowerCase().includes(lq) ||
      s.nameRus.toLowerCase().includes(lq)
    ).slice(0, 8);
    setResults(found);
    setOpen(true);
  };

  const handleSelect = (structure) => {
    onSelectStructure(structure);
    onHighlight(structure.id);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const clear = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    onHighlight(null);
  };

  return (
    <div className="search-wrapper" ref={ref}>
      <div className="search-input-row">
        <Search size={16} className="search-icon" />
        <input className="search-input" type="text" placeholder="Поиск: сердце, cor, nervus..."
          value={query} onChange={handleChange} onFocus={() => query.length >= 2 && setOpen(true)} />
        {query && <button className="search-clear" onClick={clear}><X size={14} /></button>}
      </div>
      {open && results.length > 0 && (
        <div className="search-dropdown">
          {results.map(s => (
            <button key={s.id} className="search-result-item" onClick={() => handleSelect(s)}>
              <span className="result-color" style={{ background: SYSTEMS[s.system]?.color || '#4a90e2' }} />
              <span className="result-lat">{s.nameLat}</span>
              <span className="result-rus">{s.nameRus}</span>
              <span className="result-system">{s.type}</span>
            </button>
          ))}
        </div>
      )}
      {open && results.length === 0 && query.length >= 2 && (
        <div className="search-dropdown"><div className="search-empty">Ничего не найдено</div></div>
      )}
    </div>
  );
}
