"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  size?: number;
  baseColor?: [number, number, number];
  isDark?: boolean;
}

export function ParticleField({
  count = 500,
  size = 0.02,
  baseColor = [0, 0.9, 0.9],
  isDark = true,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;

      // Color with variation based on theme
      const variation = Math.random() * 0.2;
      colors[i3] = Math.min(1, baseColor[0] + variation);
      colors[i3 + 1] = Math.min(1, baseColor[1] + variation);
      colors[i3 + 2] = Math.min(1, baseColor[2] + variation);
    }

    return { positions, colors };
  }, [count, baseColor]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={isDark ? 0.6 : 0.8}
        sizeAttenuation
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}
