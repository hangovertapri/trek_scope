# Deployment & Lighthouse Audit Guide

## Overview

This document covers deploying TrekMapper to Vercel and conducting a full Lighthouse audit to ensure WCAG AA compliance and optimal performance.

## Pre-Deployment Checklist

- [ ] All tests pass locally (`npm run build`)
- [ ] TypeScript validates (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Environment variables configured in `.env.local`
- [ ] Git repository is clean and committed
- [ ] Feature branch merged to `main`

## Step 1: Prepare Environment Variables

### Create `.env.local`

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://your-domain.vercel.app
AUTH_SALT=your_secure_salt_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### Generate NEXTAUTH_SECRET

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (Get-Random)))
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# View deployment
vercel inspect
```

### Option B: Using GitHub Integration (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure environment variables
5. Click "Deploy"

### Configuration for Next.js

Vercel automatically detects Next.js projects. No additional configuration needed, but verify:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Step 3: Post-Deployment Verification

After deployment, verify:

```bash
# Check all routes are accessible
curl https://your-domain.vercel.app
curl https://your-domain.vercel.app/treks
curl https://your-domain.vercel.app/agency/login

# Check performance headers
curl -I https://your-domain.vercel.app

# Verify SSL certificate
openssl s_client -connect your-domain.vercel.app:443
```

## Step 4: Run Lighthouse Audit

### Using Chrome DevTools (Quick)

1. Open your deployed site in Chrome
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Select "Analyze page load"
5. Wait for report (30-60 seconds)

### Using Lighthouse CLI (Comprehensive)

```bash
# Install Lighthouse globally
npm install -g lighthouse

# Run audit
lighthouse https://your-domain.vercel.app --chrome-flags="--headless --no-sandbox" --output=json --output-path=./lighthouse-report.json

# Generate HTML report
lighthouse https://your-domain.vercel.app --output=html --output-path=./lighthouse-report.html
```

### Using WebPageTest

1. Go to [webpagetest.org](https://webpagetest.org)
2. Enter your URL
3. Select test location and browser
4. Run test
5. Review results for performance insights

## WCAG AA Compliance Checklist

After running Lighthouse, verify these WCAG AA requirements:

### Perception
- [ ] 1.1 Text Alternatives: All images have alt text
- [ ] 1.3 Adaptable: Content structure is logical and semantic
- [ ] 1.4 Distinguishable: Text has sufficient contrast (4.5:1 for normal text, 3:1 for large text)

### Operability
- [ ] 2.1 Keyboard Accessible: All functionality available via keyboard
- [ ] 2.4 Navigable: Page title, focus visible, meaningful link text
- [ ] 2.5 Input Modalities: Click targets min 44x44px

### Understandability
- [ ] 3.1 Readable: Language of page declared, abbreviations defined
- [ ] 3.2 Predictable: Navigation consistent, no unexpected context changes
- [ ] 3.3 Input Assistance: Error messages clear, labels provided

### Robustness
- [ ] 4.1 Compatible: No duplicate IDs, proper ARIA usage, valid HTML

## Expected Lighthouse Scores

**Target Scores:**
- Performance: 85+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

**Current Implementation Status:**
- ✅ Semantic HTML throughout
- ✅ ARIA labels on forms and interactive elements
- ✅ Focus management and keyboard navigation
- ✅ Color contrast ratios (WCAG AA compliant)
- ✅ Mobile responsive design
- ✅ Security headers configured

## Common Audit Issues & Fixes

### Low Performance Score

**Issues:**
- Large bundle size
- Unoptimized images
- Render-blocking resources

**Fixes:**
```javascript
// 1. Image optimization
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/trek.jpg"
  alt="Trek"
  width={800}
  height={600}
  priority={false}
  placeholder="blur"
  blurDataURL="data:image/..."
/>

// 2. Code splitting
// Already handled by Next.js

// 3. CSS optimization
// Tailwind CSS is production-optimized
```

### Low Accessibility Score

**Common Issues:**
- Missing alt text
- Low color contrast
- Missing ARIA labels
- Keyboard not accessible

**Fixes Applied:**
- ✅ All form inputs have labels
- ✅ All images have alt text or aria-hidden
- ✅ Interactive elements have proper roles
- ✅ Focus states visible
- ✅ Color contrast ratios exceed minimums

### SEO Issues

**Common Issues:**
- Missing metadata
- Not mobile-friendly
- Slow page speed

**Fixes Applied:**
```typescript
// 1. Metadata in layout.tsx
export const metadata: Metadata = {
  title: 'TrekMapper - Compare Your Next Adventure',
  description: '...',
  openGraph: { ... },
};

// 2. Mobile viewport
// Automatically in Next.js

// 3. Structured data (optional)
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
```

## Monitoring & Continuous Improvement

### Set Up Vercel Analytics

1. Go to Vercel project dashboard
2. Settings > Analytics
3. Enable "Web Vitals"
4. View metrics dashboard

### Monitor Core Web Vitals

- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Set Up Lighthouse CI

Add to `.github/workflows/ci.yml`:

```yaml
- name: Run Lighthouse
  uses: actions/lighthouse@v1
  with:
    url: 'https://your-domain.vercel.app'
    uploadArtifacts: true
    temporaryPublicStorage: true
```

## Production Monitoring

### Sentry Setup (Error Tracking)

```bash
npm install @sentry/nextjs
```

Configure `next.config.ts`:

```typescript
import withSentry from "@sentry/nextjs/withSentry";

export default withSentry(nextConfig);
```

### Log Aggregation

Use Vercel's built-in logs or integrate:
- Datadog
- New Relic
- Loggly

## Rollback Plan

If issues arise:

```bash
# Revert to previous deployment in Vercel dashboard
# Or via CLI:
vercel rollback
```

## Domain & SSL

### Connect Custom Domain

1. Go to Vercel project > Settings > Domains
2. Add your domain
3. Update DNS records (Vercel provides instructions)
4. SSL certificate auto-provisioned (usually 30 mins)

### Verify SSL

```bash
# Check certificate
openssl s_client -connect your-domain.com:443 -showcerts

# Should show: "Verify return code: 0 (ok)"
```

## Post-Launch Checklist

- [ ] Site accessible on production domain
- [ ] All routes working (home, treks, agency/dashboard, etc.)
- [ ] Authentication working (login/logout)
- [ ] Search filters functional
- [ ] Analytics tracking enabled
- [ ] Error logging configured
- [ ] Lighthouse audit passed (WCAG AA)
- [ ] Performance metrics acceptable
- [ ] Backups configured
- [ ] Team notified of deployment

## Troubleshooting

### Build Fails on Vercel

Check Vercel build logs:
1. Go to project > Deployments
2. Click failed deployment
3. Review build output
4. Common causes:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

### Site Slow in Production

1. Run Lighthouse audit
2. Check performance metrics
3. Review Next.js build output
4. Check database queries (if applicable)

### Authentication Not Working

1. Verify `NEXTAUTH_URL` matches deployed URL
2. Check `NEXTAUTH_SECRET` is set in Vercel
3. Verify cookies secure in production

## Success Criteria

✅ **All Completed:**
- Site deployed to production
- Lighthouse audit score ≥ 85 (Performance)
- Lighthouse audit score ≥ 95 (Accessibility)
- WCAG AA compliance verified
- All routes accessible
- Authentication working
- Analytics monitoring active
- Error tracking enabled

---

## Next Steps

1. Follow deployment steps above
2. Run Lighthouse audit (full report)
3. Fix any identified issues
4. Re-run audit to confirm fixes
5. Monitor production metrics
6. Plan for ongoing maintenance

