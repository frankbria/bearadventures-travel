# PM2 Service Startup Fix Commands

## Issue Analysis

The PM2 systemd service `pm2-bearadventures.service` is failing to start. This is likely due to:

1. **Incorrect service configuration**
2. **Missing PM2 process save file**
3. **Permission issues**
4. **User/path configuration problems**

## Diagnostic Commands (Run on Production Server)

### Step 1: Check Service Status and Logs
```bash
# Check detailed service status
sudo systemctl status pm2-bearadventures.service

# Check service logs for specific errors
sudo journalctl -xeu pm2-bearadventures.service

# Check if PM2 service file exists
ls -la /etc/systemd/system/pm2-bearadventures.service
```

### Step 2: Check PM2 State
```bash
# Switch to bearadventures user
sudo su - bearadventures

# Check PM2 status as bearadventures user
pm2 status

# Check if PM2 dump file exists
ls -la ~/.pm2/dump.pm2

# Check PM2 startup configuration
pm2 startup

# Exit back to root
exit
```

## Common Issues and Fixes

### Fix 1: Reset PM2 Startup Configuration

```bash
# Stop and disable the failing service
sudo systemctl stop pm2-bearadventures.service
sudo systemctl disable pm2-bearadventures.service

# Remove old service file if it exists
sudo rm -f /etc/systemd/system/pm2-bearadventures.service

# Switch to bearadventures user
sudo su - bearadventures
cd /var/www/bearadventures/app

# Start the application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Generate new startup script (THIS IS CRITICAL)
pm2 startup

# Exit back to root
exit
```

### Fix 2: Execute the Generated Startup Command

**IMPORTANT**: The `pm2 startup` command will output a command that looks like this:
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u bearadventures --hp /var/www/bearadventures
```

**YOU MUST COPY AND RUN THE EXACT COMMAND IT OUTPUTS**

### Fix 3: Enable and Start the Service

```bash
# Reload systemd after creating new service
sudo systemctl daemon-reload

# Enable the service for auto-start
sudo systemctl enable pm2-bearadventures

# Start the service
sudo systemctl start pm2-bearadventures

# Check status
sudo systemctl status pm2-bearadventures
```

## Alternative: Manual PM2 Setup

If the systemd service continues to fail, use this manual approach:

### Step 1: Start PM2 Manually
```bash
# Switch to bearadventures user
sudo su - bearadventures
cd /var/www/bearadventures/app

# Stop any existing PM2 processes
pm2 delete all || true

# Start the application
pm2 start ecosystem.config.js

# Check status
pm2 status

# Save configuration
pm2 save

# Exit
exit
```

### Step 2: Create a Simple Startup Script
```bash
# Create a simple startup script
sudo tee /usr/local/bin/start-bearadventures.sh > /dev/null << 'EOF'
#!/bin/bash
su - bearadventures -c "cd /var/www/bearadventures/app && pm2 resurrect"
EOF

# Make it executable
sudo chmod +x /usr/local/bin/start-bearadventures.sh

# Test the script
sudo /usr/local/bin/start-bearadventures.sh
```

### Step 3: Add to System Startup (Cron Method)
```bash
# Add to root crontab for startup
sudo crontab -e

# Add this line:
@reboot /usr/local/bin/start-bearadventures.sh
```

## Verification Commands

### Check PM2 Process
```bash
# Switch to bearadventures user
sudo su - bearadventures

# Check PM2 status
pm2 status

# Should show something like:
# ┌─────┬──────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
# │ id  │ name                 │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
# ├─────┼──────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
# │ 0   │ bearadventures-beta  │ default     │ 0.0.0   │ fork    │ 12345    │ 5m     │ 0    │ online    │ 0%       │ 50.0mb   │ beara... │ disabled │
# └─────┴──────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘

# Check logs
pm2 logs bearadventures-beta --lines 10

# Exit
exit
```

### Check Application Response
```bash
# Test if the application is responding
curl -I http://localhost:3000

# Should return HTTP/1.1 200 OK

# Test the full website
curl -I https://beta.bearadventures.travel
```

### Check Systemd Service (if using systemd method)
```bash
# Check service status
sudo systemctl status pm2-bearadventures

# Should show "active (running)"
```

## Troubleshooting Common Issues

### Issue: PM2 Not Found
```bash
# Check if PM2 is globally installed
which pm2

# If not found, install globally as root
sudo npm install -g pm2
```

### Issue: Permission Denied
```bash
# Fix ownership of PM2 directories
sudo chown -R bearadventures:bearadventures /var/www/bearadventures
sudo chown -R bearadventures:bearadventures /home/bearadventures/.pm2
```

### Issue: Application Won't Start
```bash
# Check if the application builds successfully
sudo su - bearadventures
cd /var/www/bearadventures/app
npm run build

# Check if ecosystem.config.js exists and is correct
cat ecosystem.config.js

# Test starting manually
npm start

# Exit
exit
```

### Issue: Port 3000 Already in Use
```bash
# Check what's using port 3000
sudo netstat -tlnp | grep :3000

# Kill the process if needed
sudo kill -9 <PID>
```

## Expected Final State

After successful setup:

1. ✅ **PM2 Service**: `sudo systemctl status pm2-bearadventures` shows "active (running)"
2. ✅ **PM2 Process**: `sudo su - bearadventures -c "pm2 status"` shows bearadventures-beta "online"
3. ✅ **Application**: `curl -I http://localhost:3000` returns HTTP 200
4. ✅ **Website**: `curl -I https://beta.bearadventures.travel` returns HTTP 200
5. ✅ **Logs**: `sudo su - bearadventures -c "pm2 logs bearadventures-beta --lines 5"` shows no errors

## Quick Fix Summary

If you just want to get it running quickly:

```bash
# 1. Start manually
sudo su - bearadventures
cd /var/www/bearadventures/app
pm2 start ecosystem.config.js
pm2 save
exit

# 2. Test
curl -I http://localhost:3000

# 3. If working, worry about systemd service later
```

---

**Run these commands step by step and the PM2 service should start correctly.**