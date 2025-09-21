# Bear Adventures Travel - Deployment Guide

## Overview
This guide provides step-by-step instructions to deploy the Bear Adventures Travel Next.js application on Ubuntu 24.04 LTS Noble server with nginx as a reverse proxy for development/staging environment.

**Target URL**: `beta.bearadventures.travel`
**Server**: Ubuntu 24.04 LTS Noble
**Web Server**: nginx (reverse proxy)
**Application**: Next.js 14.2.32 with TypeScript

## Prerequisites

- Ubuntu 24.04 LTS server with root/sudo access
- nginx installed and running
- Domain `bearadventures.travel` with DNS control
- SSL certificate capability (Let's Encrypt recommended)

## Step-by-Step Deployment

### 1. Server Preparation

#### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### 1.2 Install Required Packages
```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install additional tools
sudo apt install -y git curl build-essential unzip

# Verify installations
node --version  # Should be v20.x.x
npm --version   # Should be 10.x.x
nginx -v        # Confirm nginx is installed
```

#### 1.3 Create Application User
```bash
# Create dedicated user for the application
sudo adduser --system --group --home /var/www/bearadventures bearadventures
sudo usermod -aG www-data bearadventures
```

### 2. Application Setup

#### 2.1 Clone Repository
```bash
# Switch to application user
sudo su - bearadventures

# Clone the repository
cd /var/www/bearadventures
git clone https://github.com/frankbria/bearadventures-travel.git app
cd app

# Verify the clone
ls -la
```

#### 2.2 Install Dependencies
```bash
# Install production dependencies
npm ci --only=production

# Install PM2 globally for process management
sudo npm install -g pm2
```

#### 2.3 Environment Configuration
```bash
# Create production environment file
sudo nano /var/www/bearadventures/app/.env.production

# Add the following content:
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://beta.bearadventures.travel
PORT=3000
```

#### 2.4 Build Application
```bash
# Build the Next.js application
npm run build

# Verify build completed successfully
ls -la .next/
```

### 3. Process Management with PM2

#### 3.1 Create PM2 Configuration
```bash
# Create PM2 ecosystem file
nano /var/www/bearadventures/app/ecosystem.config.js
```

Add the following content:
```javascript
module.exports = {
  apps: [{
    name: 'bearadventures-beta',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/bearadventures/app',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/bearadventures/error.log',
    out_file: '/var/log/bearadventures/out.log',
    log_file: '/var/log/bearadventures/combined.log',
    time: true
  }]
};
```

#### 3.2 Create Log Directory
```bash
sudo mkdir -p /var/log/bearadventures
sudo chown bearadventures:bearadventures /var/log/bearadventures
```

#### 3.3 Start Application with PM2
```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Generate startup script
pm2 startup
# Follow the instructions provided by the command above

# Verify application is running
pm2 status
pm2 logs bearadventures-beta
```

### 4. nginx Configuration

#### 4.1 Create nginx Site Configuration
```bash
sudo nano /etc/nginx/sites-available/beta.bearadventures.travel
```

Add the following configuration:
```nginx
# Upstream configuration for Next.js app
upstream bearadventures_beta {
    server 127.0.0.1:3000;
    keepalive 64;
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=beta_limit:10m rate=10r/s;

server {
    listen 80;
    server_name beta.bearadventures.travel;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name beta.bearadventures.travel;

    # SSL Configuration (will be configured with certbot)
    ssl_certificate /etc/letsencrypt/live/beta.bearadventures.travel/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/beta.bearadventures.travel/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Rate limiting
    limit_req zone=beta_limit burst=20 nodelay;

    # Root and index
    root /var/www/bearadventures/app;
    index index.html;

    # Proxy configuration for Next.js
    location / {
        proxy_pass http://bearadventures_beta;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files caching
    location /_next/static/ {
        alias /var/www/bearadventures/app/.next/static/;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Public files
    location /static/ {
        alias /var/www/bearadventures/app/public/;
        expires 30d;
        add_header Cache-Control "public";
    }

    # Favicon and robots
    location = /favicon.ico {
        alias /var/www/bearadventures/app/public/favicon.ico;
        expires 7d;
        add_header Cache-Control "public";
    }

    location = /robots.txt {
        alias /var/www/bearadventures/app/public/robots.txt;
        expires 7d;
        add_header Cache-Control "public";
    }

    # Security: Block access to sensitive files
    location ~ /\.ht {
        deny all;
    }

    location ~ /\.git {
        deny all;
    }

    location ~ /node_modules {
        deny all;
    }

    # Logs
    access_log /var/log/nginx/beta.bearadventures.travel.access.log;
    error_log /var/log/nginx/beta.bearadventures.travel.error.log;
}
```

#### 4.2 Enable Site and Test Configuration
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/beta.bearadventures.travel /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### 5. SSL Certificate Setup

#### 5.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 5.2 Obtain SSL Certificate
```bash
# Make sure DNS is pointing to your server first
# Then obtain certificate
sudo certbot --nginx -d beta.bearadventures.travel

# Follow the prompts to complete certificate installation
```

#### 5.3 Auto-renewal Setup
```bash
# Test auto-renewal
sudo certbot renew --dry-run

# The auto-renewal should already be set up via systemd timer
sudo systemctl status certbot.timer
```

### 6. DNS Configuration

Configure your DNS provider to point the subdomain to your server:

```
Type: A
Name: beta
Value: [YOUR_SERVER_IP]
TTL: 300 (or your preferred value)
```

### 7. Firewall Configuration

#### 7.1 Configure UFW (if using)
```bash
# Allow nginx and SSH
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable

# Check status
sudo ufw status
```

### 8. File Permissions and Security

#### 8.1 Set Proper Permissions
```bash
# Set ownership
sudo chown -R bearadventures:www-data /var/www/bearadventures/app

# Set permissions
sudo chmod -R 755 /var/www/bearadventures/app
sudo chmod -R 644 /var/www/bearadventures/app/.next/static/

# Secure sensitive files
sudo chmod 600 /var/www/bearadventures/app/.env.production
```

### 9. Monitoring and Maintenance

#### 9.1 Log Monitoring Setup
```bash
# Create log rotation configuration
sudo nano /etc/logrotate.d/bearadventures
```

Add the following content:
```
/var/log/bearadventures/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    copytruncate
    postrotate
        pm2 reload bearadventures-beta
    endscript
}
```

#### 9.2 Health Check Script
```bash
# Create health check script
sudo nano /usr/local/bin/bearadventures-health-check.sh
```

Add the following content:
```bash
#!/bin/bash

APP_URL="https://beta.bearadventures.travel"
LOG_FILE="/var/log/bearadventures/health-check.log"

# Check if application is responding
response=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL")

if [ "$response" -eq 200 ]; then
    echo "$(date): Application is healthy (HTTP $response)" >> "$LOG_FILE"
else
    echo "$(date): Application health check failed (HTTP $response)" >> "$LOG_FILE"
    # Restart application
    pm2 restart bearadventures-beta
    echo "$(date): Application restarted" >> "$LOG_FILE"
fi
```

Make it executable:
```bash
sudo chmod +x /usr/local/bin/bearadventures-health-check.sh
```

#### 9.3 Cron Job for Health Checks
```bash
# Add cron job for health checks every 5 minutes
sudo crontab -e

# Add this line:
*/5 * * * * /usr/local/bin/bearadventures-health-check.sh
```

### 10. Deployment Script for Updates

#### 10.1 Create Deployment Script
```bash
sudo nano /usr/local/bin/deploy-bearadventures.sh
```

Add the following content:
```bash
#!/bin/bash

set -e

APP_DIR="/var/www/bearadventures/app"
BACKUP_DIR="/var/backups/bearadventures"
DATE=$(date +%Y%m%d_%H%M%S)

echo "Starting deployment at $(date)"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Switch to app user
cd "$APP_DIR"

# Create backup
echo "Creating backup..."
sudo -u bearadventures tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    .

# Pull latest changes
echo "Pulling latest changes..."
sudo -u bearadventures git pull origin main

# Install dependencies
echo "Installing dependencies..."
sudo -u bearadventures npm ci --only=production

# Build application
echo "Building application..."
sudo -u bearadventures npm run build

# Restart application
echo "Restarting application..."
pm2 restart bearadventures-beta

# Test deployment
echo "Testing deployment..."
sleep 10
response=$(curl -s -o /dev/null -w "%{http_code}" "https://beta.bearadventures.travel")

if [ "$response" -eq 200 ]; then
    echo "Deployment successful! Application is responding with HTTP $response"
    # Clean old backups (keep last 10)
    cd "$BACKUP_DIR"
    ls -t backup_*.tar.gz | tail -n +11 | xargs -r rm
else
    echo "Deployment failed! Application not responding (HTTP $response)"
    echo "Consider rolling back using: sudo -u bearadventures tar -xzf $BACKUP_DIR/backup_$DATE.tar.gz -C $APP_DIR"
    exit 1
fi

echo "Deployment completed at $(date)"
```

Make it executable:
```bash
sudo chmod +x /usr/local/bin/deploy-bearadventures.sh
```

## Verification Steps

### 1. Test Application Access
```bash
# Test HTTP redirect
curl -I http://beta.bearadventures.travel

# Test HTTPS access
curl -I https://beta.bearadventures.travel

# Check response time
curl -o /dev/null -s -w "Time: %{time_total}s\n" https://beta.bearadventures.travel
```

### 2. Monitor Logs
```bash
# Application logs
pm2 logs bearadventures-beta

# nginx logs
sudo tail -f /var/log/nginx/beta.bearadventures.travel.access.log
sudo tail -f /var/log/nginx/beta.bearadventures.travel.error.log
```

### 3. Performance Testing
```bash
# Simple load test (install apache2-utils if needed)
sudo apt install apache2-utils -y
ab -n 100 -c 10 https://beta.bearadventures.travel/
```

## Troubleshooting

### Common Issues

1. **Application not starting**
   ```bash
   pm2 logs bearadventures-beta
   pm2 restart bearadventures-beta
   ```

2. **502 Bad Gateway**
   ```bash
   # Check if app is running on port 3000
   sudo netstat -tlnp | grep :3000
   pm2 status
   ```

3. **SSL Certificate issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew
   ```

4. **Permission issues**
   ```bash
   sudo chown -R bearadventures:www-data /var/www/bearadventures/app
   sudo chmod -R 755 /var/www/bearadventures/app
   ```

### Log Locations
- Application logs: `/var/log/bearadventures/`
- nginx logs: `/var/log/nginx/beta.bearadventures.travel.*`
- PM2 logs: `pm2 logs`
- System logs: `sudo journalctl -u nginx`

## Security Considerations

1. **Regular Updates**
   ```bash
   sudo apt update && sudo apt upgrade -y
   npm audit fix
   ```

2. **Backup Strategy**
   - Database backups (if applicable)
   - Application code backups
   - Configuration backups

3. **Monitoring**
   - Set up log monitoring
   - Monitor resource usage
   - Set up alerting for downtime

## Maintenance Schedule

### Daily
- Monitor application logs
- Check system resources

### Weekly
- Review access logs
- Check for security updates
- Verify backups

### Monthly
- Update dependencies
- Rotate logs
- Performance review

---

**Support**: For issues with this deployment, check the troubleshooting section or contact the development team.

**Last Updated**: $(date +%Y-%m-%d)