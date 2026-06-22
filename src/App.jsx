import { useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Star, Brain, FlaskConical, Moon, Sun, Layers, Eye } from 'lucide-react';

import HumanModel from './components/HumanModel';
import StructureCard from './components/StructureCard';
import SearchBar from './components/SearchBar';
import Sidebar from './components/Sidebar';
import QuizMode from './components/QuizMode';
import FavoritesPanel from './components/FavoritesPanel';
import { SYSTEMS, LAYERS } from './data/anatomyData';
import './styles/app.css';

const ALL_SYSTEMS = Object.keys(SYSTEMS);
const ALL_LAYERS = LAYERS.map(l => l.id);

export default function App() {
  const [activeSystems, setActiveSystems] = useState(ALL_SYSTEMS);
  const [activeLayers, setActiveLayers] = useState(ALL_LAYERS);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [showLabels, setShowLabels] = useState(false);
  const [labelMode, setLabelMode] = useState('both');
  const [gender, setGender] = useState('male');
  const [darkMode, setDarkMode] = useState(true);
  const [quizOpen, setQuizOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewAngle, setViewAngle] = useState('front');
  const controlsRef = useRef();

  const toggleSystem = useCallback((id) => {
    setActiveSystems(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }, []);

  const toggleLayer = useCallback((id) => {
    setActiveLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }, []);

  const handleSelectStructure = useCallback((structure) => {
    setSelectedStructure(structure);
    setHighlightedId(structure.id);
  }, []);

  const handleHighlight = useCallback((id) => {
    setHighlightedId(id);
  }, []);

  const handleView = (angle) => {
    setViewAngle(angle);
    if (controlsRef.current) {
      const ctrl = controlsRef.current;
      if (angle === 'front') { ctrl.setAzimuthalAngle(0); ctrl.setPolarAngle(Math.PI / 2); }
      else if (angle === 'back') { ctrl.setAzimuthalAngle(Math.PI); ctrl.setPolarAngle(Math.PI / 2); }
      else if (angle === 'left') { ctrl.setAzimuthalAngle(-Math.PI / 2); ctrl.setPolarAngle(Math.PI / 2); }
      else if (angle === 'right') { ctrl.setAzimuthalAngle(Math.PI / 2); ctrl.setPolarAngle(Math.PI / 2); }
      ctrl.update();
    }
  };

  return (
    <div className={`app-root ${darkMode ? 'dark' : 'light'}`}>
      <header className="topbar">
        <div className="topbar-left">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(v => !v)}>
            <Layers size={16} />
          </button>
          <div className="logo">
            <Brain size={20} />
            <span className="logo-text">AnatomyPro</span>
            <span className="logo-sub">3D</span>
          </div>
        </div>
        <div className="topbar-center">
          <SearchBar onSelectStructure={handleSelectStructure} onHighlight={handleHighlight} />
        </div>
        <div className="topbar-right">
          <button className={`topbar-btn ${showLabels ? 'active' : ''}`} onClick={() => setShowLabels(v => !v)} title="Показать подписи">
            <Eye size={15} /><span className="btn-label">Подписи</span>
          </button>
          <button className={`topbar-btn ${favOpen ? 'active' : ''}`} onClick={() => setFavOpen(v => !v)} title="Избранное">
            <Star size={15} /><span className="btn-label">Избранное</span>
            {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
          </button>
          <button className="topbar-btn quiz-btn" onClick={() => setQuizOpen(true)} title="Тест">
            <FlaskConical size={15} /><span className="btn-label">Тест</span>
          </button>
          <div className="divider" />
          <button className="topbar-btn icon-only" onClick={() => setDarkMode(v => !v)} title="Переключить тему">
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      <div className="main-layout">
        {sidebarOpen && (
          <Sidebar activeSystems={activeSystems} onToggleSystem={toggleSystem}
            activeLayers={activeLayers} onToggleLayer={toggleLayer}
            labelMode={labelMode} onLabelMode={setLabelMode}
            gender={gender} onGender={setGender} />
        )}
        <div className="canvas-area">
          <Canvas camera={{ position: [0, 0.8, 3.2], fov: 45 }} style={{ width: '100%', height: '100%' }}>
            <color attach="background" args={[darkMode ? '#070d1c' : '#edf1ff']} />
            <ambientLight intensity={darkMode ? 0.4 : 0.7} />
            <directionalLight position={[3, 6, 4]} intensity={1.4} castShadow />
            <directionalLight position={[-3, 2, -3]} intensity={0.3} />
            <pointLight position={[0, 3, 2]} intensity={0.5} color="#a0c4ff" />
            <pointLight position={[0, -1, 2]} intensity={0.2} color="#ffd6a5" />
            <HumanModel activeSystems={activeSystems} activeLayers={activeLayers}
              selectedStructure={selectedStructure} highlightedId={highlightedId}
              onSelectStructure={handleSelectStructure} showLabels={showLabels}
              labelMode={labelMode} gender={gender} darkMode={darkMode} />
            <Grid position={[0, -0.52, 0]} args={[20, 20]}
              cellColor={darkMode ? '#131d3a' : '#c0cef5'}
              sectionColor={darkMode ? '#1e2d5a' : '#9aaee0'}
              fadeDistance={10} cellSize={0.4} sectionSize={2} infiniteGrid />
            <OrbitControls ref={controlsRef} enablePan enableZoom enableRotate
              minDistance={1.2} maxDistance={8} target={[0, 0.8, 0]} makeDefault />
          </Canvas>
          <div className="view-controls">
            {['front','back','left','right'].map(v => (
              <button key={v} className={`view-btn ${viewAngle===v?'active':''}`} onClick={() => handleView(v)}>
                {v==='front'?'Спереди':v==='back'?'Сзади':v==='left'?'Слева':'Справа'}
              </button>
            ))}
          </div>
          <div className="system-legend">
            {Object.values(SYSTEMS).filter(s => activeSystems.includes(s.id)).map(sys => (
              <div key={sys.id} className="legend-item">
                <span className="legend-dot" style={{ background: sys.color }} />
                <span className="legend-label">{sys.label}</span>
              </div>
            ))}
          </div>
          <div className="canvas-hint">Нажмите на орган для информации • Вращение мышью • Масштаб колёсиком</div>
        </div>
        <div className="right-panel">
          {favOpen && <FavoritesPanel favorites={favorites} onClose={() => setFavOpen(false)}
            onSelect={(s) => { handleSelectStructure(s); setFavOpen(false); }} onRemove={toggleFavorite} />}
          {selectedStructure && !favOpen && <StructureCard structure={selectedStructure}
            onClose={() => { setSelectedStructure(null); setHighlightedId(null); }}
            favorites={favorites} onToggleFavorite={toggleFavorite} />}
          {!selectedStructure && !favOpen && (
            <div className="empty-panel">
              <div className="empty-icon">🫀</div>
              <p>Нажмите на любую структуру на модели</p>
              <p className="empty-hint">или воспользуйтесь поиском выше</p>
              <div className="empty-stats">
                <div className="stat-item"><span className="stat-num">{Object.keys(SYSTEMS).length}</span><span className="stat-label">систем</span></div>
                <div className="stat-item"><span className="stat-num">40+</span><span className="stat-label">структур</span></div>
                <div className="stat-item"><span className="stat-num">6</span><span className="stat-label">слоёв</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
      {quizOpen && <QuizMode onClose={() => setQuizOpen(false)} />}
    </div>
  );
}
