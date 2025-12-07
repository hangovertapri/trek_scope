#!/bin/bash

# Lighthouse Audit Script
# Run this script to perform a complete Lighthouse audit of the application

set -e

echo "================================"
echo "TrekMapper Lighthouse Audit Tool"
echo "================================"
echo ""

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "Installing Lighthouse CLI globally..."
    npm install -g lighthouse
fi

# Determine the URL to audit
URL="${1:-http://localhost:3000}"

echo "Starting development server if not running..."
npm run dev > /dev/null 2>&1 &
DEV_PID=$!
sleep 5

echo ""
echo "Running Lighthouse audit on: $URL"
echo "This may take 1-2 minutes..."
echo ""

# Run Lighthouse with detailed output
lighthouse "$URL" \
    --chrome-flags="--headless --no-sandbox" \
    --output=json \
    --output=html \
    --output-path=./lighthouse-report \
    --view

echo ""
echo "================================"
echo "✅ Audit Complete!"
echo "================================"
echo ""
echo "Reports generated:"
echo "  - lighthouse-report.html (open in browser)"
echo "  - lighthouse-report.json (machine readable)"
echo ""

# Stop dev server
kill $DEV_PID 2>/dev/null || true

# Show summary
echo "Next Steps:"
echo "  1. Review lighthouse-report.html"
echo "  2. Check Accessibility score (target: 95+)"
echo "  3. Check Performance score (target: 85+)"
echo "  4. Fix any WCAG AA violations"
echo "  5. Re-run audit to confirm fixes"
