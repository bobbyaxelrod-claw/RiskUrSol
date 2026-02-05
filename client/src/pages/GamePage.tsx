import { Link } from "wouter";
import { CrashGame } from "@/components/CrashGame";
import { Button } from "@/components/ui/button";
import { Zap, Coins, Shield, BarChart3, LogOut } from "lucide-react";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";

export default function GamePage() {
  const { user, isAuthenticated, logout } = usePrivyAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#080a14] via-[#0a0d1f] to-[#080a14] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 solana-gradient">Access Denied</h1>
          <p className="text-gray-400 mb-8">Please sign in to play the game.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080a14] via-[#0a0d1f] to-[#080a14] text-white">
      {/* Navigation */}
      <nav className="bg-[#14192d]/80 backdrop-blur border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold solana-gradient">
              RiskUrSol
            </a>
          </Link>
          <div className="flex gap-2 items-center">
            <Link href="/game">
              <Button variant="ghost" className="text-purple-400 hover:bg-purple-500/10">
                <Zap className="w-4 h-4 mr-2" />
                Game
              </Button>
            </Link>
            <Link href="/staking">
              <Button variant="ghost" className="text-green-400 hover:bg-green-500/10">
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
              <Button variant="ghost" className="text-purple-400 hover:bg-purple-500/10">
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={logout}
              className="text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 solana-gradient">
            Crash Game
          </h1>
          <p className="text-gray-400">
            Wallet: {user?.wallet ? `${user.wallet.substring(0, 6)}...${user.wallet.substring(user.wallet.length - 4)}` : "Not connected"}
          </p>
        </div>

        {/* Game Container */}
        <div className="bg-[#14192d]/60 border border-purple-500/30 rounded-lg p-6 neon-purple">
          <CrashGame />
        </div>

        {/* Game Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#14192d]/60 border border-purple-500/30 rounded-lg p-6 neon-purple">
            <h3 className="text-lg font-bold text-purple-400 mb-2">Current Multiplier</h3>
            <p className="text-3xl font-bold text-purple-300">1.00x</p>
          </div>
          <div className="bg-[#14192d]/60 border border-green-500/30 rounded-lg p-6 neon-green">
            <h3 className="text-lg font-bold text-green-400 mb-2">Your Balance</h3>
            <p className="text-3xl font-bold text-green-300">0 $RISK</p>
          </div>
          <div className="bg-[#14192d]/60 border border-cyan-500/30 rounded-lg p-6 neon-cyan">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">Total Wagered</h3>
            <p className="text-3xl font-bold text-cyan-300">0 $RISK</p>
          </div>
        </div>
      </main>
    </div>
  );
}
