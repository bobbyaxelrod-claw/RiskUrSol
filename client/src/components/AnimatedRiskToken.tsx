import { useEffect, useRef } from "react";

interface AnimatedRiskTokenProps {
  size?: number;
  speed?: number;
}

export function AnimatedRiskToken({ size = 200, speed = 4 }: AnimatedRiskTokenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;

    const draw = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = size / 2 - 10;

      // Clear canvas
      ctx.fillStyle = "rgba(8, 10, 20, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw outer glow
      const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius + 20);
      glowGradient.addColorStop(0, "rgba(159, 122, 234, 0.3)");
      glowGradient.addColorStop(0.5, "rgba(20, 241, 149, 0.15)");
      glowGradient.addColorStop(1, "rgba(0, 255, 255, 0)");
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2);
      ctx.fill();

      // Save context for rotation
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Draw main circle with gradient
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, "rgba(159, 122, 234, 0.8)");
      gradient.addColorStop(0.7, "rgba(20, 241, 149, 0.6)");
      gradient.addColorStop(1, "rgba(0, 255, 255, 0.4)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = "rgba(159, 122, 234, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw rotating rings
      ctx.strokeStyle = "rgba(20, 241, 149, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(0, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
      ctx.stroke();

      // Draw $ symbol
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = `bold ${radius * 0.8}px 'Nano Banana Pro', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", 0, 0);

      // Draw RISK text
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = `bold ${radius * 0.25}px 'Nano Banana Pro', sans-serif`;
      ctx.fillText("RISK", 0, radius * 0.6);

      // Draw rotating particles
      ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const x = Math.cos(angle) * (radius + 15);
        const y = Math.sin(angle) * (radius + 15);
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Update rotation
      rotation += (Math.PI * 2) / (speed * 60); // Adjust speed based on frame rate

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [size, speed]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="drop-shadow-2xl"
        style={{
          filter: "drop-shadow(0 0 30px rgba(159, 122, 234, 0.5))",
        }}
      />
    </div>
  );
}
