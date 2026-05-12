"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Box, FileImage, FileQuestion } from "lucide-react";
import Image from "next/image";

interface ProductViewer3DProps {
  imageUrl?: string | null;
  modelUrl?: string | null;
  name: string;
}

export function ProductViewer3D({
  imageUrl,
  modelUrl,
  name,
}: ProductViewer3DProps) {
  const interactiveModelUrl = useMemo(() => {
    if (!modelUrl) {
      return null;
    }

    const normalizedUrl = modelUrl.split("?")[0].toLowerCase();
    if (normalizedUrl.endsWith(".glb") || normalizedUrl.endsWith(".gltf")) {
      return modelUrl;
    }

    return null;
  }, [modelUrl]);

  const [modelLoaded, setModelLoaded] = useState(false);

  // Reset loading state when model URL changes
  useEffect(() => {
    setModelLoaded(false);
  }, [interactiveModelUrl]);

  if (interactiveModelUrl) {
    return (
      <div className="relative aspect-square bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border)]">
        <Canvas camera={{ position: [2.4, 1.8, 2.8], fov: 45 }}>
          <color attach="background" args={["#0a0a0a"]} />
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 8, 6]} intensity={1.5} />
          <Suspense fallback={null}>
            <Center>
              <PreviewModel modelUrl={interactiveModelUrl} onLoaded={() => setModelLoaded(true)} />
            </Center>
            <Environment preset="city" />
          </Suspense>
          <OrbitControls enablePan={false} minDistance={1.5} maxDistance={8} />
        </Canvas>

        {/* Loading spinner — visible until Suspense resolves */}
        {!modelLoaded && (
          <div
            aria-label="Loading 3D model"
            className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/80 z-10"
          >
            <div className="h-10 w-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          </div>
        )}

        <div className="absolute left-4 bottom-4 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-primary)]/85 backdrop-blur text-xs text-[var(--text-secondary)] flex items-center gap-2">
          <Box className="w-4 h-4 text-[var(--accent)]" />
          Interactive 3D preview
        </div>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="relative aspect-square bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border)]">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 560px"
          className="object-cover"
        />
        <div className="absolute left-4 bottom-4 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-primary)]/85 backdrop-blur text-xs text-[var(--text-secondary)] flex items-center gap-2">
          <FileImage className="w-4 h-4 text-[var(--accent)]" />
          Product preview
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-square bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border)] p-6 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 mb-4 border border-[var(--border)] rounded-full flex items-center justify-center">
        <FileQuestion className="w-8 h-8 text-[var(--text-muted)]" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Preview unavailable</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-xs">
        This product does not have a preview asset configured yet.
      </p>
      {modelUrl && (
        <p className="text-xs text-[var(--text-muted)] mt-4">
          A source file is stored for internal review.
        </p>
      )}
    </div>
  );
}

function PreviewModel({
  modelUrl,
  onLoaded,
}: {
  modelUrl: string;
  onLoaded: () => void;
}) {
  const { scene } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Once useGLTF resolves (Suspense lifts), signal the parent
  useEffect(() => {
    onLoaded();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <primitive object={clonedScene} scale={1} />;
}
