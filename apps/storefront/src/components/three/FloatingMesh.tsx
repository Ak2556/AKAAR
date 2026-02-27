"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface FloatingMeshProps {
  mouseX?: number;
  mouseY?: number;
}

export function FloatingMesh({ mouseX = 0, mouseY = 0 }: FloatingMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;

      // Mouse influence
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
            color="#00fff5"
            emissive="#00fff5"
            emissiveIntensity={0.1}
            transparent
            opacity={0.1}
            distort={0.3}
            speed={2}
          />
        </mesh>

        {/* Wireframe outer shell */}
        <lineSegments ref={wireframeRef}>
          <icosahedronGeometry args={[1.8, 1]} />
          <lineBasicMaterial color="#00fff5" transparent opacity={0.5} />
        </lineSegments>

        {/* Second wireframe layer */}
        <lineSegments rotation={[0.5, 0.5, 0]}>
          <icosahedronGeometry args={[2.2, 0]} />
          <lineBasicMaterial color="#ff00ff" transparent opacity={0.2} />
        </lineSegments>
      </group>
    </Float>
  );
}
