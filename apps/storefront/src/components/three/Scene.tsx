"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import { FloatingMesh } from "./FloatingMesh";
import { GridFloor } from "./GridFloor";
import { ParticleField } from "./ParticleField";

interface SceneProps {
  mouseX?: number;
  mouseY?: number;
}

function SceneContent({ mouseX = 0, mouseY = 0 }: SceneProps) {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 8]}
        fov={50}
      />

      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00fff5" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff00ff" />

      {/* Main floating mesh */}
      <FloatingMesh mouseX={mouseX} mouseY={mouseY} />

      {/* Grid floor */}
      <GridFloor />

      {/* Particle field */}
      <ParticleField count={300} />

      {/* Fog for depth */}
      <fog attach="fog" args={["#0a0a0a", 5, 30]} />
    </>
  );
}

export function Scene({ mouseX = 0, mouseY = 0 }: SceneProps) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SceneContent mouseX={mouseX} mouseY={mouseY} />
        </Suspense>
      </Canvas>
    </div>
  );
}
