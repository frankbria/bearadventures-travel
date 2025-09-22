# Simple Next.js Deployment Guide - No Frills

## Overview
Deploy Bear Adventures Travel Next.js app to Ubuntu 24.04 LTS with nginx reverse proxy. Simple, bulletproof approach.

## Prerequisites
- Ubuntu 24.04 LTS server with root access
- Domain `bearadventures.travel` pointing to server IP
- SSH access to server

## Step 1: Install Node.js and Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install additional tools
sudo apt install -y git nginx ufw certbot python3-certbot-nginx

# Verify installations
node --version  # Should be v20.x.x
npm --version   # Should be 10.x.x
```

## Step 2: Create Application User

```bash
# Create user for the application
sudo adduser --system --group --home /var/www/bearadventures bearadventures
sudo usermod -s /bin/bash bearadventures
```

## Step 3: Deploy Application Code

```bash
# Switch to application user
sudo su - bearadventures

# Clone repository
git clone https://github.com/frankbria/bearadventures-travel.git app
cd app

# Install dependencies
npm install

# Build the application
npm run build

# Test that it works
npm start &
sleep 5
curl -I http://localhost:3000
# Should return HTTP/1.1 200 OK

# Stop the test
pkill -f "npm start"

# Exit back to root
exit
```

## Step 4: Create Systemd Service (Simple)

```bash
# Create simple systemd service
sudo tee /etc/systemd/system/bearadventures.service > /dev/null << 'EOF'
[Unit]
Description=Bear Adventures Travel Next.js App
After=network.target

[Service]
Type=simple
User=bearadventures
WorkingDirectory=/var/www/bearadventures/app
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable bearadventures
sudo systemctl start bearadventures

# Check status
sudo systemctl status bearadventures

# Test application
curl -I http://localhost:3000
```

## Step 5: Configure nginx

```bash
# Create nginx configuration
sudo tee /etc/nginx/sites-available/beta.bearadventures.travel > /dev/null << 'EOF'
server {
    listen 80;
    server_name beta.bearadventures.travel;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/beta.bearadventures.travel /etc/nginx/sites-enabled/

# Remove default nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## Step 6: Configure Firewall

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Check status
sudo ufw status
```

## Step 7: Setup SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d beta.bearadventures.travel

# Test auto-renewal
sudo certbot renew --dry-run
```

## Step 8: Final Verification

```bash
# Check all services are running
sudo systemctl status bearadventures
sudo systemctl status nginx

# Test the website
curl -I https://beta.bearadventures.travel
# Should return HTTP/2 200

# Check application logs
sudo journalctl -u bearadventures -f
```

## Deployment Updates

When you need to update the application:

```bash
# Switch to app user
sudo su - bearadventures
cd app

# Pull latest code
git pull origin main

# Install any new dependencies
npm install

# Build the application
npm run build

# Exit back to root
exit

# Restart the service
sudo systemctl restart bearadventures

# Check it's working
curl -I https://beta.bearadventures.travel
```

## Troubleshooting

### If application won't start:
```bash
sudo journalctl -u bearadventures -n 50
```

### If nginx shows 502 Bad Gateway:
```bash
sudo systemctl status bearadventures
curl -I http://localhost:3000
```

### If SSL certificate fails:
```bash
sudo certbot certificates
sudo certbot --nginx -d beta.bearadventures.travel
```

## File Locations

- **Application**: `/var/www/bearadventures/app/`
- **Service file**: `/etc/systemd/system/bearadventures.service`
- **nginx config**: `/etc/nginx/sites-available/beta.bearadventures.travel`
- **SSL certificates**: `/etc/letsencrypt/live/beta.bearadventures.travel/`

## Expected Final State

- ✅ `sudo systemctl status bearadventures` shows "active (running)"
- ✅ `sudo systemctl status nginx` shows "active (running)"
- ✅ `curl -I https://beta.bearadventures.travel` returns HTTP/2 200
- ✅ Website loads in browser at https://beta.bearadventures.travel

---

**This is the complete, simple deployment. No PM2, no complex configurations, just Next.js + systemd + nginx.**