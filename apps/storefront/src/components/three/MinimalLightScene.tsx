"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";

interface MinimalLightSceneProps {
  mouseX?: number;
  mouseY?: number;
}

function GlassRing({
  radius = 2,
  tube = 0.02,
  color = "#3b82f6",
  rotationOffset = [0, 0, 0],
  speed = 1
}: {
  radius?: number;
  tube?: number;
  color?: string;
  rotationOffset?: [number, number, number];
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotationOffset[0] + state.clock.elapsedTime * 0.1 * speed;
      meshRef.current.rotation.y = rotationOffset[1] + state.clock.elapsedTime * 0.15 * speed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, tube, 64, 128]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.6}
        metalness={0.1}
        roughness={0.2}
      />
    </mesh>
  );
}

function SoftSphere({ mouseX = 0, mouseY = 0 }: { mouseX?: number; mouseY?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;

      // Subtle mouse influence
      meshRef.current.rotation.y += mouseX * 0.0005;
      meshRef.current.rotation.x += mouseY * 0.0005;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#e0e7ff"
          transparent
          opacity={0.3}
          metalness={0.1}
          roughness={0.8}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function FloatingShapes() {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group1Ref.current) {
      group1Ref.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
    if (group2Ref.current) {
      group2Ref.current.rotation.z = -state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <>
      {/* Outer ring group */}
      <group ref={group1Ref}>
        <GlassRing radius={2.5} tube={0.015} color="#6366f1" rotationOffset={[0.5, 0, 0]} speed={0.8} />
        <GlassRing radius={2.8} tube={0.01} color="#8b5cf6" rotationOffset={[1.2, 0.5, 0]} speed={0.6} />
      </group>

      {/* Inner ring group */}
      <group ref={group2Ref}>
        <GlassRing radius={1.8} tube={0.02} color="#3b82f6" rotationOffset={[0.8, 1, 0]} speed={1} />
        <GlassRing radius={2.1} tube={0.012} color="#a5b4fc" rotationOffset={[0.3, 0.8, 0.5]} speed={0.7} />
      </group>
    </>
  );
}

function SubtleGrid() {
  return (
    <group position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Very subtle gradient plane */}
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#f8fafc" transparent opacity={0.5} />
      </mesh>

      {/* Minimal line accents */}
      {[-8, -4, 0, 4, 8].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.01]}>
          <planeGeometry args={[0.005, 30]} />
          <meshBasicMaterial color="#cbd5e1" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export function MinimalLightScene({ mouseX = 0, mouseY = 0 }: MinimalLightSceneProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

      {/* Soft ambient lighting */}
      <ambientLight intensity={1} />

      {/* Soft directional lights for subtle shadows */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#e0e7ff" />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#c7d2fe" />

      {/* Central wireframe shape */}
      <SoftSphere mouseX={mouseX} mouseY={mouseY} />

      {/* Floating glass rings */}
      <FloatingShapes />

      {/* Subtle floor grid */}
      <SubtleGrid />

      {/* Very light fog */}
      <fog attach="fog" args={["#ffffff", 10, 50]} />
    </>
  );
}
