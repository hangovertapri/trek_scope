'use client';

import { useEffect, useRef } from 'react';

export function AnimatedMountains() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const animate = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center of canvas
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation);

      // Draw mountain (brown triangle)
      ctx.fillStyle = '#8b4513';
      ctx.strokeStyle = '#d4a574';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -80);
      ctx.lineTo(60, 60);
      ctx.lineTo(-60, 60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Snow peak (white)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, -80);
      ctx.lineTo(15, -20);
      ctx.lineTo(-15, -20);
      ctx.closePath();
      ctx.fill();

      // Floating particles (orange)
      ctx.fillStyle = 'rgba(255, 165, 0, 0.6)';
      for (let i = 0; i < 15; i++) {
        const angle = (rotation + (i * Math.PI * 2) / 15) * 2;
        const x = Math.cos(angle) * 100;
        const y = Math.sin(angle) * 100;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      rotation += 0.002;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-96 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-slate-700"
      style={{ display: 'block' }}
    />
  );
}
