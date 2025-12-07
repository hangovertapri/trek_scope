# CI/CD Setup Guide

## Overview

This project uses GitHub Actions for automated testing, building, and deployment to Vercel.

## What's Included

- **Automated Testing**: Runs linter, TypeScript type check, and production build on every push
- **Branch-based Deployment**: 
  - `main`/`master`: Auto-deploys to production
  - `develop`: Auto-deploys to staging/preview environment
  - `pull_request`: Runs tests but doesn't deploy
- **Build Artifacts**: Caches dependencies and uploads build outputs
- **Vercel Integration**: Seamless deployment with automatic preview URLs

## Setup Instructions

### 1. Create Vercel Account & Project

1. Go to [vercel.com](https://vercel.com) and sign up
2. Connect your GitHub account
3. Import this repository
4. Vercel will auto-detect it as a Next.js project
5. Configure environment variables if needed

### 2. Get Vercel Secrets

After importing, you'll need:

1. **VERCEL_TOKEN**: Personal access token from Vercel
   - Go to [Vercel Settings > Tokens](https://vercel.com/account/tokens)
   - Create a new token (recommend: token-ci-github)
   - Copy the token

2. **VERCEL_ORG_ID**: Your organization ID
   - Run: `vercel whoami` (after installing Vercel CLI)
   - Or find in project settings

3. **VERCEL_PROJECT_ID**: Your project ID
   - Go to project Settings > General
   - Look for "Project ID"
   - Or run: `vercel project list`

### 3. Add GitHub Secrets

1. Go to GitHub repo: **Settings > Secrets and variables > Actions**
2. Click **New repository secret**
3. Add these secrets:
   - `VERCEL_TOKEN`: Your token from step 2.1
   - `VERCEL_ORG_ID`: Your org ID from step 2.2
   - `VERCEL_PROJECT_ID`: Your project ID from step 2.3

### 4. Environment Variables

If your project needs environment variables (API keys, etc.):

1. Add to Vercel project settings
2. Or create `.env.local` (for local development only)
3. CI/CD will automatically use Vercel's configured variables

### 5. Test the Pipeline

1. Make a small change to the repo
2. Push to a feature branch: `git push origin feature/test`
3. Go to **GitHub > Actions** tab
4. Watch the workflow run
5. Tests should pass and build should succeed

### 6. Deploy to Production

1. Create a Pull Request to `main`
2. GitHub Actions will run tests automatically
3. Merge the PR to `main`
4. Workflow will auto-deploy to Vercel production
5. Check deployment status in Vercel dashboard

## Workflow Details

### On Every Push

```
1. Checkout code
2. Setup Node.js 20.x
3. Install dependencies (with cache)
4. Run linter
5. Run TypeScript type check
6. Build Next.js application
7. Upload build artifacts
```

### Production Deploy (main branch)

After tests pass on `main`:
```
1. Deploy to Vercel production
2. New version goes live
```

### Preview Deploy (develop branch)

After tests pass on `develop`:
```
1. Deploy to Vercel preview
2. Generate temporary preview URL
3. Accessible for testing before production
```

## Local Commands

For local development:

```bash
# Development
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Build (production)
npm run build

# Run production build locally
npm run start
```

## Troubleshooting

### Build Fails with "TypeScript errors"
- Run `npm run typecheck` locally
- Fix any type errors before pushing

### Build Fails with "Lint errors"
- Run `npm run lint` locally
- Fix code style issues

### Deployment Fails to Vercel
- Check that VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID are correct
- Verify token hasn't expired
- Check Vercel project settings for environment variables

### Preview URLs Not Working
- Ensure `develop` branch deployment is enabled in Vercel
- Check GitHub Actions logs for deployment errors

## Monitoring Deployments

- **GitHub Actions**: github.com/[your-repo]/actions
- **Vercel Dashboard**: vercel.com/dashboard/[project-name]
- **Deployment History**: Vercel > Deployments tab

## Next Steps

1. Set up GitHub branch protection rules:
   - Require status checks to pass before merging
   - Go to Settings > Branch protection rules
   - Add rule for `main` and `develop`

2. Configure Vercel analytics:
   - Go to Vercel project > Analytics
   - Enable Web Vitals monitoring

3. Set up notifications:
   - Slack integration for deployment status
   - GitHub notifications for failed builds

## Security Best Practices

- Never commit secrets to Git
- Rotate VERCEL_TOKEN periodically
- Use branch protection rules
- Review code before merging to `main`
- Test in `develop` before production deployment

