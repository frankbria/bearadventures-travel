# Production Server Fix Commands

## Issue Analysis

The production build was failing due to two main issues:

1. **Autoprefixer Missing**: `autoprefixer` and `postcss` were in `devDependencies` but Next.js needs them for production builds
2. **Missing Components**: Production server likely doesn't have the latest committed UI components

## Root Causes

- **Dependency Issue**: `npm ci --only=production` excludes devDependencies, but Next.js requires autoprefixer for CSS processing in production builds
- **Code Sync Issue**: Production server may not have the latest commits containing UI components

## Commands to Execute on Production Server

### 1. Pull Latest Code and Reinstall Dependencies

```bash
# Switch to application user
sudo su - bearadventures
cd /var/www/bearadventures/app

# Pull latest changes (includes the dependency fix)
git pull origin main

# Remove old node_modules and reinstall with new dependencies
rm -rf node_modules package-lock.json

# Install all dependencies (autoprefixer is now in dependencies)
npm install --only=production

# Verify critical dependencies are installed
npm ls autoprefixer postcss
```

### 2. Clean Build Environment

```bash
# Remove any cached build artifacts
rm -rf .next

# Set production environment
export NODE_ENV=production
```

### 3. Test Build

```bash
# Attempt the build
npm run build

# If successful, you should see:
# ✓ Compiled successfully
# ✓ Generating static pages (9/9)
```

### 4. Restart Application (if build succeeds)

```bash
# Exit back to root user
exit

# Restart the application with PM2
pm2 restart bearadventures-beta

# Check application status
pm2 status
pm2 logs bearadventures-beta --lines 20
```

### 5. Verify Deployment

```bash
# Test the application endpoint
curl -I https://beta.bearadventures.travel

# Should return HTTP 200 if successful
```

## Alternative: Use Automated Deployment Script

If you set up the deployment script from DEPLOYMENT.md:

```bash
# Run the automated deployment script (as root)
sudo /usr/local/bin/deploy-bearadventures.sh
```

This script will:
- Create a backup
- Pull latest changes
- Install dependencies
- Build the application
- Restart services
- Test the deployment
- Rollback if there are issues

## Verification Steps

After deployment, verify:

1. **Build Success**: No compilation errors
2. **Application Running**: `pm2 status` shows running
3. **Web Access**: `curl -I https://beta.bearadventures.travel` returns 200
4. **UI Components**: Check that pages load without module errors
5. **Logs Clean**: `pm2 logs` shows no import/module errors

## What Was Fixed

### Local Changes (Already Committed)
- ✅ Moved `autoprefixer` from devDependencies to dependencies
- ✅ Moved `postcss` from devDependencies to dependencies
- ✅ All UI components (`button.tsx`, `card.tsx`, `badge.tsx`) are committed
- ✅ Local build tested and working

### Production Environment
- 🔄 Need to pull latest code with dependency fixes
- 🔄 Need to reinstall dependencies to include autoprefixer
- 🔄 Need to rebuild application with proper dependencies

## Troubleshooting

If issues persist:

### Check Dependencies
```bash
npm ls autoprefixer postcss
# Should show these packages are installed
```

### Check Node.js Version
```bash
node --version
# Should be v20.x.x (LTS)
```

### Check UI Component Files
```bash
ls -la components/ui/
# Should show button.tsx, card.tsx, badge.tsx
```

### Check TypeScript Path Resolution
```bash
cat tsconfig.json | grep -A 5 "paths"
# Should show "@/*": ["./*"] mapping
```

### View Detailed Error Logs
```bash
pm2 logs bearadventures-beta --lines 50
npm run build --verbose
```

## Next Steps After Fix

1. Monitor application logs for any remaining issues
2. Test all pages to ensure UI components load correctly
3. Run health checks to verify stability
4. Consider setting up automated monitoring

---

**Last Updated**: $(date +%Y-%m-%d %H:%M:%S)
**Status**: Ready for deployment