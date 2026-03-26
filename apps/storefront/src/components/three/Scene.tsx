"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { FloatingMesh } from "./FloatingMesh";
import { GridFloor } from "./GridFloor";
import { ParticleField } from "./ParticleField";

interface SceneProps {
  mouseX?: number;
  mouseY?: number;
  isDark?: boolean;
}

// Theme-aware colors
const themeColors = {
  dark: {
    accent: "#00fff5",
    accentSecondary: "#ff00ff",
    background: "#0a0a0a",
    grid: "#1a1a1a",
    fogColor: "#0a0a0a",
    ambientIntensity: 0.2,
    particleColor: [0, 0.9, 0.9] as [number, number, number],
  },
  light: {
    accent: "#3b82f6",
    accentSecondary: "#8b5cf6",
    background: "#f8fafc",
    grid: "#e2e8f0",
    fogColor: "#f8fafc",
    ambientIntensity: 0.6,
    particleColor: [0.23, 0.51, 0.96] as [number, number, number],
  },
};

function SceneContent({ mouseX = 0, mouseY = 0, isDark = true }: SceneProps) {
  const colors = isDark ? themeColors.dark : themeColors.light;

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 8]}
        fov={50}
      />

      {/* Ambient lighting */}
      <ambientLight intensity={colors.ambientIntensity} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 0.5 : 0.8} color={colors.accent} />
      <pointLight position={[-10, -10, -10]} intensity={isDark ? 0.3 : 0.5} color={colors.accentSecondary} />

      {/* Main floating mesh */}
      <FloatingMesh
        mouseX={mouseX}
        mouseY={mouseY}
        accentColor={colors.accent}
        secondaryColor={colors.accentSecondary}
      />

      {/* Grid floor */}
      <GridFloor
        accentColor={colors.accent}
        gridColor={colors.grid}
        backgroundColor={colors.background}
      />

      {/* Particle field */}
      <ParticleField
        count={300}
        baseColor={colors.particleColor}
        isDark={isDark}
      />

      {/* Fog for depth */}
      <fog attach="fog" args={[colors.fogColor, isDark ? 5 : 8, isDark ? 30 : 40]} />
    </>
  );
}

export function Scene({ mouseX = 0, mouseY = 0, isDark = true }: SceneProps) {
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
          <SceneContent mouseX={mouseX} mouseY={mouseY} isDark={isDark} />
        </Suspense>
      </Canvas>
    </div>
  );
}
