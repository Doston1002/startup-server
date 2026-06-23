#!/bin/bash
# Serverda ishga tushiring: bash scripts/diagnose-production.sh

echo "=== PM2 status ==="
pm2 status startup-server 2>/dev/null || pm2 status

echo ""
echo "=== Port 8000 tinglayaptimi? ==="
ss -tlnp 2>/dev/null | grep 8000 || netstat -tlnp 2>/dev/null | grep 8000 || echo "8000 port topilmadi"

echo ""
echo "=== Local health (8000) ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:8000/api/health || echo "curl failed"
curl -s http://127.0.0.1:8000/api/health 2>/dev/null | head -c 200
echo ""

echo ""
echo "=== .env PORT ==="
grep -E '^PORT' .env 2>/dev/null || echo "PORT not in .env (default 8000)"

echo ""
echo "=== Nginx api config ==="
grep -r "api.uydatalim" /etc/nginx/ 2>/dev/null | head -20 || echo "nginx config topilmadi (sudo kerak bo'lishi mumkin)"

echo ""
echo "=== Oxirgi PM2 xatolar ==="
pm2 logs startup-server --lines 5 --nostream 2>/dev/null
