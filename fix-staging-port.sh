#!/bin/bash
# Fix script to start bearadventures-staging on port 3005
# Run this on the staging server

echo "===== FIXING BEARADVENTURES STAGING PORT ====="
echo ""

echo "Step 1: Stop crashed bearadventures-staging process..."
pm2 delete bearadventures-staging || echo "Process not found (that's ok)"
echo ""

echo "Step 2: Starting bearadventures-staging on port 3005..."
cd /var/www/bearadventures/app
PORT=3005 pm2 start npm --name "bearadventures-staging" -- start
echo ""

echo "Step 3: Saving PM2 configuration..."
pm2 save
echo ""

echo "Step 4: Checking PM2 status..."
pm2 list | grep bearadventures
echo ""

echo "Step 5: Testing port 3005 is responding..."
sleep 3
curl -s http://localhost:3005 | head -c 200
echo ""
echo ""

echo "Step 6: Updating nginx configuration..."
echo "Run these commands to update nginx:"
echo ""
echo "sudo nano /etc/nginx/sites-available/beta.bearadventures.travel"
echo ""
echo "Change the proxy_pass line from:"
echo "  proxy_pass http://localhost:3000;"
echo "To:"
echo "  proxy_pass http://localhost:3005;"
echo ""
echo "Then run:"
echo "  sudo nginx -t"
echo "  sudo systemctl reload nginx"
echo ""

echo "===== NGINX CONFIG SNIPPET ====="
cat << 'NGINX'
    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
NGINX
echo "===== END NGINX CONFIG ====="
echo ""
echo "After updating nginx, your site should show the new content!"
