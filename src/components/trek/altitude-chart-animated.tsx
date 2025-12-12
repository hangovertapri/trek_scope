'use client';

import { useEffect, useRef } from 'react';
import type { ItineraryItem } from '@/lib/types';

interface AltitudeChartAnimatedProps {
  itinerary: ItineraryItem[];
  difficulty: string;
}

export default function AltitudeChartAnimated({
  itinerary,
  difficulty,
}: AltitudeChartAnimatedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chartData = itinerary.filter((item) => item.altitude !== undefined);
    if (chartData.length === 0) return;

    let animationProgress = 0;
    let animationFrameId: number;

    const animate = () => {
      // Resize canvas
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const width = canvas.width;
      const height = canvas.height;
      const padding = { top: 40, right: 20, bottom: 50, left: 60 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      // Background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;

      // Find min/max altitude
      const altitudes = chartData.map((d) => d.altitude || 0);
      const minAlt = Math.min(...altitudes);
      const maxAlt = Math.max(...altitudes);
      const altRange = maxAlt - minAlt || 1000;

      // Draw horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        // Y-axis labels
        const altValue = maxAlt - (altRange / 5) * i;
        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(altValue)}m`, padding.left - 10, y + 4);
      }

      // Draw vertical grid lines
      for (let i = 0; i < chartData.length; i++) {
        const x = padding.left + (chartWidth / (chartData.length - 1 || 1)) * i;
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, height - padding.bottom);
        ctx.stroke();

        // X-axis labels
        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Day ${chartData[i].day}`, x, height - padding.bottom + 20);
      }

      // Animate progress
      animationProgress = Math.min(animationProgress + 0.02, 1);

      // Draw altitude area with animation
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let i = 0; i < chartData.length; i++) {
        const x =
          padding.left + (chartWidth / (chartData.length - 1 || 1)) * i;
        const altitude = chartData[i].altitude || 0;
        const normalizedAlt = (altitude - minAlt) / altRange;
        const y =
          padding.top +
          chartHeight * (1 - normalizedAlt) * animationProgress;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Close path for fill
      ctx.lineTo(
        padding.left +
          (chartWidth / (chartData.length - 1 || 1)) *
            (chartData.length - 1),
        height - padding.bottom
      );
      ctx.lineTo(padding.left, height - padding.bottom);
      ctx.closePath();
      ctx.fill();

      // Draw altitude line
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let i = 0; i < chartData.length; i++) {
        const x =
          padding.left + (chartWidth / (chartData.length - 1 || 1)) * i;
        const altitude = chartData[i].altitude || 0;
        const normalizedAlt = (altitude - minAlt) / altRange;
        const y =
          padding.top +
          chartHeight * (1 - normalizedAlt) * animationProgress;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw difficulty indicator curve overlay
      const difficultyColor = getDifficultyColor(difficulty);
      ctx.strokeStyle = difficultyColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();

      for (let i = 0; i < chartData.length; i++) {
        const x =
          padding.left + (chartWidth / (chartData.length - 1 || 1)) * i;
        const difficultyValue =
          getDifficultyValue(difficulty) * animationProgress;

        // Create a curve that peaks in the middle
        const midpoint = chartData.length / 2;
        const distance = Math.abs(i - midpoint) / midpoint;
        const curveHeight = (1 - distance * distance) * difficultyValue;

        const y =
          padding.top + chartHeight * 0.3 - curveHeight * (chartHeight * 0.2);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw difficulty legend
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.fillText('Difficulty Curve:', padding.left, 20);

      ctx.font = '11px sans-serif';
      ctx.strokeStyle = difficultyColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding.left + 150, 12);
      ctx.lineTo(padding.left + 170, 12);
      ctx.stroke();
      ctx.fillStyle = difficultyColor;
      ctx.fillText(difficulty, padding.left + 175, 16);

      // Draw altitude legend
      ctx.font = '11px sans-serif';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding.left + 290, 12);
      ctx.lineTo(padding.left + 310, 12);
      ctx.stroke();
      ctx.fillStyle = '#1e293b';
      ctx.fillText('Altitude Profile', padding.left + 315, 16);

      // Draw points on chart
      ctx.fillStyle = '#3b82f6';
      for (let i = 0; i < chartData.length; i++) {
        const x =
          padding.left + (chartWidth / (chartData.length - 1 || 1)) * i;
        const altitude = chartData[i].altitude || 0;
        const normalizedAlt = (altitude - minAlt) / altRange;
        const y =
          padding.top +
          chartHeight * (1 - normalizedAlt) * animationProgress;

        if (animationProgress > (i / chartData.length) * 0.9) {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Continue animation until complete
      if (animationProgress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [itinerary, difficulty]);

  const chartData = itinerary.filter((item) => item.altitude !== undefined);
  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full border border-border rounded-lg bg-slate-50"
        style={{ height: '400px', display: 'block' }}
      />
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-sm text-blue-900 mb-2">
          💡 Chart Interpretation
        </h4>
        <p className="text-sm text-blue-800">
          <strong>Blue line:</strong> Actual altitude gain/loss each day.{' '}
          <strong>Dashed line:</strong> Difficulty intensity across trek days.
          Steeper sections indicate more challenging terrain.
        </p>
      </div>
    </div>
  );
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return '#22c55e'; // green
    case 'moderate':
      return '#f59e0b'; // amber
    case 'challenging':
      return '#ef4444'; // red
    case 'expert':
      return '#8b5cf6'; // violet
    default:
      return '#64748b'; // slate
  }
}

function getDifficultyValue(difficulty: string): number {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 0.3;
    case 'moderate':
      return 0.6;
    case 'challenging':
      return 0.85;
    case 'expert':
      return 1;
    default:
      return 0.5;
  }
}
