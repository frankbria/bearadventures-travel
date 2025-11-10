# GitHub Actions CI/CD Setup Guide

**Date:** November 10, 2025
**Project:** Bear Adventures Travel
**Repository:** https://github.com/frankbria/bearadventures-travel

## Overview

This project uses GitHub Actions for automated CI/CD with two environments:
- **Staging:** beta.bearadventures.travel (auto-deploy on push to main)
- **Production:** bearadventures.travel (manual deployment with approval)

## Workflows

### 1. CI - Build and Test (`ci.yml`)
**Triggers:** Push to main/develop, Pull Requests
**Purpose:** Validate code quality before deployment

**Steps:**
- Checkout code
- Setup Node.js 22
- Install dependencies
- Run type checking
- Run linting (non-blocking)
- Run tests (non-blocking)
- Build application
- Upload build artifacts

### 2. Deploy to Staging (`deploy-staging.yml`)
**Triggers:** Push to main branch, Manual trigger
**Environment:** staging
**URL:** https://beta.bearadventures.travel

**Steps:**
- Build application
- SSH to staging server
- Pull latest code
- Install dependencies
- Build on server
- Restart PM2 process
- Verify deployment

### 3. Deploy to Production (`deploy-production.yml`)
**Triggers:** Manual only (workflow_dispatch)
**Environment:** production (requires approval)
**URL:** https://bearadventures.travel

**Steps:**
- Requires manual confirmation ("deploy")
- Build application
- Run smoke tests
- SSH to production server
- Pull latest code
- Install dependencies
- Build on server
- Restart PM2 process
- Verify deployment
- Create deployment tag

## GitHub Setup Required

### Step 1: Create Environments

1. Go to **Settings** > **Environments** in GitHub repository
2. Create two environments:

#### Staging Environment
- **Name:** `staging`
- **Deployment protection:** None (auto-deploy)
- **URL:** `https://beta.bearadventures.travel`

#### Production Environment
- **Name:** `production`
- **Deployment protection:** ✅ Required reviewers (add yourself)
- **URL:** `https://bearadventures.travel`

### Step 2: Add Secrets

Go to **Settings** > **Secrets and variables** > **Actions**

#### Environment Secrets (Staging)

Click on "staging" environment > Add secret:

```
STAGING_HOST=<your-staging-server-ip-or-domain>
STAGING_USER=<ssh-username>
STAGING_SSH_KEY=<private-ssh-key-content>
STAGING_PORT=22
STAGING_DEPLOY_PATH=/var/www/beta.bearadventures.travel
```

#### Environment Secrets (Production)

Click on "production" environment > Add secret:

```
PRODUCTION_HOST=<your-production-server-ip-or-domain>
PRODUCTION_USER=<ssh-username>
PRODUCTION_SSH_KEY=<private-ssh-key-content>
PRODUCTION_PORT=22
PRODUCTION_DEPLOY_PATH=/var/www/bearadventures.travel
```

### Step 3: Server Setup

On both staging and production servers:

```bash
# 1. Clone repository
cd /var/www
sudo mkdir -p beta.bearadventures.travel
sudo chown $USER:$USER beta.bearadventures.travel
cd beta.bearadventures.travel
git clone https://github.com/frankbria/bearadventures-travel.git .

# 2. Install dependencies
npm install

# 3. Create .env.production file
cat > .env.production << EOF
NODE_ENV=production
# Add other environment variables as needed
EOF

# 4. Build application
npm run build

# 5. Install PM2 globally (if not installed)
npm install -g pm2

# 6. Start application with PM2
pm2 start npm --name "bearadventures-staging" -- start
pm2 save
pm2 startup  # Follow the instructions

# 7. Configure nginx/Apache reverse proxy to point to localhost:3000
```

### Step 4: SSH Key Setup

Generate SSH key for GitHub Actions:

```bash
# On your local machine or server
ssh-keygen -t ed25519 -C "github-actions-bearadventures" -f ~/.ssh/github_actions_bearadventures

# Copy public key to servers
ssh-copy-id -i ~/.ssh/github_actions_bearadventures.pub user@staging-server
ssh-copy-id -i ~/.ssh/github_actions_bearadventures.pub user@production-server

# Copy private key content for GitHub Secrets
cat ~/.ssh/github_actions_bearadventures
# Paste this into STAGING_SSH_KEY and PRODUCTION_SSH_KEY secrets
```

## Usage

### Automatic Staging Deployment

1. Push code to `main` branch:
   ```bash
   git push origin main
   ```

2. GitHub Actions automatically:
   - Runs CI checks
   - Deploys to beta.bearadventures.travel
   - Verifies deployment

3. Check deployment status:
   - GitHub Actions tab
   - Visit: https://beta.bearadventures.travel

### Manual Production Deployment

1. Go to **Actions** > **Deploy to Production**
2. Click **Run workflow**
3. Type "deploy" in confirmation field
4. Click **Run workflow** button
5. Wait for approval notification (if configured)
6. Approve deployment
7. Monitor deployment progress
8. Verify at: https://bearadventures.travel

## Environment Variables

### Required on Server

Create `.env.production` on both staging and production servers:

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://beta.bearadventures.travel  # or bearadventures.travel
# Add other environment variables as needed
```

## Troubleshooting

### Deployment Fails

1. Check GitHub Actions logs
2. Verify SSH connection:
   ```bash
   ssh -i ~/.ssh/github_actions_bearadventures user@server
   ```
3. Check server logs:
   ```bash
   pm2 logs bearadventures-staging
   pm2 status
   ```

### Build Fails

1. Run locally:
   ```bash
   npm run build
   ```
2. Check for type errors:
   ```bash
   npm run type-check
   ```
3. Check for linting errors:
   ```bash
   npm run lint
   ```

### Rollback

To rollback a deployment:

```bash
# SSH to server
cd /var/www/beta.bearadventures.travel
git checkout <previous-commit-hash>
npm ci
npm run build
pm2 restart bearadventures-staging
```

Or use production tags:

```bash
git checkout production-YYYYMMDD-HHMMSS
```

## Monitoring

### Check Deployment Status

```bash
# View PM2 status
pm2 status

# View logs
pm2 logs bearadventures-staging --lines 100

# Monitor in real-time
pm2 monit
```

### GitHub Actions Status Badge

Add to README.md:

```markdown
![CI](https://github.com/frankbria/bearadventures-travel/actions/workflows/ci.yml/badge.svg)
![Staging](https://github.com/frankbria/bearadventures-travel/actions/workflows/deploy-staging.yml/badge.svg)
```

## Next Steps

1. ✅ Create GitHub environments (staging, production)
2. ✅ Add all required secrets
3. ✅ Set up SSH keys
4. ✅ Configure servers (PM2, nginx)
5. ✅ Test staging deployment
6. ✅ Test production deployment
7. ✅ Add status badges to README

## Security Notes

- Never commit SSH keys or secrets to repository
- Use environment-specific secrets in GitHub
- Limit SSH key permissions on servers
- Enable 2FA on GitHub account
- Regularly rotate SSH keys
- Use required reviewers for production

## Support

For issues or questions:
- Check GitHub Actions logs
- Review this documentation
- Contact: frank@bearadventures.travel
