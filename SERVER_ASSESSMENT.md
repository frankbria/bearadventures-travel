# Server Assessment Checklist

## Purpose

This document provides a comprehensive checklist to assess the current state of the beta.bearadventures.travel server deployment.

## How to Use

Run the commands in each section and document the results. This will help determine what's already deployed and what needs to be done.

---

## 1. Server Connection & Access

### SSH Access

```bash
# Test SSH connection (replace with actual server details)
ssh user@server-ip

# Verify connection works
```

**Result:** ☐ SSH accessible / ☐ Cannot connect

### Application User

```bash
# Check if bearadventures user exists
id bearadventures

# Check user home directory
ls -la /var/www/bearadventures
```

**Result:** ☐ User exists / ☐ User does not exist

### Node.js & npm

```bash
# Check Node.js version (should be v20.x.x)
node --version

# Check npm version
npm --version

# Verify global npm location
npm config get prefix
```

**Result:** Node version: ******\_****** | npm version: ******\_******

### PM2 Installation

```bash
# Check if PM2 is installed globally
pm2 --version

# Verify PM2 is accessible
which pm2
```

**Result:** ☐ PM2 installed / ☐ PM2 not installed | Version: ******\_******

---

## 2. Codebase Status

### Repository Check

```bash
# Navigate to app directory
cd /var/www/bearadventures/app

# Check if directory exists
ls -la

# Check git status
git status

# Check current branch
git branch

# Check last commit
git log -1 --oneline

# Check if there are uncommitted changes
git diff --stat
```

**Result:**

- ☐ Repository exists / ☐ Repository missing
- Current branch: ******\_******
- Last commit: ******\_******
- Uncommitted changes: ☐ Yes / ☐ No

### Package Comparison

```bash
# Check package.json version
cat package.json | grep '"version"'

# Check if node_modules exists
ls -la node_modules/ | head -5

# Compare package-lock.json (run locally and compare)
```

**Local version:** ******\_****** | **Server version:** ******\_******

---

## 3. Application Status

### PM2 Process

```bash
# Check PM2 process status
pm2 status

# Check specific process
pm2 describe bearadventures-beta

# Check process info
pm2 info bearadventures-beta
```

**Result:**

- ☐ Process exists and running / ☐ Process exists but stopped / ☐ Process does not exist
- Status: ******\_******
- Uptime: ******\_******
- Restart count: ******\_******

### Application Health

```bash
# Test local application
curl -I http://localhost:3000

# Check if port 3000 is listening
sudo netstat -tlnp | grep :3000
# OR
sudo ss -tlnp | grep :3000
```

**Result:**

- ☐ Application responding / ☐ Application not responding
- HTTP status: ******\_******

### PM2 Logs

```bash
# Check recent logs
pm2 logs bearadventures-beta --lines 50 --nostream

# Check error logs
pm2 logs bearadventures-beta --err --lines 20 --nostream
```

**Result:** Errors found: ☐ Yes / ☐ No
**Error details:** ******\_******

---

## 4. Nginx Configuration

### Configuration Files

```bash
# Check if config exists
ls -la /etc/nginx/sites-available/beta.bearadventures.travel

# Check if symlink exists
ls -la /etc/nginx/sites-enabled/ | grep beta.bearadventures

# View configuration
cat /etc/nginx/sites-available/beta.bearadventures.travel
```

**Result:**

- ☐ Config file exists / ☐ Config file missing
- ☐ Symlink exists / ☐ Symlink missing

### Nginx Test

```bash
# Test nginx configuration
sudo nginx -t
```

**Result:** ☐ Configuration valid / ☐ Configuration errors

**Error details:** ******\_******

### HTTP/HTTPS Test

```bash
# Test HTTP redirect
curl -I http://beta.bearadventures.travel

# Test HTTPS
curl -I https://beta.bearadventures.travel
```

**Result:**

- HTTP redirect: ☐ Working / ☐ Not working
- HTTPS: ☐ Working / ☐ Not working

---

## 5. SSL Certificate

### Certificate Check

```bash
# List certificates
sudo certbot certificates

# Check certificate expiration
openssl s_client -connect beta.bearadventures.travel:443 -servername beta.bearadventures.travel < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

**Result:**

- ☐ Certificate exists / ☐ Certificate missing
- Expiration date: ******\_******

### Auto-renewal

```bash
# Check certbot timer status
sudo systemctl status certbot.timer

# Check renewal schedule
sudo systemctl list-timers | grep certbot
```

**Result:**

- ☐ Auto-renewal configured / ☐ Auto-renewal not configured

---

## 6. Environment Configuration

### Environment File

```bash
# Check if .env.production exists
ls -la /var/www/bearadventures/app/.env.production

# Check permissions (should be 600)
stat -c '%a %U:%G' /var/www/bearadventures/app/.env.production

# View environment variables (be careful with sensitive data)
cat /var/www/bearadventures/app/.env.production
```

**Result:**

- ☐ File exists / ☐ File missing
- Permissions: ******\_******

### Log Directories

```bash
# Check log directory
ls -la /var/log/bearadventures/

# Check permissions
stat -c '%a %U:%G' /var/log/bearadventures/
```

**Result:**

- ☐ Directory exists / ☐ Directory missing
- Permissions: ******\_******

---

## 7. Dependencies & Build

### Node Modules

```bash
cd /var/www/bearadventures/app

# Check if node_modules exists
ls -la node_modules/ | wc -l

# Check key dependencies
npm ls next react react-dom --depth=0
```

**Result:**

- ☐ node_modules exists / ☐ node_modules missing
- Package count: ******\_******

### Build Status

```bash
# Check if .next directory exists
ls -la .next/

# Check build timestamp
stat -c '%y' .next/ 2>/dev/null || echo "No .next directory"

# Check build size
du -sh .next/ 2>/dev/null || echo "No .next directory"
```

**Result:**

- ☐ Build exists / ☐ Build missing
- Build date: ******\_******
- Build size: ******\_******

---

## 8. File Permissions

### App Directory

```bash
# Check ownership
stat -c '%U:%G' /var/www/bearadventures/app

# Check permissions
find /var/www/bearadventures/app -maxdepth 1 -type d -exec stat -c '%a %n' {} \;
```

**Result:**

- Ownership: ******\_******
- Should be: bearadventures:www-data

### Critical Files

```bash
# Check .env permissions
stat -c '%a %U:%G' /var/www/bearadventures/app/.env.production 2>/dev/null || echo "File missing"

# Check log directory permissions
stat -c '%a %U:%G' /var/log/bearadventures/ 2>/dev/null || echo "Directory missing"
```

**Result:**

- .env permissions: ******\_****** (should be 600)
- Log directory permissions: ******\_******

---

## 9. Summary Section

Fill this out after completing all checks:

### What Exists

- [ ] Application user
- [ ] Repository cloned
- [ ] PM2 process configured
- [ ] Nginx configuration
- [ ] SSL certificate
- [ ] Environment file
- [ ] Build artifacts

### What's Working

- [ ] Application running on PM2
- [ ] Application accessible on port 3000
- [ ] Nginx proxying correctly
- [ ] HTTPS working
- [ ] HTTP redirects to HTTPS

### What's Missing

- [ ] ***
- [ ] ***
- [ ] ***

### What's Broken

- [ ] ***
- [ ] ***

### Issues Found

1. ***
2. ***
3. ***

### Priority Actions Needed

1. **Critical:** ******\_******
2. **High:** ******\_******
3. **Medium:** ******\_******
4. **Low:** ******\_******

---

## Notes

Add any additional observations or context here:
