#!/bin/bash

echo "===== DEPLOYMENT DIAGNOSTIC SCRIPT ====="
echo ""

echo "1. Checking current directory and git status:"
pwd
git branch
git log --oneline -3
git status
echo ""

echo "2. Checking Header.tsx content (should NOT have Group Trips):"
grep -n "Group Trips" components/layout/Header.tsx || echo "✓ Group Trips not found (good!)"
grep -n "Plan Your Trip" components/layout/Header.tsx || echo "✓ Plan Your Trip not found (good!)"
grep -n "Join Adventure" components/layout/Header.tsx || echo "✗ Join Adventure found (bad - should be Plan My Trip)"
grep -n "Plan My Trip" components/layout/Header.tsx && echo "✓ Plan My Trip found (good!)"
echo ""

echo "3. Checking app/page.tsx content (should NOT have featuredDestinations):"
grep -n "featuredDestinations" app/page.tsx || echo "✓ featuredDestinations not found (good!)"
grep -n "Join small groups" app/page.tsx || echo "✓ Old hero text not found (good!)"
grep -n "Discover expert travel guides" app/page.tsx && echo "✓ New hero text found (good!)"
echo ""

echo "4. Checking PM2 processes:"
pm2 list
echo ""

echo "5. Checking PM2 logs (last 20 lines):"
pm2 logs bearadventures-staging --lines 20 --nostream
echo ""

echo "6. Checking what port PM2 is running on:"
pm2 describe bearadventures-staging | grep -E "(script|port)"
echo ""

echo "7. Checking nginx configuration for beta.bearadventures.travel:"
sudo nginx -T 2>/dev/null | grep -A 30 "server_name.*beta.bearadventures.travel" | head -35
echo ""

echo "8. Checking .next build directory:"
ls -la .next/ | head -10
stat .next/ | grep -E "(Modify|Access)"
echo ""

echo "9. Testing direct PM2 response (first 500 chars):"
curl -s http://localhost:3000 2>&1 | head -c 500
echo ""
echo ""

echo "10. Checking if there are multiple Next.js processes:"
ps aux | grep -i next | grep -v grep
echo ""

echo "===== END DIAGNOSTIC ====="
