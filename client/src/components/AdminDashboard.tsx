import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

export function AdminDashboard() {
  const [selectedVault, setSelectedVault] = useState<"house" | "yield" | "burn" | "growth">("house");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  const { data: vaultBalances } = trpc.treasury.getVaultBalances.useQuery();
  const rebalanceMutation = trpc.treasury.rebalanceTreasuryPda.useMutation();

  const handleRebalance = async () => {
    if (!withdrawAmount || !destinationAddress) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await rebalanceMutation.mutateAsync({
        vaultType: selectedVault,
        amount: withdrawAmount,
        destinationAddress,
      });
      toast.success(result.message);
      setWithdrawAmount("");
      setDestinationAddress("");
    } catch (error) {
      toast.error("Failed to rebalance treasury");
    }
  };

  const getVaultBalance = (type: string) => {
    return vaultBalances?.find(v => v.type === type)?.balance || 0;
  };

  return (
    <div className="w-full space-y-6">
      {/* Warning Banner */}
      <Card className="bg-red-900/20 border-red-500/50 p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-red-400">Admin Only</h3>
          <p className="text-sm text-red-300">Treasury rebalancing requires admin authorization. This action is restricted to wallet Ewd6Ao9bvS2eqPw7qwDBu7d4Urhmn3LVLj58enwpDon3</p>
        </div>
      </Card>

      {/* Vault Balances Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#0f1535] border-cyan-500/30 p-4">
          <p className="text-xs text-cyan-400 uppercase">House Vault (40%)</p>
          <p className="text-2xl font-bold text-cyan-400">{getVaultBalance("house").toFixed(4)} USDC</p>
        </Card>
        <Card className="bg-[#0f1535] border-cyan-500/30 p-4">
          <p className="text-xs text-cyan-400 uppercase">Yield Vault (35%)</p>
          <p className="text-2xl font-bold text-cyan-400">{getVaultBalance("yield").toFixed(4)} USDC</p>
        </Card>
        <Card className="bg-[#0f1535] border-cyan-500/30 p-4">
          <p className="text-xs text-cyan-400 uppercase">Burn Vault (10%)</p>
          <p className="text-2xl font-bold text-cyan-400">{getVaultBalance("burn").toFixed(4)} USDC</p>
        </Card>
        <Card className="bg-[#0f1535] border-cyan-500/30 p-4">
          <p className="text-xs text-cyan-400 uppercase">Growth Vault (15%)</p>
          <p className="text-2xl font-bold text-cyan-400">{getVaultBalance("growth").toFixed(4)} USDC</p>
        </Card>
      </div>

      {/* Treasury Rebalancing Controls */}
      <Card className="bg-[#0f1535] border-magenta-500/30 p-6 space-y-4">
        <h3 className="text-lg font-bold text-magenta-400">Rebalance Treasury PDA</h3>
        <p className="text-sm text-gray-400">Adjust vault allocations to maintain optimal protocol liquidity distribution.</p>

        <div className="space-y-4">
          {/* Vault Selection */}
          <div>
            <label className="text-sm text-cyan-300">Select Vault</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {["house", "yield", "burn", "growth"].map((vault) => (
                <button
                  key={vault}
                  onClick={() => setSelectedVault(vault as any)}
                  className={`py-2 px-3 rounded border transition ${
                    selectedVault === vault
                      ? "bg-magenta-500/30 border-magenta-500 text-magenta-300"
                      : "bg-[#1a1f3a] border-cyan-500/30 text-cyan-300 hover:border-cyan-500"
                  }`}
                >
                  {vault.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-sm text-cyan-300">Amount to Transfer (USDC)</label>
            <Input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0.0"
              step="0.0001"
              className="bg-[#1a1f3a] border-cyan-500/30 text-white mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Available: {getVaultBalance(selectedVault).toFixed(4)} USDC
            </p>
          </div>

          {/* Destination Address */}
          <div>
            <label className="text-sm text-cyan-300">Destination Address</label>
            <Input
              type="text"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder="Base wallet address"
              className="bg-[#1a1f3a] border-cyan-500/30 text-white mt-2 font-mono text-xs"
            />
          </div>

          {/* Execute Button */}
          <Button
            onClick={handleRebalance}
            disabled={rebalanceMutation.isPending || !withdrawAmount || !destinationAddress}
            className="w-full bg-gradient-to-r from-magenta-600 to-pink-600 hover:from-magenta-700 hover:to-pink-700 text-white font-bold"
          >
            {rebalanceMutation.isPending ? "Processing..." : "Execute Rebalancing"}
          </Button>
        </div>
      </Card>

      {/* Transaction History */}
      <Card className="bg-[#0f1535] border-cyan-500/30 p-6">
        <h3 className="text-lg font-bold text-cyan-400 mb-4">Recent Rebalancing Activity</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>No recent transactions</p>
        </div>
      </Card>
    </div>
  );
}
