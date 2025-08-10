#!/bin/bash

# OpenLifeOS Website Deployment Script
# Deploys to both GitHub Pages and openlifeos.ai

echo "🚀 OpenLifeOS Website Deployment Starting..."
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the openlifeos.github.io directory"
    exit 1
fi

# Check for git changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Found changes to deploy..."
else
    echo "ℹ️  No changes detected. Proceeding anyway..."
fi

# Pre-deployment validation
echo ""
echo "🧪 Running pre-deployment checks..."

# Check if logo files exist
if [ ! -f "assets/logo/openlifeos-logo.svg" ]; then
    echo "❌ Error: Logo files missing in assets/logo/"
    exit 1
fi

# Check if critical demo files exist
if [ ! -f "demos/life-os-ultimate-v2.html" ]; then
    echo "❌ Error: Critical demo file missing"
    exit 1
fi

if [ ! -f "demos/AUGHACKS_MIT_2025_PRESENTATION_V2.html" ]; then
    echo "❌ Error: Presentation file missing"
    exit 1
fi

echo "✅ All critical files present"

# Add all changes
echo ""
echo "📦 Staging all changes..."
git add .

# Check if there are changes to commit
if [ -z "$(git diff --cached --name-only)" ]; then
    echo "ℹ️  No staged changes to commit"
else
    echo "📝 Staged changes:"
    git diff --cached --name-only
fi

# Get current date for commit message
DEPLOY_DATE=$(date "+%Y-%m-%d %H:%M:%S")

# Commit changes
echo ""
echo "💾 Committing changes..."
git commit -m "🚀 Production deployment - $DEPLOY_DATE

✨ Major OpenLifeOS website update:
- New professional logo system integrated
- AugHacks MIT 2025 presentation ready  
- Matrix knowledge downloading showcase
- Complete demo interface updates
- SEO optimization for openlifeos.ai
- Mobile-responsive design improvements
- Performance optimizations applied

Ready for competition and production use!

Deployment includes:
- Updated homepage with revolutionary features
- Competition-ready presentation materials
- Interactive demo interfaces
- Comprehensive documentation
- Cross-platform compatibility

#AugHacksMIT2025 #OpenLifeOS #AIRevolution"

# Push to GitHub
echo ""
echo "🌐 Deploying to GitHub Pages..."
echo "This will update both:"
echo "  - https://openlifeos.github.io"
echo "  - https://openlifeos.ai (via CNAME)"

git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🎯 Your website will be live at:"
    echo "   Primary: https://openlifeos.ai"
    echo "   Backup:  https://openlifeos.github.io"
    echo ""
    echo "⏱️  GitHub Pages typically takes 2-5 minutes to update"
    echo ""
    echo "🧪 Test these critical URLs once live:"
    echo "   🏠 Homepage: https://openlifeos.ai"
    echo "   🚀 Main Demo: https://openlifeos.ai/demos/life-os-ultimate-v2.html"
    echo "   📽️ Presentation: https://openlifeos.ai/demos/AUGHACKS_MIT_2025_PRESENTATION_V2.html"
    echo "   📚 Documentation: https://openlifeos.ai/docs/"
    echo ""
    echo "🏆 Ready for AugHacks MIT 2025!"
    echo ""
    echo "📊 Next steps:"
    echo "   1. Test all URLs above"
    echo "   2. Verify logo displays correctly"
    echo "   3. Check mobile responsiveness"
    echo "   4. Test demo functionality"
    echo "   5. Validate SEO meta tags"
    echo ""
    echo "🎉 OpenLifeOS is now live - 'Not an assistant. Another you.'"
    
    # Optional: Open the website in browser (macOS/Linux)
    if command -v open &> /dev/null; then
        read -p "🌐 Open website in browser? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🚀 Opening https://openlifeos.ai..."
            open "https://openlifeos.ai"
        fi
    elif command -v xdg-open &> /dev/null; then
        read -p "🌐 Open website in browser? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🚀 Opening https://openlifeos.ai..."
            xdg-open "https://openlifeos.ai"
        fi
    fi
    
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Check the error messages above and try again."
    echo ""
    echo "Common solutions:"
    echo "  1. Ensure you have push permissions to the repository"
    echo "  2. Check your Git authentication (SSH key or token)"
    echo "  3. Verify you're on the correct branch (main)"
    echo "  4. Check if there are any merge conflicts"
    exit 1
fi

echo ""
echo "=================================================="
echo "🎯 Deployment Summary:"
echo "   Status: SUCCESS ✅"
echo "   Target: openlifeos.ai + openlifeos.github.io"
echo "   Time: $DEPLOY_DATE"
echo "   Branch: main"
echo "=================================================="