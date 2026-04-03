"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function ProductMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Main product mesh - placeholder */}
        <mesh ref={meshRef}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Wireframe overlay */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(2.05, 2.05, 2.05)]} />
          <lineBasicMaterial color="#00fff5" transparent opacity={0.5} />
        </lineSegments>

        {/* Dimension markers */}
        <group position={[0, -1.5, 0]}>
          <mesh>
            <planeGeometry args={[3, 0.01]} />
            <meshBasicMaterial color="#00fff5" transparent opacity={0.3} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

function ViewerScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[4, 3, 4]} fov={45} />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
      />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
        color="#00fff5"
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />

      {/* Product */}
      <ProductMesh />

      {/* Grid floor */}
      <gridHelper args={[10, 10, "#1a1a1a", "#111111"]} position={[0, -2, 0]} />

      {/* Fog */}
      <fog attach="fog" args={["#0a0a0a", 5, 20]} />
    </>
  );
}

interface ProductViewer3DProps {
  modelUrl?: string;
}

export function ProductViewer3D({ modelUrl }: ProductViewer3DProps) {
  return (
    <div className="relative aspect-square bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border)]">
      {/* Canvas */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ViewerScene />
        </Suspense>
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
          <span>Drag to rotate</span>
          <span>•</span>
          <span>Scroll to zoom</span>
        </div>
        <button className="px-3 py-1 bg-[var(--bg-primary)]/80 backdrop-blur border border-[var(--border)] rounded text-xs text-[var(--accent)]">
          Fullscreen
        </button>
      </div>

      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-8 h-8 border-l border-t border-[var(--accent)]/30" />
      <div className="absolute top-3 right-3 w-8 h-8 border-r border-t border-[var(--accent)]/30" />
      <div className="absolute bottom-12 left-3 w-8 h-8 border-l border-b border-[var(--accent)]/30" />
      <div className="absolute bottom-12 right-3 w-8 h-8 border-r border-b border-[var(--accent)]/30" />
    </div>
  );
}
