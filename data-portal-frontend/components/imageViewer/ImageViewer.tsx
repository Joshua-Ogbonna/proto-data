"use client";

import { useState, useEffect, useRef } from "react";

export default function ImageViewer({ imagePath }: { imagePath: string }) {
  const [scale, setScale] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Add watermark
      ctx.font = "20px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText("Sample Data - Not for Distribution", 20, 40);
    };
  }, [imagePath]);

  return (
    <div className="relative h-[400px] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            transform: `scale(${scale})`,
            transition: "transform 0.2s",
          }}
        />
      </div>
      <div className="absolute bottom-4 right-4 space-x-2">
        <button
          onClick={handleZoomIn}
          className="bg-white p-2 rounded-full shadow"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white p-2 rounded-full shadow"
        >
          -
        </button>
      </div>
    </div>
  );
}
