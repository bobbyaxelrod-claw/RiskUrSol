import { useEffect, useRef } from "react";

interface CrashGameAnimationProps {
  width?: number;
  height?: number;
}

export function CrashGameAnimation({ width = 600, height = 300 }: CrashGameAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const cycleDuration = 5000; // 5 second cycle

    const draw = () => {
      const elapsed = (Date.now() % cycleDuration) / 1000;
      const progress = elapsed / 5; // 0 to 1

      // Clear canvas with gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, "rgba(8, 10, 20, 0.5)");
      bgGradient.addColorStop(1, "rgba(20, 25, 50, 0.3)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = "rgba(159, 122, 234, 0.1)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let i = 0; i <= width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i <= height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Draw axes
      ctx.strokeStyle = "rgba(159, 122, 234, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, height - 50);
      ctx.lineTo(width - 20, height - 50);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(50, height - 50);
      ctx.lineTo(50, 20);
      ctx.stroke();

      // Draw axis labels
      ctx.fillStyle = "rgba(159, 122, 234, 0.7)";
      ctx.font = "12px 'Nano Banana Pro', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Time", width - 40, height - 20);
      ctx.save();
      ctx.translate(15, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.fillText("Multiplier", 0, 0);
      ctx.restore();

      // Draw crash curve
      const startX = 50;
      const startY = height - 50;
      const endX = width - 20;
      const curveHeight = height - 70;

      ctx.strokeStyle = "rgba(20, 241, 149, 0.8)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, startY);

      // Exponential curve: y = e^(0.06 * x)
      const pointCount = Math.floor((endX - startX) * progress);
      for (let i = 0; i <= pointCount; i++) {
        const ratio = i / (endX - startX);
        const x = startX + (endX - startX) * ratio;
        const multiplier = Math.exp(0.06 * (ratio * 100));
        const maxMultiplier = Math.exp(6);
        const normalizedY = Math.min(multiplier / maxMultiplier, 1);
        const y = startY - normalizedY * curveHeight;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw crash point indicator
      if (progress > 0.3 && progress < 0.8) {
        const crashPoint = 0.5 + Math.sin(progress * Math.PI * 2) * 0.2;
        const crashX = startX + (endX - startX) * crashPoint;
        const crashMultiplier = Math.exp(0.06 * (crashPoint * 100));
        const maxMultiplier = Math.exp(6);
        const normalizedY = Math.min(crashMultiplier / maxMultiplier, 1);
        const crashY = startY - normalizedY * curveHeight;

        // Draw crash indicator
        ctx.fillStyle = "rgba(255, 71, 87, 0.8)";
        ctx.beginPath();
        ctx.arc(crashX, crashY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw crash glow
        ctx.fillStyle = "rgba(255, 71, 87, 0.3)";
        ctx.beginPath();
        ctx.arc(crashX, crashY, 15, 0, Math.PI * 2);
        ctx.fill();

        // Draw crash text
        ctx.fillStyle = "rgba(255, 71, 87, 0.9)";
        ctx.font = "bold 16px 'Nano Banana Pro', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("CRASH!", crashX, crashY - 25);
      }

      // Draw current multiplier value
      if (progress > 0) {
        const currentRatio = Math.min(progress, 0.95);
        const currentMultiplier = Math.exp(0.06 * (currentRatio * 100));
        const maxMultiplier = Math.exp(6);
        const normalizedY = Math.min(currentMultiplier / maxMultiplier, 1);
        const currentX = startX + (endX - startX) * currentRatio;
        const currentY = startY - normalizedY * curveHeight;

        // Draw current point
        ctx.fillStyle = "rgba(0, 255, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw multiplier value
        ctx.fillStyle = "rgba(0, 255, 255, 0.9)";
        ctx.font = "bold 20px 'Nano Banana Pro', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${currentMultiplier.toFixed(2)}x`, currentX, currentY - 20);
      }

      // Draw legend
      ctx.fillStyle = "rgba(159, 122, 234, 0.6)";
      ctx.font = "12px 'Nano Banana Pro', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Crash Game Multiplier Curve", 60, 30);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [width, height]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg border border-solana-purple/30 bg-card/50"
        style={{
          filter: "drop-shadow(0 0 20px rgba(159, 122, 234, 0.3))",
        }}
      />
    </div>
  );
}
