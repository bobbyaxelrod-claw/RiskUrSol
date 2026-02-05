import React, { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface GameState {
  multiplier: number;
  isRunning: boolean;
  elapsedTime: number;
  crashPoint: number;
  roundNumber: number;
}

export function CrashGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>({
    multiplier: 1.0,
    isRunning: false,
    elapsedTime: 0,
    crashPoint: 2.5,
    roundNumber: 0,
  });

  const [gameState, setGameState] = useState<GameState>(gameStateRef.current);
  const [wagerAmount, setWagerAmount] = useState("0.1");
  const [autoCashout, setAutoCashout] = useState("2.0");
  const [hasBet, setHasBet] = useState(false);
  const [bettingPhase, setBettingPhase] = useState(true);
  const [bettingTimeLeft, setBettingTimeLeft] = useState(6);

  const { data: currentRound } = trpc.game.getCurrentRound.useQuery();
  const placeBetMutation = trpc.game.placeBet.useMutation();
  const cashOutMutation = trpc.game.cashOut.useMutation();

  // Initialize canvas and game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const gameLoop = () => {
      // Clear canvas with dark background
      ctx.fillStyle = "#0a0e27";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid background
      ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      if (gameStateRef.current.isRunning) {
        // Update game state
        gameStateRef.current.elapsedTime += 0.016; // ~60fps
        gameStateRef.current.multiplier = Math.exp(0.06 * gameStateRef.current.elapsedTime);

        // Check if crashed
        if (gameStateRef.current.multiplier >= gameStateRef.current.crashPoint) {
          gameStateRef.current.isRunning = false;
          gameStateRef.current.multiplier = gameStateRef.current.crashPoint;
          setBettingPhase(true);
          setBettingTimeLeft(6);
          toast.error("Game Crashed!");
        }

        setGameState({ ...gameStateRef.current });

        // Draw crash curve
        ctx.strokeStyle = "#00ff88";
        ctx.lineWidth = 3;
        ctx.beginPath();

        for (let i = 0; i < canvas.width; i += 2) {
          const t = (i / canvas.width) * 10; // 10 second max
          const multiplier = Math.exp(0.06 * t);
          const y = canvas.height - multiplier * 20;

          if (i === 0) {
            ctx.moveTo(i, y);
          } else {
            ctx.lineTo(i, y);
          }

          // Stop drawing if we've reached the crash point
          if (multiplier >= gameStateRef.current.crashPoint) break;
        }
        ctx.stroke();

        // Draw current position
        const currentX = (gameStateRef.current.elapsedTime / 10) * canvas.width;
        const currentY = canvas.height - gameStateRef.current.multiplier * 20;

        ctx.fillStyle = "#ff00ff";
        ctx.beginPath();
        ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw multiplier text
      ctx.fillStyle = gameStateRef.current.isRunning ? "#00ff88" : "#ff00ff";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `${gameStateRef.current.multiplier.toFixed(2)}x`,
        canvas.width / 2,
        100
      );

      // Draw status
      ctx.fillStyle = "#00ffff";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      const status = gameStateRef.current.isRunning ? "RUNNING" : "WAITING";
      ctx.fillText(status, canvas.width / 2, canvas.height - 20);

      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }, []);

  // Betting phase countdown
  useEffect(() => {
    if (!bettingPhase) return;

    const interval = setInterval(() => {
      setBettingTimeLeft((prev) => {
        if (prev <= 1) {
          setBettingPhase(false);
          gameStateRef.current.isRunning = true;
          gameStateRef.current.elapsedTime = 0;
          gameStateRef.current.multiplier = 1.0;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [bettingPhase]);

  const handlePlaceBet = async () => {
    try {
      await placeBetMutation.mutateAsync({
        wagerAmount,
        autoCashoutLimit: autoCashout,
      });
      setHasBet(true);
      toast.success("Bet placed!");
    } catch (error) {
      toast.error("Failed to place bet");
    }
  };

  const handleCashOut = async () => {
    if (!currentRound) return;

    try {
      await cashOutMutation.mutateAsync({
        roundId: currentRound.id,
        multiplier: gameStateRef.current.multiplier,
      });
      setHasBet(false);
      toast.success(`Cashed out at ${gameStateRef.current.multiplier.toFixed(2)}x!`);
    } catch (error) {
      toast.error("Failed to cash out");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Canvas Game Display */}
      <Card className="bg-[#0a0e27] border-cyan-500/30 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-96 bg-[#0a0e27]"
        />
      </Card>

      {/* Betting Controls */}
      <Card className="bg-[#0f1535] border-cyan-500/30 p-6 space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-cyan-400">
            {bettingPhase ? `Betting Phase: ${bettingTimeLeft}s` : "Game Running"}
          </h3>
        </div>

        {bettingPhase && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-cyan-300">Wager Amount (SOL)</label>
              <Input
                type="number"
                value={wagerAmount}
                onChange={(e) => setWagerAmount(e.target.value)}
                placeholder="0.1"
                className="bg-[#1a1f3a] border-cyan-500/30 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-cyan-300">Auto Cashout Multiplier</label>
              <Input
                type="number"
                value={autoCashout}
                onChange={(e) => setAutoCashout(e.target.value)}
                placeholder="2.0"
                className="bg-[#1a1f3a] border-cyan-500/30 text-white"
              />
            </div>

            <Button
              onClick={handlePlaceBet}
              disabled={hasBet || placeBetMutation.isPending}
              className="w-full bg-gradient-to-r from-cyan-500 to-magenta-500 hover:from-cyan-600 hover:to-magenta-600 text-white font-bold"
            >
              {placeBetMutation.isPending ? "Placing..." : "Place Bet"}
            </Button>
          </div>
        )}

        {!bettingPhase && hasBet && (
          <Button
            onClick={handleCashOut}
            disabled={cashOutMutation.isPending}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg py-6"
          >
            {cashOutMutation.isPending ? "Cashing Out..." : `Cash Out at ${gameStateRef.current.multiplier.toFixed(2)}x`}
          </Button>
        )}
      </Card>

      {/* Game Info */}
      <Card className="bg-[#0f1535] border-cyan-500/30 p-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-cyan-400">Crash Point</p>
          <p className="text-xl font-bold text-magenta-400">{gameStateRef.current.crashPoint.toFixed(2)}x</p>
        </div>
        <div>
          <p className="text-xs text-cyan-400">Round Number</p>
          <p className="text-xl font-bold text-cyan-400">{currentRound?.roundNumber || 0}</p>
        </div>
      </Card>
    </div>
  );
}
