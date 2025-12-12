'use client';

import { useEffect, useRef } from 'react';

export function Terrain3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0f172a');
      bgGradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw terrain waves
      ctx.strokeStyle = '#2d5016';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(45, 80, 22, 0.3)';

      // Draw multiple terrain layers
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const amplitude = 30 + layer * 10;
        const frequency = 0.01 + layer * 0.005;

        for (let x = 0; x <= canvas.width; x += 5) {
          const wave = Math.sin((x * frequency) + time * 0.01 + layer * Math.PI / 3) * amplitude;
          const y = canvas.height * 0.5 + wave + layer * 30;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Draw mountain peaks
      ctx.fillStyle = '#4a7c59';
      ctx.strokeStyle = '#6ba576';
      ctx.lineWidth = 2;

      const peaks = [
        { x: canvas.width * 0.2, h: 120 },
        { x: canvas.width * 0.5, h: 150 },
        { x: canvas.width * 0.8, h: 100 },
      ];

      peaks.forEach((peak) => {
        const wobble = Math.sin(time * 0.005 + peak.x * 0.01) * 5;
        ctx.beginPath();
        ctx.moveTo(peak.x, canvas.height * 0.5);
        ctx.lineTo(peak.x + 40, canvas.height * 0.5 + peak.h + wobble);
        ctx.lineTo(peak.x - 40, canvas.height * 0.5 + peak.h + wobble);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // Draw snow caps
      ctx.fillStyle = '#ffffff';
      peaks.forEach((peak) => {
        ctx.beginPath();
        ctx.moveTo(peak.x, canvas.height * 0.5 + 10);
        ctx.lineTo(peak.x + 20, canvas.height * 0.5 + peak.h * 0.6);
        ctx.lineTo(peak.x - 20, canvas.height * 0.5 + peak.h * 0.6);
        ctx.closePath();
        ctx.fill();
      });

      time++;
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
      className="w-full h-80 bg-gradient-to-b from-slate-900 to-slate-950 rounded-lg border border-slate-700"
      style={{ display: 'block' }}
    />
  );
}
