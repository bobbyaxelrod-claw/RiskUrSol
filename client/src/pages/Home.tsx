import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Zap, Coins, Shield, BarChart3, TrendingUp, Lock } from "lucide-react";
import { AnimatedRiskToken } from "@/components/AnimatedRiskToken";
import { CrashGameAnimation } from "@/components/CrashGameAnimation";
import { useWalletAuth } from "@/hooks/useWalletAuth";

export default function Home() {
  const { user, isAuthenticated, isLoading, login } = useWalletAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080a14] via-[#0a0d1f] to-[#080a14] text-white">
      {/* Navigation */}
      <nav className="bg-[#14192d]/80 backdrop-blur border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold base-gradient">
            RiskUrUSDC
          </div>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <>
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
              </>
            ) : (
              <Button 
                onClick={login}
                className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white font-bold"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Animated Token */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 base-gradient">
              RiskUrUSDC Crash Protocol
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              Experience the ultimate crash betting platform with provably fair mechanics, real-time multipliers, and a 4-tier tokenomic system powered by $RISK.
            </p>

            {isAuthenticated ? (
              <Link href="/game">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white font-bold neon-purple">
                  <Zap className="w-5 h-5 mr-2" />
                  Play Now
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg"
                onClick={login}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white font-bold neon-purple"
              >
                {isLoading ? "Loading..." : "Get Started"}
              </Button>
            )}
          </div>

          {/* Right side - Animated Token */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-green-500/20 rounded-full blur-3xl" />
              <AnimatedRiskToken size={280} speed={3} />
            </div>
          </div>
        </div>
      </section>

      {/* Crash Game Animation Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 base-gradient">
            Exponential Multiplier Curve
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Watch the real-time crash game animation. The multiplier grows exponentially until it crashes at a predetermined point.
          </p>
        </div>
        <div className="flex justify-center">
          <CrashGameAnimation width={700} height={350} />
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center base-gradient">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-[#14192d]/60 border-purple-500/30 p-6 hover:border-purple-500/60 transition neon-purple">
            <Zap className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-bold text-purple-400 mb-2">Real-Time Crash Game</h3>
            <p className="text-gray-400">Experience exponential multiplier curves rendered at 144Hz with instant cash-out mechanics.</p>
          </Card>

          <Card className="bg-[#14192d]/60 border-green-500/30 p-6 hover:border-green-500/60 transition neon-green">
            <Lock className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-bold text-green-400 mb-2">Provably Fair</h3>
            <p className="text-gray-400">SHA-256 hash chain verification ensures every crash point is predetermined and verifiable.</p>
          </Card>

          <Card className="bg-[#14192d]/60 border-cyan-500/30 p-6 hover:border-cyan-500/60 transition neon-cyan">
            <Coins className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-lg font-bold text-cyan-400 mb-2">$RISK Tokenomics</h3>
            <p className="text-gray-400">4-tier fee split: 40% House, 35% Yield, 15% Growth, 10% Burn for sustainable economics.</p>
          </Card>

          <Card className="bg-[#14192d]/60 border-purple-500/30 p-6 hover:border-purple-500/60 transition neon-purple">
            <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-bold text-purple-400 mb-2">Staking Rewards</h3>
            <p className="text-gray-400">Lock $RISK tokens for 7-day cooldown periods and earn accumulated yield per share.</p>
          </Card>

          <Card className="bg-[#14192d]/60 border-green-500/30 p-6 hover:border-green-500/60 transition neon-green">
            <BarChart3 className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-bold text-green-400 mb-2">Live Statistics</h3>
            <p className="text-gray-400">Track total $RISK burned, staking APY, house pool balance, and compete on leaderboards.</p>
          </Card>

          <Card className="bg-[#14192d]/60 border-cyan-500/30 p-6 hover:border-cyan-500/60 transition neon-cyan">
            <Shield className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-lg font-bold text-cyan-400 mb-2">Admin Controls</h3>
            <p className="text-gray-400">Treasury management with restricted access and rebalancing capabilities for protocol health.</p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center base-gradient">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Place Bet", desc: "Enter your wager and set auto-cashout limits during the 6-second betting phase.", color: "purple" },
            { step: "2", title: "Watch Rise", desc: "The multiplier grows exponentially. Cash out anytime before the crash for your winnings.", color: "green" },
            { step: "3", title: "Crash Point", desc: "The predetermined crash point is derived from SHA-256 hash chain verification.", color: "cyan" },
            { step: "4", title: "Earn Rewards", desc: "Stake $RISK to earn yield from the protocol's 4-tier fee distribution system.", color: "purple" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className={`w-12 h-12 bg-gradient-to-r from-${item.color}-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg neon-${item.color}`}>
                {item.step}
              </div>
              <h3 className={`font-bold text-${item.color}-400 mb-2`}>{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-500/10 to-green-500/10 border border-purple-500/30 rounded-lg p-12 neon-purple">
          <h2 className="text-3xl font-bold mb-4 base-gradient">Ready to Play?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of players in the most exciting crash betting experience. Connect your wallet and start playing today.
          </p>
          {isAuthenticated ? (
            <Link href="/game">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white font-bold">
                <Zap className="w-5 h-5 mr-2" />
                Play Now
              </Button>
            </Link>
          ) : (
            <Button 
              size="lg"
              onClick={login}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white font-bold"
            >
              {isLoading ? "Loading..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#14192d]/80 border-t border-purple-500/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400">
          <p>RiskUrUSDC Crash Protocol © 2026. Provably fair, community-driven, decentralized.</p>
        </div>
      </footer>
    </div>
  );
}
