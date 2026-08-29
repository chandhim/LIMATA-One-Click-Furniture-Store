"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, X, RefreshCw, Check, AlertCircle } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [guidanceMsg, setGuidanceMsg] = useState<string>("📷 Capture your room. Step back to include the floor and keep your main furniture fully visible.");
  
  const stopTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopTracks();
      if (capturedPreview) {
        URL.revokeObjectURL(capturedPreview);
      }
    };
  }, [stopTracks, capturedPreview]);

  const startCamera = async () => {
    setHasPermission(null);
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
    } catch (error: unknown) {
      const err = error as Error;
      setHasPermission(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMsg("Camera access was blocked. You can allow camera access in your browser settings or upload a photo instead.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorMsg("We couldn't access a camera on this device. You can upload a room photo instead.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setErrorMsg("The camera is currently unavailable. Please try again or upload a photo instead.");
      } else {
        setErrorMsg("Camera access is needed to take a room photo. Please allow access or upload a photo instead.");
      }
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  // Simple brightness heuristic loop
  useEffect(() => {
    if (!hasPermission || isCapturing || capturedBlob) return;
    
    let animationFrameId: number;
    let lastCheckTime = 0;
    
    const checkBrightness = (time: number) => {
      if (time - lastCheckTime > 1000) { // check roughly every second
        lastCheckTime = time;
        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            // Use a tiny canvas for brightness check to be lightweight
            const ctx = canvas.getContext("2d");
            if (ctx) {
              canvas.width = 32;
              canvas.height = 32;
              ctx.drawImage(video, 0, 0, 32, 32);
              const imageData = ctx.getImageData(0, 0, 32, 32);
              let sum = 0;
              for (let i = 0; i < imageData.data.length; i += 4) {
                // simple luminance
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];
                sum += 0.299 * r + 0.587 * g + 0.114 * b;
              }
              const avg = sum / (32 * 32);
              
              if (avg < 40) {
                setGuidanceMsg("💡 More light would help.");
              } else {
                setGuidanceMsg("✓ Good lighting — ready to capture.");
              }
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(checkBrightness);
    };
    
    animationFrameId = requestAnimationFrame(checkBrightness);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasPermission, isCapturing, capturedBlob]);

  const handleCapture = () => {
    if (videoRef.current) {
      setIsCapturing(true);
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            setCapturedBlob(blob);
            setCapturedPreview(URL.createObjectURL(blob));
            stopTracks();
          }
          setIsCapturing(false);
        }, "image/jpeg", 0.9);
      } else {
        setIsCapturing(false);
      }
    }
  };

  const handleRetake = () => {
    if (capturedPreview) {
      URL.revokeObjectURL(capturedPreview);
    }
    setCapturedBlob(null);
    setCapturedPreview(null);
    setGuidanceMsg("📷 Capture your room. Step back to include the floor and keep your main furniture fully visible.");
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedBlob) {
      const file = new File([capturedBlob], "room-capture.jpg", { type: "image/jpeg" });
      onCapture(file);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4/3",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--border)",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        onClick={onCancel}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          zIndex: 10,
          background: "rgba(0,0,0,0.5)",
          border: "none",
          borderRadius: "50%",
          padding: "0.5rem",
          color: "#fff",
          cursor: "pointer",
        }}
        aria-label="Close Camera"
      >
        <X size={20} />
      </button>

      {hasPermission === false ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#fff", maxWidth: "80%" }}>
          <AlertCircle size={32} style={{ marginBottom: "1rem", opacity: 0.8, marginInline: "auto" }} />
          <p style={{ lineHeight: 1.5 }}>{errorMsg}</p>
          <button
            onClick={onCancel}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
              background: "var(--bg-base)",
              color: "var(--fg-primary)",
              border: "none",
              borderRadius: "var(--radius-full)",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Go Back
          </button>
        </div>
      ) : !capturedPreview ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              right: "4rem",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.85rem",
              lineHeight: 1.4,
              pointerEvents: "none"
            }}
          >
            {guidanceMsg}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "1.5rem",
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <button
              onClick={handleCapture}
              disabled={isCapturing}
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                border: "4px solid rgba(0,0,0,0.2)",
                cursor: isCapturing ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                transition: "transform 0.1s"
              }}
              aria-label="Capture Photo"
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <Camera size={24} color="#000" />
            </button>
          </div>
        </>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={capturedPreview}
            alt="Captured Room"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
            }}
          >
            <h3 style={{ color: "white", fontSize: "1.25rem", fontWeight: 600, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
              Does this photo look good?
            </h3>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={handleRetake}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(4px)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: "var(--radius-full)",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <RefreshCw size={18} /> Retake
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "var(--accent)",
                  color: "var(--accent-fg, #fff)",
                  border: "none",
                  borderRadius: "var(--radius-full)",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <Check size={18} /> Use this photo
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
