"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PresentationControls, useGLTF, Html, Center } from "@react-three/drei";
import { Loader2 } from "lucide-react";

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

interface Product3DViewerProps {
  modelUrl?: string | null;
}

export function Product3DViewer({ modelUrl }: Product3DViewerProps) {
  const fetchUrl = modelUrl
    ? modelUrl.replace(
        "https://pub-cc6bc0ad895f4273912e59614e1effe0.r2.dev/models",
        "/r2-models",
      )
    : null;

  useEffect(() => {
    if (fetchUrl) {
      useGLTF.preload(fetchUrl);
    }
  }, [fetchUrl]);

  if (!modelUrl) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          background: "var(--bg-surface)",
          border: "1px dashed var(--border-strong)",
          borderRadius: "var(--radius-xl)",
          gap: "1rem",
        }}
      >
        <div style={{ fontSize: "2.5rem" }}>🧊</div>
        <p style={{ color: "var(--fg-secondary)", fontWeight: 500 }}>
          3D Model Not Available
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        background: "linear-gradient(135deg, #FDFCFB 0%, #E2D1C3 100%)",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
      }}
    >
      <Canvas shadows={false} dpr={[1, 1.5]} camera={{ position: [0, 0, 4], fov: 50 }}>
        <Suspense
          fallback={
            <Html center>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  color: "var(--fg-primary)",
                }}
              >
                <Loader2
                  size={24}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                <span style={{ whiteSpace: "nowrap" }}>Loading 3D...</span>
              </div>
            </Html>
          }
        >
          <PresentationControls
            global
            rotation={[0, -0.5, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <Environment preset="city" />
            <Center>
              <Model url={fetchUrl!} />
            </Center>
          </PresentationControls>
        </Suspense>
      </Canvas>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
