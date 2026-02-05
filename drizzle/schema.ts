import { bigint, decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  walletAddress: varchar("walletAddress", { length: 64 }),
  riskBalance: decimal("riskBalance", { precision: 20, scale: 8 }).default("0").notNull(),
  solBalance: decimal("solBalance", { precision: 20, scale: 8 }).default("0").notNull(),
  stakedRisk: decimal("stakedRisk", { precision: 20, scale: 8 }).default("0").notNull(),
  yieldAccumulated: decimal("yieldAccumulated", { precision: 20, scale: 8 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Game rounds table
export const gameRounds = mysqlTable("gameRounds", {
  id: int("id").autoincrement().primaryKey(),
  roundNumber: bigint("roundNumber", { mode: "number" }).notNull().unique(),
  crashPoint: decimal("crashPoint", { precision: 10, scale: 4 }).notNull(),
  hashSeed: varchar("hashSeed", { length: 256 }).notNull(),
  hashChain: text("hashChain"),
  status: mysqlEnum("status", ["betting", "running", "crashed", "settled"]).default("betting").notNull(),
  bettingStartedAt: timestamp("bettingStartedAt").notNull(),
  gameStartedAt: timestamp("gameStartedAt"),
  crashedAt: timestamp("crashedAt"),
  totalWagers: decimal("totalWagers", { precision: 20, scale: 8 }).default("0").notNull(),
  totalPayouts: decimal("totalPayouts", { precision: 20, scale: 8 }).default("0").notNull(),
  houseProfitLoss: decimal("houseProfitLoss", { precision: 20, scale: 8 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GameRound = typeof gameRounds.$inferSelect;
export type InsertGameRound = typeof gameRounds.$inferInsert;

// User bets table
export const bets = mysqlTable("bets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  roundId: int("roundId").notNull(),
  wagerAmount: decimal("wagerAmount", { precision: 20, scale: 8 }).notNull(),
  multiplierAtCashOut: decimal("multiplierAtCashOut", { precision: 10, scale: 4 }),
  autoCashoutLimit: decimal("autoCashoutLimit", { precision: 10, scale: 4 }),
  payout: decimal("payout", { precision: 20, scale: 8 }).default("0").notNull(),
  status: mysqlEnum("status", ["pending", "cashed_out", "crashed", "settled"]).default("pending").notNull(),
  placedAt: timestamp("placedAt").defaultNow().notNull(),
  cashedOutAt: timestamp("cashedOutAt"),
});

export type Bet = typeof bets.$inferSelect;
export type InsertBet = typeof bets.$inferInsert;

// Staking records table
export const stakingRecords = mysqlTable("stakingRecords", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  status: mysqlEnum("status", ["active", "unstaking", "withdrawn"]).default("active").notNull(),
  stakedAt: timestamp("stakedAt").defaultNow().notNull(),
  unstakeInitiatedAt: timestamp("unstakeInitiatedAt"),
  cooldownEndsAt: timestamp("cooldownEndsAt"),
  withdrawnAt: timestamp("withdrawnAt"),
});

export type StakingRecord = typeof stakingRecords.$inferSelect;
export type InsertStakingRecord = typeof stakingRecords.$inferInsert;

// Vault state table
export const vaults = mysqlTable("vaults", {
  id: int("id").autoincrement().primaryKey(),
  vaultType: mysqlEnum("vaultType", ["house", "yield", "burn", "growth"]).notNull(),
  balance: decimal("balance", { precision: 20, scale: 8 }).default("0").notNull(),
  totalDistributed: decimal("totalDistributed", { precision: 20, scale: 8 }).default("0").notNull(),
  lastUpdatedAt: timestamp("lastUpdatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Vault = typeof vaults.$inferSelect;
export type InsertVault = typeof vaults.$inferInsert;

// Yield distribution tracking
export const yieldDistributions = mysqlTable("yieldDistributions", {
  id: int("id").autoincrement().primaryKey(),
  roundId: int("roundId").notNull(),
  totalYield: decimal("totalYield", { precision: 20, scale: 8 }).notNull(),
  accumulatedYieldPerShare: decimal("accumulatedYieldPerShare", { precision: 20, scale: 8 }).notNull(),
  distributedAt: timestamp("distributedAt").defaultNow().notNull(),
});

export type YieldDistribution = typeof yieldDistributions.$inferSelect;
export type InsertYieldDistribution = typeof yieldDistributions.$inferInsert;