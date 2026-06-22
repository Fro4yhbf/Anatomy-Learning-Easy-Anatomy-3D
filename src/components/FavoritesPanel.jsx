import { Star, X } from 'lucide-react';
import { STRUCTURES } from '../data/anatomyData';

export default function FavoritesPanel({ favorites, onClose, onSelect, onRemove }) {
  const favStructures = STRUCTURES.filter(s => favorites.includes(s.id));
  return (
    <div className="favorites-panel">
      <div className="fav-header">
        <div className="fav-title"><Star size={16} fill="currentColor" />Избранное</div>
        <button className="btn-icon" onClick={onClose}><X size={16} /></button>
      </div>
      {favStructures.length === 0 ? (
        <div className="fav-empty"><Star size={32} /><p>Добавьте структуры в избранное, нажав ★ в карточке органа</p></div>
      ) : (
        <div className="fav-list">
          {favStructures.map(s => (
            <div key={s.id} className="fav-item">
              <button className="fav-item-main" onClick={() => onSelect(s)}>
                <span className="fav-dot" style={{ background: s.color }} />
                <div className="fav-names">
                  <div className="fav-lat">{s.nameLat}</div>
                  <div className="fav-rus">{s.nameRus}</div>
                </div>
              </button>
              <button className="fav-remove" onClick={() => onRemove(s.id)}><X size={12} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
