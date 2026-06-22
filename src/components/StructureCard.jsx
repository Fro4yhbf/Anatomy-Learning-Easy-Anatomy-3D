import { useState } from 'react';
import { X, Star, BookOpen, Stethoscope, Zap, MapPin, Droplets, Activity, ChevronRight } from 'lucide-react';
import { SYSTEMS } from '../data/anatomyData';

export default function StructureCard({ structure, onClose, favorites, onToggleFavorite }) {
  const [tab, setTab] = useState('info');
  if (!structure) return null;
  const isFav = favorites.includes(structure.id);
  const system = SYSTEMS[structure.system];
  const tabs = [{ id: 'info', label: 'Основное', icon: BookOpen }, { id: 'clinical', label: 'Клиника', icon: Stethoscope }];

  return (
    <div className="structure-card">
      <div className="card-system-bar" style={{ background: system?.color || '#4a90e2' }} />
      <div className="card-header">
        <div className="card-title-block">
          <div className="card-badges">
            <span className="card-type-badge">{structure.type}</span>
            {system && <span className="card-system-badge" style={{ borderColor: system.color, color: system.color }}>{system.label}</span>}
          </div>
          <h2 className="card-lat">{structure.nameLat}</h2>
          <h3 className="card-rus">{structure.nameRus}</h3>
        </div>
        <div className="card-actions">
          <button className={`btn-icon ${isFav ? 'fav-active' : ''}`} onClick={() => onToggleFavorite(structure.id)} title={isFav ? 'Убрать из избранного' : 'В избранное'}>
            <Star size={16} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button className="btn-icon" onClick={onClose} title="Закрыть"><X size={16} /></button>
        </div>
      </div>
      <div className="card-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`card-tab ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)}>
            <t.icon size={13} />{t.label}
          </button>
        ))}
      </div>
      <div className="card-body">
        {tab === 'info' && (
          <div className="info-grid">
            <InfoRow icon={Zap} label="Функция" value={structure.function} accent />
            <InfoRow icon={MapPin} label="Расположение" value={structure.location} />
            <InfoRow icon={Droplets} label="Кровоснабжение" value={structure.bloodSupply} />
            <InfoRow icon={Activity} label="Иннервация" value={structure.innervation} />
            {structure.region && (
              <div className="region-tag"><ChevronRight size={11} />Регион: <strong>{regionLabel(structure.region)}</strong></div>
            )}
          </div>
        )}
        {tab === 'clinical' && (
          <div className="clinical-block">
            <div className="clinical-section">
              <h4 className="clinical-title"><Stethoscope size={13} />Клиническое значение</h4>
              <p className="clinical-text">{structure.clinical}</p>
            </div>
            {structure.commonMistakes && (
              <div className="clinical-section mistakes">
                <h4 className="clinical-title">⚠ Частые ошибки студентов</h4>
                <p className="clinical-text">{structure.commonMistakes}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="card-footer">
        <span className="card-footer-hint">Слой: {layerLabel(structure.layer)}</span>
      </div>
    </div>
  );
}

function regionLabel(region) {
  const map = { head: 'Голова и шея', thorax: 'Грудная клетка', abdomen: 'Живот', pelvis: 'Таз', upper_limb: 'Верхняя конечность', lower_limb: 'Нижняя конечность' };
  return map[region] || region;
}

function layerLabel(layer) {
  const map = { skin: 'Кожа', muscle: 'Мышцы', bone: 'Кости', vessel: 'Сосуды', nerve: 'Нервы', organ: 'Органы' };
  return map[layer] || layer;
}

function InfoRow({ icon: Icon, label, value, accent }) {
  return (
    <div className={`info-row ${accent ? 'accent' : ''}`}>
      <div className="info-label"><Icon size={12} />{label}</div>
      <div className="info-value">{value}</div>
    </div>
  );
}
