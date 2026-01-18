'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Trek } from '@/lib/types';

// A simple stylized mountain component
function Mountain({
  trek,
  position,
  height,
}: {
  trek: Trek;
  position: [number, number, number];
  height: number;
}) {
  const [hovered, setHover] = useState(false);

  return (
    <mesh
      position={position}
      castShadow
      onClick={() => console.log(`Clicked on ${trek.name}`)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <coneGeometry args={[height / 2, height, 8]} />
      <meshStandardMaterial
        color={hovered ? '#c07a4c' : '#6b4f3a'}
        metalness={0.3}
        roughness={0.8}
      />
    </mesh>
  );
}

// A simple stylized tree component
function Forest({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[1, 2, 8, 5]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>
      <mesh position={[0, 4, 0]} castShadow>
        <coneGeometry args={[3, 5, 6]} />
        <meshStandardMaterial color="#3a6b2a" />
      </mesh>
    </group>
  );
}

function Region({ regionName, regionTreks, layout }) {
    const [hovered, setHover] = useState(false);
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, hovered ? 1.2 : 1, 0.1);
        }
    });

    const [centerX, centerZ] = layout.center;

    return (
        <group
            key={regionName}
            position={[centerX, 0, centerZ]}
            ref={groupRef}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
          {/* Region Label */}
          <Text
            position={[0, 1, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={6}
            color="#222"
            anchorX="center"
            anchorY="middle"
          >
            {regionName}
          </Text>

          {/* Mountains in region */}
          {regionTreks.slice(0, 3).map((trek, i) => ( // Show up to 3 mountains per region
            <Mountain
              key={trek.id}
              trek={trek}
              position={[(i - 1) * 15, 10, -10 + (Math.random() - 0.5) * 10]}
              height={trek.altitude ? (trek.altitude / 200) : 20}
            />
          ))}

          {/* Forests in region */}
          {Array.from({ length: 2 }).map((_, i) => ( // Add a couple of forests
            <Forest
              key={i}
              position={[10 + (i * 5), 2.5, 10 + (Math.random() - 0.5) * 10]}
            />
          ))}
        </group>
    )
}

// Region definitions (layout on the map)
const REGION_LAYOUT: Record<string, { center: [number, number], color: string }> = {
    'Khumbu': { center: [60, 20], color: '#a2d2ff' },
    'Annapurna': { center: [-40, 10], color: '#ffb703' },
    'Langtang': { center: [10, 0], color: '#a9d6e5' },
    'Manaslu': { center: [-10, 20], color: '#ffc300' },
    'Makalu': { center: [90, 30], color: '#bde0fe' },
    'Taplejung': { center: [120, 10], color: '#cde5fe' },
    'Dolpo': { center: [-100, 30], color: '#f0f3f5' },
    'Mustang': { center: [-70, 40], color: '#e0e1e1' },
    'Rolwaling': { center: [35, 15], color: '#add8e6' },
    'Dhaulagiri': { center: [-60, 25], color: '#fca311' },
    'Ganesh Himal': { center: [-5, 35], color: '#ffd60a' },
    'Helambu': { center: [15, -15], color: '#b3e5fc' },
    'Solukhumbu': { center: [75, 25], color: '#a9d6e5' },
    'Gandaki': { center: [-45, -10], color: '#ffdd00' },
    'Rasuwa': { center: [0, -10], color: '#bce2f2' },
    'Central Nepal': { center: [20, -25], color: '#c4e6f3' },
    'Kathmandu Valley': { center: [25, -35], color: '#d1eaf5' }
};

export function Nepal3DMap({ treks }: { treks: Trek[] }) {
  const treksByRegion = useMemo(() => {
    return treks.reduce((acc, trek) => {
      if (!trek.region) return acc;
      if (!acc[trek.region]) {
        acc[trek.region] = [];
      }
      acc[trek.region].push(trek);
      return acc;
    }, {} as Record<string, Trek[]>);
  }, [treks]);

  return (
    <div className="w-full h-screen bg-gray-800">
       <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
        .map-container {
          font-family: 'MedievalSharp', cursive;
        }
      `}</style>
      <Canvas className="map-container" camera={{ position: [0, 120, 160], fov: 55 }} shadows>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[100, 200, 150]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Ground Plane with a subtle texture */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
          <planeGeometry args={[300, 200, 128, 128]} />
          <meshStandardMaterial color="#9cb184" roughness={1} metalness={0} />
        </mesh>
        
        {/* Render regions and their contents */}
        {Object.entries(treksByRegion).map(([regionName, regionTreks]) => {
          const layout = REGION_LAYOUT[regionName];
          if (!layout) return null;
          return <Region key={regionName} regionName={regionName} regionTreks={regionTreks} layout={layout} />
        })}

        {/* Camera Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          panSpeed={0.8}
          zoomSpeed={0.7}
          rotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.3} // Prevent looking below the ground
          minDistance={40} // Zoom in limit
          maxDistance={400} // Zoom out limit
          target={[0, 0, 0]} // Center camera focus
        />
      </Canvas>
    </div>
  );
}
