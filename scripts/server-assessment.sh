#!/bin/bash
# Server Assessment Script for Bear Adventures Travel
# Run this script on the production server to assess current deployment state

echo "=========================================="
echo "Bear Adventures Travel - Server Assessment"
echo "=========================================="
echo ""
echo "Date: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Server Connection & Access
echo "=== 1. Server Connection & Access ==="
echo "Current user: $(whoami)"
echo "Hostname: $(hostname)"
echo ""

# Application User
echo "Checking application user..."
if id "bearadventures" &>/dev/null; then
    check_pass "bearadventures user exists"
    echo "  User ID: $(id bearadventures)"
else
    check_fail "bearadventures user does not exist"
fi
echo ""

# Node.js & npm
echo "Checking Node.js and npm..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    check_pass "Node.js installed: $NODE_VERSION"
else
    check_fail "Node.js not installed"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    check_pass "npm installed: $NPM_VERSION"
else
    check_fail "npm not installed"
fi
echo ""

# PM2
echo "Checking PM2..."
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    check_pass "PM2 installed: version $PM2_VERSION"
else
    check_fail "PM2 not installed"
fi
echo ""

# 2. Codebase Status
echo "=== 2. Codebase Status ==="
APP_DIR="/var/www/bearadventures/app"

if [ -d "$APP_DIR" ]; then
    check_pass "Application directory exists: $APP_DIR"
    cd "$APP_DIR" || exit 1
    
    if [ -d ".git" ]; then
        check_pass "Git repository initialized"
        echo "  Current branch: $(git branch --show-current)"
        echo "  Last commit: $(git log -1 --oneline)"
        
        if [ -n "$(git status --porcelain)" ]; then
            check_warn "Uncommitted changes detected"
            echo "  Changes:"
            git status --short | head -5
        else
            check_pass "No uncommitted changes"
        fi
    else
        check_fail "Git repository not found"
    fi
    
    if [ -f "package.json" ]; then
        check_pass "package.json exists"
        VERSION=$(grep -o '"version": "[^"]*"' package.json | head -1 | cut -d'"' -f4)
        echo "  Version: $VERSION"
    else
        check_fail "package.json not found"
    fi
else
    check_fail "Application directory does not exist: $APP_DIR"
fi
echo ""

# 3. Application Status
echo "=== 3. Application Status ==="
if command -v pm2 &> /dev/null; then
    if pm2 describe bearadventures-beta &> /dev/null; then
        check_pass "PM2 process 'bearadventures-beta' exists"
        STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="bearadventures-beta") | .pm2_env.status' 2>/dev/null || echo "unknown")
        echo "  Status: $STATUS"
        
        if [ "$STATUS" = "online" ]; then
            check_pass "Process is running"
            UPTIME=$(pm2 jlist | jq -r '.[] | select(.name=="bearadventures-beta") | .pm2_env.pm_uptime' 2>/dev/null || echo "0")
            if [ "$UPTIME" != "0" ] && [ "$UPTIME" != "null" ]; then
                echo "  Uptime: $(date -d "@$((UPTIME / 1000))" -u +%H:%M:%S)"
            fi
        else
            check_warn "Process is not running (status: $STATUS)"
        fi
    else
        check_fail "PM2 process 'bearadventures-beta' does not exist"
    fi
fi

# Check port 3000
echo ""
echo "Checking port 3000..."
if netstat -tlnp 2>/dev/null | grep -q ":3000 " || ss -tlnp 2>/dev/null | grep -q ":3000 "; then
    check_pass "Port 3000 is listening"
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|404"; then
        check_pass "Application responding on localhost:3000"
    else
        check_warn "Port 3000 listening but application not responding"
    fi
else
    check_fail "Port 3000 is not listening"
fi
echo ""

# 4. Nginx Configuration
echo "=== 4. Nginx Configuration ==="
NGINX_CONFIG="/etc/nginx/sites-available/beta.bearadventures.travel"

if [ -f "$NGINX_CONFIG" ]; then
    check_pass "Nginx config file exists"
else
    check_fail "Nginx config file not found: $NGINX_CONFIG"
fi

if [ -L "/etc/nginx/sites-enabled/beta.bearadventures.travel" ]; then
    check_pass "Nginx site is enabled"
else
    check_warn "Nginx site not enabled (symlink missing)"
fi

if [ -f /usr/sbin/nginx ]; then
    if sudo nginx -t &> /dev/null; then
        check_pass "Nginx configuration is valid"
    else
        check_fail "Nginx configuration has errors"
        echo "  Run 'sudo nginx -t' for details"
    fi
fi
echo ""

# 5. SSL Certificate
echo "=== 5. SSL Certificate ==="
if command -v certbot &> /dev/null; then
    if sudo certbot certificates 2>/dev/null | grep -q "beta.bearadventures.travel"; then
        check_pass "SSL certificate exists for beta.bearadventures.travel"
        EXPIRY=$(sudo certbot certificates 2>/dev/null | grep -A 5 "beta.bearadventures.travel" | grep "Expiry Date" | awk '{print $3, $4, $5}')
        if [ -n "$EXPIRY" ]; then
            echo "  Expiry: $EXPIRY"
        fi
    else
        check_fail "SSL certificate not found for beta.bearadventures.travel"
    fi
    
    if systemctl is-enabled certbot.timer &> /dev/null; then
        check_pass "Certbot auto-renewal timer is enabled"
    else
        check_warn "Certbot auto-renewal timer is not enabled"
    fi
else
    check_warn "Certbot not installed"
fi
echo ""

# 6. Environment Configuration
echo "=== 6. Environment Configuration ==="
ENV_FILE="/var/www/bearadventures/app/.env.production"

if [ -f "$ENV_FILE" ]; then
    check_pass ".env.production file exists"
    PERMS=$(stat -c "%a" "$ENV_FILE" 2>/dev/null)
    if [ "$PERMS" = "600" ]; then
        check_pass "File permissions correct (600)"
    else
        check_warn "File permissions should be 600, currently: $PERMS"
    fi
else
    check_fail ".env.production file not found"
fi

LOG_DIR="/var/log/bearadventures"
if [ -d "$LOG_DIR" ]; then
    check_pass "Log directory exists: $LOG_DIR"
    PERMS=$(stat -c "%a" "$LOG_DIR" 2>/dev/null)
    echo "  Permissions: $PERMS"
else
    check_fail "Log directory not found: $LOG_DIR"
fi
echo ""

# 7. Dependencies & Build
echo "=== 7. Dependencies & Build ==="
if [ -d "$APP_DIR/node_modules" ]; then
    MODULE_COUNT=$(find "$APP_DIR/node_modules" -type d -maxdepth 1 | wc -l)
    check_pass "node_modules directory exists ($MODULE_COUNT packages)"
else
    check_fail "node_modules directory not found"
fi

if [ -d "$APP_DIR/.next" ]; then
    check_pass ".next build directory exists"
    BUILD_SIZE=$(du -sh "$APP_DIR/.next" 2>/dev/null | cut -f1)
    BUILD_DATE=$(stat -c "%y" "$APP_DIR/.next" 2>/dev/null | cut -d' ' -f1)
    echo "  Size: $BUILD_SIZE"
    echo "  Last modified: $BUILD_DATE"
else
    check_fail ".next build directory not found (build needed)"
fi
echo ""

# 8. File Permissions
echo "=== 8. File Permissions ==="
if [ -d "$APP_DIR" ]; then
    OWNER=$(stat -c "%U:%G" "$APP_DIR" 2>/dev/null)
    if [ "$OWNER" = "bearadventures:www-data" ] || [ "$OWNER" = "bearadventures:bearadventures" ]; then
        check_pass "App directory ownership correct: $OWNER"
    else
        check_warn "App directory ownership: $OWNER (expected: bearadventures:www-data)"
    fi
fi
echo ""

# Summary
echo "=========================================="
echo "Assessment Complete"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Review the results above"
echo "2. Fix any critical issues (marked with ✗)"
echo "3. Address warnings (marked with ⚠)"
echo "4. Proceed with deployment tasks based on findings"
echo ""

