'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TrekCardProps {
  name: string;
  difficulty: string;
  color: string;
}

function RotatingBox({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </mesh>
  );
}

export function Trek3DCard({ name, difficulty, color }: TrekCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-slate-700 hover:border-orange-500 transition-colors duration-300 h-96 flex flex-col">
      <div className="h-3/4 bg-slate-900">
        <Canvas>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <RotatingBox color={color} />
        </Canvas>
      </div>
      <div className="h-1/4 p-4 flex flex-col justify-between">
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <p className="text-sm text-orange-400">
          Difficulty: <span className="font-semibold">{difficulty}</span>
        </p>
      </div>
    </div>
  );
}
