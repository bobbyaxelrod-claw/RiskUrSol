import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Unlock } from "lucide-react";

export function StakingInterface() {
  const [stakeAmount, setStakeAmount] = useState("");
  const { data: stakingInfo } = trpc.staking.getStakingInfo.useQuery();
  const stakeMutation = trpc.staking.stake.useMutation();
  const unstakeMutation = trpc.staking.unstake.useMutation();

  const handleStake = async () => {
    if (!stakeAmount) {
      toast.error("Please enter an amount");
      return;
    }

    try {
      await stakeMutation.mutateAsync({ amount: stakeAmount });
      toast.success("Tokens staked successfully!");
      setStakeAmount("");
    } catch (error) {
      toast.error("Failed to stake tokens");
    }
  };

  const handleUnstake = async (recordId: number) => {
    try {
      await unstakeMutation.mutateAsync({ recordId });
      toast.success("Unstaking initiated. 7-day cooldown started.");
    } catch (error) {
      toast.error("Failed to unstake");
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  };

  const isUnstakingReady = (cooldownEndsAt: Date | null) => {
    if (!cooldownEndsAt) return false;
    return new Date() >= new Date(cooldownEndsAt);
  };

  return (
    <div className="w-full space-y-6">
      {/* Staking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0f1535] border-cyan-500/30 p-4">
          <p className="text-xs text-cyan-400 uppercase">Total Staked</p>
          <p className="text-2xl font-bold text-cyan-400">{stakingInfo?.totalStaked.toFixed(2) || "0.00"} RISK</p>
        </Card>
        <Card className="bg-[#0f1535] border-cyan-500/30 p-4">
          <p className="text-xs text-cyan-400 uppercase">Staking APY</p>
          <p className="text-2xl font-bold text-green-400">12.5%</p>
        </Card>
        <Card className="bg-[#0f1535] border-cyan-500/30 p-4">
          <p className="text-xs text-cyan-400 uppercase">Yield Accumulated</p>
          <p className="text-2xl font-bold text-magenta-400">0.00 USDC</p>
        </Card>
      </div>

      {/* Staking Controls */}
      <Card className="bg-[#0f1535] border-cyan-500/30 p-6 space-y-4">
        <h3 className="text-lg font-bold text-cyan-400">Stake $RISK Tokens</h3>
        <p className="text-sm text-gray-400">Lock your tokens to earn a share of the protocol's yield vault. Unstaking requires a 7-day cooldown period.</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-cyan-300">Amount to Stake</label>
            <Input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="0.00"
              className="bg-[#1a1f3a] border-cyan-500/30 text-white mt-2"
            />
          </div>

          <Button
            onClick={handleStake}
            disabled={stakeMutation.isPending || !stakeAmount}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold"
          >
            {stakeMutation.isPending ? "Staking..." : "Stake Tokens"}
          </Button>
        </div>
      </Card>

      {/* Active Stakes */}
      <Card className="bg-[#0f1535] border-cyan-500/30 p-6">
        <h3 className="text-lg font-bold text-cyan-400 mb-4">Your Stakes</h3>

        {!stakingInfo?.records || stakingInfo.records.length === 0 ? (
          <p className="text-sm text-gray-400">No active stakes</p>
        ) : (
          <div className="space-y-3">
            {stakingInfo.records.map((record) => (
              <div key={record.id} className="bg-[#1a1f3a] border border-cyan-500/20 rounded p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {record.status === "active" ? (
                      <Lock className="w-4 h-4 text-green-400" />
                    ) : (
                      <Unlock className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="text-sm font-bold text-cyan-300">
                      {record.amount.toFixed(2)} RISK
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    record.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {record.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                  <div>
                    <p>Staked</p>
                    <p className="text-cyan-300">{formatDate(record.stakedAt)}</p>
                  </div>
                  {record.status === "unstaking" && (
                    <div>
                      <p>Cooldown Ends</p>
                      <p className="text-yellow-300">{formatDate(record.cooldownEndsAt)}</p>
                    </div>
                  )}
                </div>

                {record.status === "active" && (
                  <Button
                    onClick={() => handleUnstake(record.id)}
                    disabled={unstakeMutation.isPending}
                    variant="outline"
                    className="w-full text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    {unstakeMutation.isPending ? "Processing..." : "Initiate Unstake"}
                  </Button>
                )}

                {record.status === "unstaking" && isUnstakingReady(record.cooldownEndsAt) && (
                  <Button
                    className="w-full text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                  >
                    Withdraw Available
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Cooldown Information */}
      <Card className="bg-blue-900/20 border-blue-500/30 p-4">
        <h4 className="font-bold text-blue-300 mb-2">7-Day Cooldown Period</h4>
        <p className="text-sm text-blue-200">
          When you initiate an unstake, your tokens are locked for 7 days. During this period, you earn no yield. After the cooldown expires, you can withdraw your tokens.
        </p>
      </Card>
    </div>
  );
}
