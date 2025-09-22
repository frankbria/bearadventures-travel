# PM2 NVM Override Fix - Production Server Commands

## Issue Analysis

NVM is overriding the global npm and preventing PM2 from being installed globally. The system is still using `/root/.nvm/versions/node/v24.4.1/lib/node_modules/pm2/bin/pm2` instead of a global installation.

## Root Cause
- NVM modifies PATH to prioritize its Node.js installation
- `sudo npm install -g pm2` installs to NVM's path, not system global
- systemd service needs a consistent, non-NVM path to PM2

## ✅ CORRECT Fix Commands

### Option 1: Install PM2 Using System Node (Recommended)

```bash
# Step 1: Check what Node.js versions are available on system
/usr/bin/node --version || echo "System Node.js not installed"

# Step 2: Install system Node.js if needed
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Step 3: Verify system Node.js installation
/usr/bin/node --version
/usr/bin/npm --version

# Step 4: Install PM2 using system npm (bypassing NVM)
sudo /usr/bin/npm install -g pm2

# Step 5: Verify PM2 is now globally available
which pm2
# Should show: /usr/bin/pm2 or /usr/local/bin/pm2

# Step 6: Create symlink if needed
sudo ln -sf /usr/lib/node_modules/pm2/bin/pm2 /usr/bin/pm2
```

### Option 2: Disable NVM for Root and Install Globally

```bash
# Step 1: Temporarily disable NVM for this session
unset NVM_DIR
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# Step 2: Check Node.js path without NVM
which node
which npm

# Step 3: Install PM2 globally
sudo env PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" npm install -g pm2

# Step 4: Verify installation
which pm2
ls -la /usr/bin/pm2 || ls -la /usr/local/bin/pm2
```

### Option 3: Force Correct PM2 Path (If Above Don't Work)

```bash
# Step 1: Create a proper PM2 wrapper that uses the existing NVM installation
sudo tee /usr/bin/pm2 > /dev/null << 'EOF'
#!/bin/bash
export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
exec /root/.nvm/versions/node/v24.4.1/lib/node_modules/pm2/bin/pm2 "$@"
EOF

# Step 2: Make it executable
sudo chmod +x /usr/bin/pm2

# Step 3: Verify PM2 works
/usr/bin/pm2 --version

# Step 4: Test with bearadventures user
sudo su - bearadventures -c "/usr/bin/pm2 --version"
```

## ✅ After PM2 Path is Fixed

Once `which pm2` shows `/usr/bin/pm2`, proceed with these commands:

### Step 1: Setup PM2 with bearadventures User
```bash
# Switch to bearadventures user
sudo su - bearadventures
cd /var/www/bearadventures/app

# Stop any existing PM2 processes
pm2 delete all || true

# Start the application
pm2 start ecosystem.config.js

# Verify it's running
pm2 status

# Save PM2 configuration
pm2 save

# Generate startup command (this should now use correct path)
pm2 startup

# ⚠️ Copy and run the command it outputs
exit
```

### Step 2: Execute the Generated Startup Command
Copy and run the exact command from Step 1. It should now look like:
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u bearadventures --hp /var/www/bearadventures
```

### Step 3: Start the Service
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable pm2-bearadventures

# Start service
sudo systemctl start pm2-bearadventures

# Check status
sudo systemctl status pm2-bearadventures
```

## 🧪 Verification Commands

```bash
# 1. Verify PM2 path is correct
which pm2
ls -la $(which pm2)

# 2. Test PM2 as bearadventures user
sudo su - bearadventures -c "pm2 --version"

# 3. Check systemd service file
cat /etc/systemd/system/pm2-bearadventures.service

# 4. Check service status
sudo systemctl status pm2-bearadventures

# 5. Test application
curl -I http://localhost:3000
```

## 🚨 Troubleshooting

### If PM2 Still Shows NVM Path
```bash
# Check your shell's PATH
echo $PATH

# Check if NVM is being loaded in /root/.bashrc or /root/.profile
grep -r "nvm" /root/.bashrc /root/.profile /etc/profile* 2>/dev/null

# Temporarily override PATH for installation
sudo env PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" bash -c "npm install -g pm2"
```

### If Service Still Fails
```bash
# Check the actual service file content
sudo cat /etc/systemd/system/pm2-bearadventures.service

# Look for any references to /root/.nvm/
# If found, manually edit the service file:
sudo nano /etc/systemd/system/pm2-bearadventures.service

# Replace any /root/.nvm/ paths with /usr/bin/pm2
```

### Manual Service File Creation
If automatic generation doesn't work, create the service manually:

```bash
sudo tee /etc/systemd/system/pm2-bearadventures.service > /dev/null << 'EOF'
[Unit]
Description=PM2 process manager
Documentation=https://pm2.keymetrics.io/
After=network.target

[Service]
Type=forking
User=bearadventures
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
Environment=PATH=/usr/bin:/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin
Environment=PM2_HOME=/var/www/bearadventures/.pm2
PIDFile=/var/www/bearadventures/.pm2/pm2.pid
Restart=on-failure

ExecStart=/usr/bin/pm2 resurrect
ExecReload=/usr/bin/pm2 reload all
ExecStop=/usr/bin/pm2 kill

[Install]
WantedBy=multi-user.target
EOF

# Reload and start
sudo systemctl daemon-reload
sudo systemctl enable pm2-bearadventures
sudo systemctl start pm2-bearadventures
```

## Expected Result

After successful fix:
- ✅ `which pm2` shows `/usr/bin/pm2` (not `/root/.nvm/...`)
- ✅ `sudo systemctl status pm2-bearadventures` shows "active (running)"
- ✅ No more NVM paths in service file
- ✅ Application runs correctly

**Execute Option 1 first, then Option 2 if that fails, then Option 3 as last resort.**