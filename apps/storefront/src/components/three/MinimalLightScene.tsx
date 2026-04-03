"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface MinimalLightSceneProps {
  mouseX?: number;
  mouseY?: number;
}

// Light mode colors - matching dark mode's cyberpunk vibe
const COLORS = {
  accent: "#0891b2",      // Cyan/teal for light mode
  secondary: "#c026d3",   // Magenta/fuchsia
  grid: "#06b6d4",        // Lighter cyan for grid
  gridBg: "#f0fdfa",      // Very light cyan tint
  particle: "#0891b2",
};

// Floating mesh matching dark mode structure
function FloatingMesh({ mouseX = 0, mouseY = 0 }: { mouseX?: number; mouseY?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.y += mouseX * 0.001;
      meshRef.current.rotation.x += mouseY * 0.001;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = meshRef.current?.rotation.x || 0;
      wireframeRef.current.rotation.y = meshRef.current?.rotation.y || 0;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        {/* Inner solid mesh with distortion */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.5, 1]} />
          <MeshDistortMaterial
            color={COLORS.accent}
            emissive={COLORS.accent}
            emissiveIntensity={0.05}
            transparent
            opacity={0.15}
            distort={0.3}
            speed={2}
          />
        </mesh>

        {/* Wireframe outer shell */}
        <lineSegments ref={wireframeRef}>
          <icosahedronGeometry args={[1.8, 1]} />
          <lineBasicMaterial color={COLORS.accent} transparent opacity={0.6} />
        </lineSegments>

        {/* Second wireframe layer */}
        <lineSegments rotation={[0.5, 0.5, 0]}>
          <icosahedronGeometry args={[2.2, 0]} />
          <lineBasicMaterial color={COLORS.secondary} transparent opacity={0.3} />
        </lineSegments>
      </group>
    </Float>
  );
}

// Grid floor matching dark mode
function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 1;
    }
  });

  return (
    <group position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper
        ref={gridRef}
        args={[100, 100, COLORS.grid, "#e0f2fe"]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color={COLORS.gridBg} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

// Particle field matching dark mode
function ParticleField({ count = 300 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Parse hex color to RGB
    const r = 0.03; // cyan-ish
    const g = 0.57;
    const b = 0.7;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;

      // Color with variation
      const variation = Math.random() * 0.2;
      colors[i3] = Math.min(1, r + variation);
      colors[i3 + 1] = Math.min(1, g + variation);
      colors[i3 + 2] = Math.min(1, b + variation);
    }

    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

export function MinimalLightScene({ mouseX = 0, mouseY = 0 }: MinimalLightSceneProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

      {/* Lighting - brighter for light mode */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color={COLORS.accent} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={COLORS.secondary} />

      {/* Main floating mesh - same as dark mode */}
      <FloatingMesh mouseX={mouseX} mouseY={mouseY} />

      {/* Grid floor - same as dark mode */}
      <GridFloor />

      {/* Particle field - same as dark mode */}
      <ParticleField count={300} />

      {/* Fog for depth - light colored */}
      <fog attach="fog" args={["#f0fdfa", 5, 35]} />
    </>
  );
}
