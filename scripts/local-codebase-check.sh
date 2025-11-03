#!/bin/bash
# Local Codebase Check - Compare local codebase state for server assessment

echo "=========================================="
echo "Local Codebase Information"
echo "=========================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT" || exit 1

echo "Project Root: $PROJECT_ROOT"
echo ""

# Git Information
echo "=== Git Status ==="
echo "Current branch: $(git branch --show-current)"
echo "Last commit: $(git log -1 --oneline)"
echo "Commit hash: $(git rev-parse HEAD)"
echo ""

# Package Information
echo "=== Package Information ==="
if [ -f "package.json" ]; then
    echo "Version: $(grep -o '"version": "[^"]*"' package.json | head -1 | cut -d'"' -f4)"
    echo ""
    echo "Key dependencies:"
    echo "  - next: $(grep -o '"next": "[^"]*"' package.json | cut -d'"' -f4)"
    echo "  - react: $(grep -o '"react": "[^"]*"' package.json | cut -d'"' -f4)"
    echo "  - react-dom: $(grep -o '"react-dom": "[^"]*"' package.json | cut -d'"' -f4)"
fi
echo ""

# Build Status
echo "=== Build Status ==="
if [ -d ".next" ]; then
    echo "✓ Build directory exists"
    BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
    BUILD_DATE=$(stat -c "%y" .next 2>/dev/null | cut -d' ' -f1,2 | cut -d'.' -f1)
    echo "  Size: $BUILD_SIZE"
    echo "  Last built: $BUILD_DATE"
else
    echo "✗ Build directory does not exist"
    echo "  Run 'npm run build' to create build"
fi
echo ""

# Dependencies
echo "=== Dependencies ==="
if [ -d "node_modules" ]; then
    MODULE_COUNT=$(find node_modules -type d -maxdepth 1 2>/dev/null | wc -l)
    echo "✓ node_modules exists ($MODULE_COUNT packages)"
else
    echo "✗ node_modules not found"
    echo "  Run 'npm install' to install dependencies"
fi
echo ""

# Environment Files
echo "=== Environment Files ==="
if [ -f ".env.local" ]; then
    echo "✓ .env.local exists"
else
    echo "○ .env.local not found (optional for local dev)"
fi

if [ -f ".env.production" ]; then
    echo "✓ .env.production exists"
else
    echo "○ .env.production not found (will be created on server)"
fi
echo ""

# Critical Files Check
echo "=== Critical Files ==="
CRITICAL_FILES=(
    "package.json"
    "next.config.js"
    "tsconfig.json"
    "app/layout.tsx"
    "app/page.tsx"
    "lib/site-config.ts"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ $file MISSING"
    fi
done
echo ""

# Image Assets (count references vs actual files)
echo "=== Image Assets ==="
IMAGE_REFS=$(grep -r "/images/" app --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
IMAGE_FILES=$(find public/images -type f 2>/dev/null | wc -l)

echo "Image references in code: $IMAGE_REFS"
echo "Image files in public/images: $IMAGE_FILES"
echo ""

if [ "$IMAGE_FILES" -lt "$IMAGE_REFS" ]; then
    echo "⚠ Warning: More image references than actual files"
    echo "  Missing images will cause 404 errors"
fi
echo ""

echo "=========================================="
echo "Local check complete"
echo "=========================================="
echo ""
echo "Use this information to compare with server state."

