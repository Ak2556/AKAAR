"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface MinimalLightSceneProps {
  mouseX?: number;
  mouseY?: number;
}

// Falling matrix dots
function MatrixRain({ count = 800 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds, opacities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const opacities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread in X and Z, random Y position
      positions[i3] = (Math.random() - 0.5) * 25;
      positions[i3 + 1] = Math.random() * 20 - 5;
      positions[i3 + 2] = (Math.random() - 0.5) * 20 - 5;

      speeds[i] = 0.5 + Math.random() * 1.5;
      opacities[i] = 0.3 + Math.random() * 0.7;
    }

    return { positions, speeds, opacities };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Fall down
      posArray[i3 + 1] -= speeds[i] * delta * 2;

      // Reset when below view
      if (posArray[i3 + 1] < -10) {
        posArray[i3 + 1] = 15;
        posArray[i3] = (Math.random() - 0.5) * 25;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#6366f1"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// Static dot grid - cinematic matrix floor
function DotGrid({ rows = 40, cols = 40, spacing = 0.6 }: { rows?: number; cols?: number; spacing?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const positions = new Float32Array(rows * cols * 3);
    let idx = 0;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        positions[idx++] = (j - cols / 2) * spacing;
        positions[idx++] = 0;
        positions[idx++] = (i - rows / 2) * spacing;
      }
    }

    return positions;
  }, [rows, cols, spacing]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    // Subtle wave animation
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < rows * cols; i++) {
      const i3 = i * 3;
      const x = posArray[i3];
      const z = posArray[i3 + 2];
      // Wave effect
      posArray[i3 + 1] = Math.sin(x * 0.3 + time * 0.5) * Math.cos(z * 0.3 + time * 0.3) * 0.3;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={[0, -3, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#94a3b8"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// Central glowing orb
function CentralOrb({ mouseX = 0, mouseY = 0 }: { mouseX: number; mouseY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.y += mouseX * 0.001;
      groupRef.current.rotation.x += mouseY * 0.001;
    }
    if (innerRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      innerRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner glow */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.15} />
      </mesh>

      {/* Wireframe shell */}
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.4} />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#a5b4fc" transparent opacity={0.5} />
      </mesh>

      {/* Vertical ring */}
      <mesh>
        <torusGeometry args={[1.6, 0.01, 16, 100]} />
        <meshBasicMaterial color="#c7d2fe" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Floating vertical dot columns
function DotColumns({ count = 12 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const columns = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 5 + Math.random() * 3;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        dots: 8 + Math.floor(Math.random() * 8),
        speed: 0.2 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
      };
    });
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {columns.map((col, colIdx) => (
        <group key={colIdx} position={[col.x, 0, col.z]}>
          {Array.from({ length: col.dots }, (_, dotIdx) => (
            <DotInColumn
              key={dotIdx}
              baseY={-4 + dotIdx * 0.8}
              speed={col.speed}
              offset={col.offset + dotIdx * 0.3}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function DotInColumn({ baseY, speed, offset }: { baseY: number; speed: number; offset: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * speed * 3 + offset);
      meshRef.current.scale.setScalar(0.8 + pulse * 0.3);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + pulse * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, baseY, 0]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.5} />
    </mesh>
  );
}

export function MinimalLightScene({ mouseX = 0, mouseY = 0 }: MinimalLightSceneProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 10]} fov={50} />

      {/* Soft ambient lighting */}
      <ambientLight intensity={0.8} />

      {/* Falling matrix rain */}
      <MatrixRain count={600} />

      {/* Dot grid floor with wave */}
      <DotGrid rows={35} cols={35} spacing={0.7} />

      {/* Central orb */}
      <CentralOrb mouseX={mouseX} mouseY={mouseY} />

      {/* Surrounding dot columns */}
      <DotColumns count={10} />

      {/* Very subtle fog */}
      <fog attach="fog" args={["#f8fafc", 8, 35]} />
    </>
  );
}
