"use client";

import { useEffect, useRef, useState } from "react";
import type { DrawingPath, Point } from "../types";

interface DrawingCanvasProps {
  color: string;
  brushSize: number;
  paths: DrawingPath[];
  onPathsChange: (paths: DrawingPath[]) => void;
}

export function DrawingCanvas({ color, brushSize, paths, onPathsChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  // キャンバスを描画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 保存されたパスを描画
    paths.forEach((path) => {
      if (path.points.length < 2) return;

      ctx.strokeStyle = path.settings.color;
      ctx.lineWidth = path.settings.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);

      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }

      ctx.stroke();
    });

    // 現在描画中のパス
    if (currentPath.length > 1) {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);

      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }

      ctx.stroke();
    }
  }, [paths, currentPath, color, brushSize]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    setCurrentPath([pos]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    setCurrentPath((prev) => [...prev, pos]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    if (currentPath.length > 1) {
      const newPath: DrawingPath = {
        points: currentPath,
        settings: { color, size: brushSize },
      };
      onPathsChange([...paths, newPath]);
    }

    setIsDrawing(false);
    setCurrentPath([]);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full max-w-full rounded-lg border-4 border-gray-300 bg-white shadow-lg"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ cursor: "crosshair", touchAction: "none" }}
      />
      {paths.length === 0 && !isDrawing && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="font-bold text-2xl text-gray-400">
            マウスを おして うごかして えを かこう！
          </p>
        </div>
      )}
    </div>
  );
}
