"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GridFloorProps {
  accentColor?: string;
  gridColor?: string;
  backgroundColor?: string;
}

export function GridFloor({
  accentColor = "#00fff5",
  gridColor = "#1a1a1a",
  backgroundColor = "#0a0a0a",
}: GridFloorProps) {
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
        args={[100, 100, accentColor, gridColor]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color={backgroundColor} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}
