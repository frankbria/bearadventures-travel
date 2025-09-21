# Production Server Fix Commands - Module Resolution Issues

## Issue Analysis

The production server is missing the UI components that were committed in repository commit `768d170`. The error shows:

- `Can't resolve '@/components/ui/button'`
- `Can't resolve '@/components/ui/card'`
- `Can't resolve '@/components/ui/badge'`
- `Can't resolve '@/components/content/BlogCard'`

## Root Cause

The production server's git repository is **outdated** and doesn't have the commits containing the UI components. The components were added in commit `768d170` and are present in the main branch.

## ⚠️ CRITICAL: Execute These Commands on Production Server

### Step 1: Check Current Git Status
```bash
# Connect to production server and switch to app user
sudo su - bearadventures
cd /var/www/bearadventures/app

# Check current git commit
git log --oneline -1
git status

# Check what files are missing
ls -la components/ui/
ls -la components/content/
ls -la lib/
```

### Step 2: Force Pull Latest Code
```bash
# Backup current state (just in case)
cp -r . /tmp/app-backup-$(date +%Y%m%d-%H%M%S)

# Reset any local changes and pull latest
git fetch origin
git reset --hard origin/main

# Verify we got the latest commit (should be 8f994b8)
git log --oneline -1

# Verify UI components now exist
ls -la components/ui/button.tsx
ls -la components/ui/card.tsx
ls -la components/ui/badge.tsx
ls -la components/content/BlogCard.tsx
ls -la lib/utils.ts
```

### Step 3: Clean and Reinstall Dependencies
```bash
# Remove old dependencies and install fresh
rm -rf node_modules package-lock.json

# Install with production dependencies (autoprefixer now included)
npm ci --only=production

# Verify critical dependencies are installed
npm ls autoprefixer postcss clsx tailwind-merge class-variance-authority
```

### Step 4: Clean Build Environment and Test
```bash
# Remove any cached build artifacts
rm -rf .next

# Verify tsconfig.json has correct path mappings
cat tsconfig.json | grep -A 5 "paths"
# Should show: "@/*": ["./*"]

# Test build
npm run build
```

### Expected Success Output:
```
✓ Compiled successfully
✓ Generating static pages (9/9)
Route (app)                              Size     First Load JS
┌ ○ /                                    3.8 kB          160 kB
├ ○ /_not-found                          873 B            88 kB
├ ○ /about                               5.43 kB         151 kB
├ ○ /blog                                2.17 kB         158 kB
...
```

### Step 5: Restart Application (only after successful build)
```bash
# Exit back to root user
exit

# Restart PM2 application
pm2 restart bearadventures-beta

# Check status
pm2 status
pm2 logs bearadventures-beta --lines 10
```

### Step 6: Verify Deployment
```bash
# Test the website
curl -I https://beta.bearadventures.travel
# Should return HTTP/1.1 200 OK

# Test a specific page that uses UI components
curl -s https://beta.bearadventures.travel/about | grep -i "error\|404\|500" || echo "Page loads successfully"
```

## Alternative: Use Automated Deployment Script

If the deployment script was set up as per DEPLOYMENT.md:

```bash
# This should automatically handle all the above steps
sudo /usr/local/bin/deploy-bearadventures.sh
```

## Troubleshooting If Build Still Fails

### Check Git Repository State
```bash
sudo su - bearadventures
cd /var/www/bearadventures/app

# Verify we're on the right branch and commit
git branch -v
git log --oneline -5

# Should show:
# * main 8f994b8 Fix production build errors
```

### Verify Component Files Exist
```bash
# These should all exist and not be empty
ls -la components/ui/button.tsx
ls -la components/ui/card.tsx
ls -la components/ui/badge.tsx
ls -la components/content/BlogCard.tsx
ls -la lib/utils.ts

# Check file contents are not empty
wc -l components/ui/button.tsx
# Should show ~58 lines
```

### Check TypeScript Configuration
```bash
# Verify tsconfig.json has correct paths
cat tsconfig.json | grep -A 10 '"paths"'

# Should show:
# "paths": {
#   "@/*": ["./*"]
# }
```

### Check Dependencies
```bash
# Verify all required packages are installed
npm ls | grep -E "(clsx|tailwind-merge|class-variance-authority|@radix-ui)"

# If any are missing:
npm install --only=production
```

### Manual File Verification
```bash
# Test if TypeScript can resolve the imports
npx tsc --noEmit --listFiles | grep components/ui
```

## What Should Be Fixed After These Commands

1. ✅ **Git Repository**: Latest code with all UI components
2. ✅ **Dependencies**: autoprefixer, postcss, and all UI dependencies
3. ✅ **File Structure**: All component files present and accessible
4. ✅ **Path Resolution**: @/ alias working correctly
5. ✅ **Build Process**: Next.js can find and compile all modules
6. ✅ **Application**: Running without module resolution errors

## Files That Should Exist After Fix

```
components/
├── ui/
│   ├── button.tsx      (✅ Radix UI button component)
│   ├── card.tsx        (✅ Card component with sub-components)
│   ├── badge.tsx       (✅ Badge component)
│   ├── input.tsx       (✅ Input component)
│   ├── navigation-menu.tsx
│   └── sheet.tsx
├── content/
│   ├── BlogCard.tsx    (✅ Blog card component)
│   └── TripCard.tsx    (✅ Trip card component)
└── layout/
    ├── Header.tsx
    └── Footer.tsx

lib/
├── utils.ts            (✅ cn() utility function)
├── content.ts
├── blog-data.ts
└── site-config.ts
```

## Success Criteria

After running these commands:
- ✅ `npm run build` completes without module resolution errors
- ✅ All 9 pages generate successfully
- ✅ PM2 shows application running
- ✅ Website accessible at https://beta.bearadventures.travel
- ✅ No "Module not found" errors in PM2 logs

---

**Execute these commands in order and the build should succeed!**

**Last Updated**: $(date +%Y-%m-%d %H:%M:%S)