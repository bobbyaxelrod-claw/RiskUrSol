CREATE TABLE `bets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`roundId` int NOT NULL,
	`wagerAmount` decimal(20,8) NOT NULL,
	`multiplierAtCashOut` decimal(10,4),
	`autoCashoutLimit` decimal(10,4),
	`payout` decimal(20,8) NOT NULL DEFAULT '0',
	`status` enum('pending','cashed_out','crashed','settled') NOT NULL DEFAULT 'pending',
	`placedAt` timestamp NOT NULL DEFAULT (now()),
	`cashedOutAt` timestamp,
	CONSTRAINT `bets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gameRounds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roundNumber` bigint NOT NULL,
	`crashPoint` decimal(10,4) NOT NULL,
	`hashSeed` varchar(256) NOT NULL,
	`hashChain` text,
	`status` enum('betting','running','crashed','settled') NOT NULL DEFAULT 'betting',
	`bettingStartedAt` timestamp NOT NULL,
	`gameStartedAt` timestamp,
	`crashedAt` timestamp,
	`totalWagers` decimal(20,8) NOT NULL DEFAULT '0',
	`totalPayouts` decimal(20,8) NOT NULL DEFAULT '0',
	`houseProfitLoss` decimal(20,8) NOT NULL DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gameRounds_id` PRIMARY KEY(`id`),
	CONSTRAINT `gameRounds_roundNumber_unique` UNIQUE(`roundNumber`)
);
--> statement-breakpoint
CREATE TABLE `stakingRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(20,8) NOT NULL,
	`status` enum('active','unstaking','withdrawn') NOT NULL DEFAULT 'active',
	`stakedAt` timestamp NOT NULL DEFAULT (now()),
	`unstakeInitiatedAt` timestamp,
	`cooldownEndsAt` timestamp,
	`withdrawnAt` timestamp,
	CONSTRAINT `stakingRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vaults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vaultType` enum('house','yield','burn','growth') NOT NULL,
	`balance` decimal(20,8) NOT NULL DEFAULT '0',
	`totalDistributed` decimal(20,8) NOT NULL DEFAULT '0',
	`lastUpdatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vaults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `yieldDistributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roundId` int NOT NULL,
	`totalYield` decimal(20,8) NOT NULL,
	`accumulatedYieldPerShare` decimal(20,8) NOT NULL,
	`distributedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `yieldDistributions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `walletAddress` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `riskBalance` decimal(20,8) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `solBalance` decimal(20,8) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stakedRisk` decimal(20,8) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `yieldAccumulated` decimal(20,8) DEFAULT '0' NOT NULL;