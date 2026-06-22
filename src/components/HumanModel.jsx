import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { STRUCTURES } from '../data/anatomyData';
import * as THREE from 'three';

// Renders each anatomical structure as a mesh with glow on hover/select
function StructureMesh({ structure, isVisible, isHighlighted, isSelected, onSelect, showLabels, labelMode }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    if (isHighlighted || isSelected) {
      meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(t * 4) * 0.25;
    } else if (hovered) {
      meshRef.current.material.emissiveIntensity = 0.35;
    } else {
      meshRef.current.material.emissiveIntensity = 0.08;
    }
  });

  if (!isVisible) return null;

  const color = isSelected ? '#ffffff' : isHighlighted ? '#f9ca24' : structure.color;
  const opacity = isSelected ? 1 : isHighlighted ? 0.95 : hovered ? 0.92 : 0.78;
  const scale = isSelected ? 1.12 : isHighlighted ? 1.08 : hovered ? 1.05 : 1;

  // Choose geometry based on structure shape hint
  const shape = structure.shape || 'sphere';

  return (
    <group position={structure.position} scale={[scale, scale, scale]}>
      <mesh
        ref={meshRef}
        scale={structure.scale || [1, 1, 1]}
        onClick={(e) => { e.stopPropagation(); onSelect(structure); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        {shape === 'box' ? (
          <boxGeometry args={[structure.size * 1.6, structure.size, structure.size * 0.8]} />
        ) : shape === 'capsule' ? (
          <capsuleGeometry args={[structure.size * 0.5, structure.size, 8, 12]} />
        ) : shape === 'heart' ? (
          <sphereGeometry args={[structure.size, 20, 20]} />
        ) : (
          <sphereGeometry args={[structure.size, 18, 18]} />
        )}
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          emissive={color}
          emissiveIntensity={0.08}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Glow ring for selected/highlighted */}
      {(isSelected || isHighlighted) && (
        <mesh scale={[1.35, 1.35, 1.35]}>
          <sphereGeometry args={[structure.size, 12, 12]} />
          <meshStandardMaterial
            color={isSelected ? '#4a90e2' : '#f9ca24'}
            transparent
            opacity={0.12}
            wireframe
          />
        </mesh>
      )}

      {/* Label */}
      {(showLabels || hovered || isSelected || isHighlighted) && (
        <Html distanceFactor={9} center style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <div style={{
            background: isSelected
              ? 'rgba(255,255,255,0.97)'
              : hovered
              ? 'rgba(20,30,60,0.96)'
              : 'rgba(10,15,35,0.85)',
            color: isSelected ? '#0a1428' : '#e8f0ff',
            padding: '4px 9px',
            borderRadius: '7px',
            fontSize: '11px',
            fontFamily: "'Inter', system-ui, sans-serif",
            border: `1px solid ${isSelected ? '#4a90e2' : hovered ? 'rgba(110,180,255,0.7)' : 'rgba(80,120,255,0.3)'}`,
            backdropFilter: 'blur(6px)',
            whiteSpace: 'nowrap',
            boxShadow: isSelected
              ? '0 2px 12px rgba(74,144,226,0.4)'
              : '0 2px 8px rgba(0,0,0,0.5)',
            minWidth: '80px',
            textAlign: 'center',
            transform: 'translateY(-4px)',
          }}>
            {labelMode === 'latin' ? (
              <div style={{ fontStyle: 'italic', fontWeight: 600, fontSize: '11px' }}>{structure.nameLat}</div>
            ) : labelMode === 'russian' ? (
              <div style={{ fontWeight: 600 }}>{structure.nameRus}</div>
            ) : (
              <>
                <div style={{ fontStyle: 'italic', fontSize: '10px', opacity: 0.75 }}>{structure.nameLat}</div>
                <div style={{ fontWeight: 700, fontSize: '11px', marginTop: '1px' }}>{structure.nameRus}</div>
              </>
            )}
          </div>
          {/* Arrow pointing down to structure */}
          <div style={{
            width: 0, height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: `5px solid ${isSelected ? '#4a90e2' : 'rgba(80,120,255,0.5)'}`,
            margin: '0 auto',
          }} />
        </Html>
      )}
    </group>
  );
}

// Realistic human body silhouette
function BodySilhouette({ gender, darkMode }) {
  const skinColor = '#c8a880';
  const op = 0.13;
  const wireOp = 0.04;

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.138, 24, 24]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>
      {/* Face flattening */}
      <mesh position={[0, 1.60, 0.06]} rotation={[0.1, 0, 0]}>
        <sphereGeometry args={[0.10, 16, 16]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op * 0.5} roughness={0.8} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.052, 0.062, 0.20, 16]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>
      {/* Shoulders */}
      <mesh position={[-0.22, 1.18, 0]}>
        <sphereGeometry args={[0.07, 14, 14]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op * 0.8} roughness={0.8} />
      </mesh>
      <mesh position={[0.22, 1.18, 0]}>
        <sphereGeometry args={[0.07, 14, 14]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op * 0.8} roughness={0.8} />
      </mesh>
      {/* Torso upper (chest) */}
      <mesh position={[0, 1.08, 0]} scale={[1, 1, 0.72]}>
        <capsuleGeometry args={[0.19, 0.28, 8, 16]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>
      {/* Torso lower (abdomen) */}
      <mesh position={[0, 0.78, 0]} scale={[0.95, 1, 0.72]}>
        <capsuleGeometry args={[0.16, 0.22, 8, 16]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>
      {/* Pelvis */}
      <mesh position={[0, 0.55, 0]} scale={[1.1, 0.7, 0.85]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>

      {/* LEFT ARM */}
      <mesh position={[-0.29, 1.0, 0]} rotation={[0, 0, 0.22]}>
        <capsuleGeometry args={[0.052, 0.32, 8, 12]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>
      <mesh position={[-0.36, 0.68, 0]} rotation={[0, 0, 0.10]}>
        <capsuleGeometry args={[0.042, 0.30, 8, 12]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>
      {/* LEFT HAND */}
      <mesh position={[-0.40, 0.46, 0]}>
        <sphereGeometry args={[0.042, 10, 10]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>

      {/* RIGHT ARM */}
      <mesh position={[0.29, 1.0, 0]} rotation={[0, 0, -0.22]}>
        <capsuleGeometry args={[0.052, 0.32, 8, 12]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>
      <mesh position={[0.36, 0.68, 0]} rotation={[0, 0, -0.10]}>
        <capsuleGeometry args={[0.042, 0.30, 8, 12]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>
      <mesh position={[0.40, 0.46, 0]}>
        <sphereGeometry args={[0.042, 10, 10]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>

      {/* LEFT LEG */}
      <mesh position={[-0.10, 0.22, 0]}>
        <capsuleGeometry args={[0.074, 0.40, 8, 12]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>
      <mesh position={[-0.10, -0.22, 0]}>
        <capsuleGeometry args={[0.056, 0.36, 8, 12]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>
      <mesh position={[-0.10, -0.46, 0.05]} scale={[1, 0.45, 1.6]}>
        <sphereGeometry args={[0.072, 12, 12]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>

      {/* RIGHT LEG */}
      <mesh position={[0.10, 0.22, 0]}>
        <capsuleGeometry args={[0.074, 0.40, 8, 12]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>
      <mesh position={[0.10, -0.22, 0]}>
        <capsuleGeometry args={[0.056, 0.36, 8, 12]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>
      <mesh position={[0.10, -0.46, 0.05]} scale={[1, 0.45, 1.6]}>
        <sphereGeometry args={[0.072, 12, 12]} />
        <meshStandardMaterial color={skinColor} transparent opacity={op} roughness={0.8} />
      </mesh>

      {/* Spine line (visual) */}
      <mesh position={[0, 1.0, -0.08]}>
        <capsuleGeometry args={[0.018, 0.90, 4, 8]} />
        <meshStandardMaterial color="#a0c0ff" transparent opacity={0.07} />
      </mesh>
    </group>
  );
}

export default function HumanModel({
  activeSystems,
  activeLayers,
  selectedStructure,
  highlightedId,
  onSelectStructure,
  showLabels,
  labelMode,
  gender,
  darkMode,
}) {
  return (
    <group>
      <BodySilhouette gender={gender} darkMode={darkMode} />
      {STRUCTURES.map(structure => (
        <StructureMesh
          key={structure.id}
          structure={structure}
          isVisible={activeSystems.includes(structure.system) && activeLayers.includes(structure.layer)}
          isHighlighted={structure.id === highlightedId}
          isSelected={selectedStructure?.id === structure.id}
          onSelect={onSelectStructure}
          showLabels={showLabels}
          labelMode={labelMode}
        />
      ))}
    </group>
  );
}
