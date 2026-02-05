import React from "react";
import { Link } from "wouter";
import { StatsDashboard } from "@/components/StatsDashboard";
import { Button } from "@/components/ui/button";
import { Zap, Coins, Shield, BarChart3 } from "lucide-react";

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-[#0a0e27] text-white">
      {/* Navigation */}
      <nav className="bg-[#0f1535] border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
              RiskUrUSDC
            </a>
          </Link>
          <div className="flex gap-2">
            <Link href="/game">
              <Button variant="ghost" className="text-cyan-400 hover:bg-cyan-500/10">
                <Zap className="w-4 h-4 mr-2" />
                Game
              </Button>
            </Link>
            <Link href="/staking">
              <Button variant="ghost" className="text-cyan-400 hover:bg-cyan-500/10">
                <Coins className="w-4 h-4 mr-2" />
                Staking
              </Button>
            </Link>
            <Link href="/stats">
              <Button variant="ghost" className="text-cyan-400 hover:bg-cyan-500/10">
                <BarChart3 className="w-4 h-4 mr-2" />
                Stats
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" className="text-magenta-400 hover:bg-magenta-500/10">
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Statistics & Leaderboard
          </h1>
          <p className="text-gray-400">Protocol metrics, fee distribution, and top winners.</p>
        </div>

        <StatsDashboard />
      </main>
    </div>
  );
}
