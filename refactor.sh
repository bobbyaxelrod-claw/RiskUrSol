#!/usr/bin/env bash
set -euo pipefail

# RiskUrUSDC Refactoring Script
# Systematically replaces all Solana/SOL/Privy/pump.fun references

REPO_DIR="/home/mhdcrypt95/.openclaw/workspace/riskursol-public"
cd "$REPO_DIR"

echo "🔄 Starting RiskUrUSDC refactoring..."

# Step 1: RiskUrSol → RiskUrUSDC (case sensitive)
echo "📝 Renaming RiskUrSol → RiskUrUSDC..."
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sed -i 's/RiskUrSol/RiskUrUSDC/g' {} \;

# Step 2: Solana → Base
echo "📝 Blockchain: Solana → Base..."
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sed -i 's/Solana/Base/g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sed -i 's/solana/base/g' {} \;

# Step 3: SOL → USDC (careful with "SOL" as it might appear in other contexts)
echo "📝 Token: SOL → USDC..."
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sed -i 's/\bSOL\b/USDC/g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sed -i 's/\$SOL/\$USDC/g' {} \;

# Step 4: Remove Privy mentions
echo "📝 Removing Privy references..."
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sed -i 's/Privy/Wallet/g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sed -i 's/privy/wallet/g' {} \;

# Step 5: Remove pump.fun references
echo "📝 Removing pump.fun references..."
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sed -i 's/pump\.fun//g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sed -i 's/pump-fun//g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sed -i 's/pumpfun//g' {} \;

# Step 6: Update package.json name
echo "📝 Updating package.json..."
sed -i 's/"name": ".*"/"name": "riskurusdc"/g' package.json

echo "✅ Text replacements complete!"
echo "📊 Summary of changes:"
echo "   - RiskUrSol → RiskUrUSDC"
echo "   - Solana → Base"
echo "   - SOL → USDC"
echo "   - Privy → Wallet"
echo "   - pump.fun removed"
