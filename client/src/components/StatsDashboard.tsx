import React from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { TrendingUp, Flame, Trophy } from "lucide-react";

export function StatsDashboard() {
  const { data: stats } = trpc.stats.getStatistics.useQuery();
  const { data: leaderboard } = trpc.stats.getLeaderboard.useQuery({ limit: 10 });
  const { data: feeDistribution } = trpc.treasury.getFeeDistribution.useQuery();

  return (
    <div className="w-full space-y-6">
      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0f1535] border-cyan-500/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-400 uppercase">Total Burned</p>
              <p className="text-2xl font-bold text-cyan-400">{stats?.totalRiskBurned.toFixed(0) || "0"} RISK</p>
            </div>
            <Flame className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-[#0f1535] border-cyan-500/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-400 uppercase">Staking APY</p>
              <p className="text-2xl font-bold text-green-400">{stats?.stakingAPY || "0"}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-[#0f1535] border-cyan-500/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-400 uppercase">House Pool</p>
              <p className="text-2xl font-bold text-magenta-400">{feeDistribution?.houseVault.balance.toFixed(2) || "0"} SOL</p>
            </div>
            <Trophy className="w-8 h-8 text-magenta-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-[#0f1535] border-cyan-500/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-400 uppercase">Yield Distributed</p>
              <p className="text-2xl font-bold text-yellow-400">{stats?.totalYieldDistributed.toFixed(2) || "0"} SOL</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Fee Distribution Visualization */}
      <Card className="bg-[#0f1535] border-cyan-500/30 p-6">
        <h3 className="text-lg font-bold text-cyan-400 mb-4">4-Tier Fee Distribution</h3>
        <div className="space-y-3">
          {[
            { name: "House Vault", percentage: 40, balance: feeDistribution?.houseVault.balance || 0, color: "from-cyan-500 to-cyan-600" },
            { name: "Yield Vault", percentage: 35, balance: feeDistribution?.yieldVault.balance || 0, color: "from-green-500 to-green-600" },
            { name: "Growth Vault", percentage: 15, balance: feeDistribution?.growthVault.balance || 0, color: "from-yellow-500 to-yellow-600" },
            { name: "Burn Vault", percentage: 10, balance: feeDistribution?.burnVault.balance || 0, color: "from-red-500 to-red-600" },
          ].map((vault) => (
            <div key={vault.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-300">{vault.name}</span>
                <span className="text-sm font-bold text-cyan-300">{vault.balance.toFixed(4)} SOL ({vault.percentage}%)</span>
              </div>
              <div className="w-full bg-[#1a1f3a] rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${vault.color}`}
                  style={{ width: `${vault.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Leaderboard */}
      <Card className="bg-[#0f1535] border-cyan-500/30 p-6">
        <h3 className="text-lg font-bold text-cyan-400 mb-4">Top Winners</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-500/20">
                <th className="text-left py-2 text-cyan-400">Rank</th>
                <th className="text-left py-2 text-cyan-400">Player</th>
                <th className="text-right py-2 text-cyan-400">Total Payout</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard && leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <tr key={entry.userId} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                    <td className="py-3 text-magenta-400 font-bold">#{index + 1}</td>
                    <td className="py-3 text-cyan-300">{entry.userName}</td>
                    <td className="text-right py-3 text-green-400 font-bold">{entry.totalPayout.toFixed(4)} SOL</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-400">No winners yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
