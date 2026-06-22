import { SYSTEMS, LAYERS } from '../data/anatomyData';
import { Eye, EyeOff, Layers } from 'lucide-react';

export default function Sidebar({ activeSystems, onToggleSystem, activeLayers, onToggleLayer, labelMode, onLabelMode, gender, onGender }) {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Пол модели</div>
        <div className="gender-toggle">
          <button className={`gender-btn ${gender==='male'?'active':''}`} onClick={() => onGender('male')}>♂ Мужчина</button>
          <button className={`gender-btn ${gender==='female'?'active':''}`} onClick={() => onGender('female')}>♀ Женщина</button>
        </div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Режим подписей</div>
        <div className="label-mode-group">
          {[{id:'both',label:'Лат + Рус'},{id:'latin',label:'Только латынь'},{id:'russian',label:'Только русский'}].map(m => (
            <button key={m.id} className={`label-mode-btn ${labelMode===m.id?'active':''}`} onClick={() => onLabelMode(m.id)}>{m.label}</button>
          ))}
        </div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label"><Layers size={13} />Слои</div>
        <div className="layer-list">
          {LAYERS.map(layer => {
            const on = activeLayers.includes(layer.id);
            return (
              <button key={layer.id} className={`layer-btn ${on?'active':''}`} onClick={() => onToggleLayer(layer.id)}>
                {on ? <Eye size={12} /> : <EyeOff size={12} />}
                <span>{layer.label}</span>
                <span className="layer-lat">{layer.labelLat}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Системы органов</div>
        <div className="system-list">
          {Object.values(SYSTEMS).map(sys => {
            const on = activeSystems.includes(sys.id);
            return (
              <button key={sys.id} className={`system-btn ${on?'active':''}`} onClick={() => onToggleSystem(sys.id)}>
                <span className="system-dot" style={{ background: sys.color }} />
                <span className="system-label">{sys.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
