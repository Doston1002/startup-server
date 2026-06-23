#!/bin/bash
# Production serverda ishga tushirish (SSH orqali)
set -e

cd "$(dirname "$0")/.."
echo "==> Papka: $(pwd)"

echo "==> Dependencies..."
npm install --legacy-peer-deps

echo "==> Build (tsc)..."
npx tsc -p tsconfig.build.json

echo "==> PM2 restart..."
mkdir -p logs
if pm2 describe startup-server > /dev/null 2>&1; then
  pm2 restart startup-server
else
  pm2 start ecosystem.config.js
fi
pm2 save

echo "==> Status:"
pm2 status startup-server

echo "==> Health check (localhost)..."
sleep 2
TS_NODE_PROJECT=./tsconfig.runtime.json node -r tsconfig-paths/register dist/main.js &
SERVER_PID=$!
sleep 2
curl -sf "http://127.0.0.1:${PORT:-8000}/api/health" && echo "" || echo "LOCAL HEALTH FAILED"
kill $SERVER_PID 2>/dev/null || true

echo "Done. Tashqi tekshirish: https://api.uydatalim.uzedu.uz/api/health"
