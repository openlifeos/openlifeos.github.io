#!/bin/bash

# Deploy MIT Landing Page Script
# Run this to immediately deploy the MIT summit page

echo "🚀 Deploying MIT Human Augmentation Summit Landing Page..."
echo "================================================"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Not in openlifeos.github.io directory"
    echo "Please cd to openlifeos-repos/openlifeos.github.io first"
    exit 1
fi

# Check if MIT folder exists
if [ ! -d "mit" ]; then
    echo "❌ Error: MIT folder not found"
    echo "The mit/ folder with index.html should exist"
    exit 1
fi

# Git operations
echo "📦 Adding MIT landing page to git..."
git add mit/

echo "💾 Committing changes..."
git commit -m "🚀 Deploy MIT Human Augmentation Summit landing page

- Live demo with Matrix-style knowledge downloads
- Real-time cost comparison (Cursor loses vs OpenLifeOS earns)
- Interactive 3-second PhD download simulation
- Event details for August 23, 2025
- Mobile responsive design
- Works offline after first load"

echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deployment complete!"
echo "================================================"
echo ""
echo "🌐 Your MIT landing page will be live in ~2 minutes at:"
echo "   https://openlifeos.github.io/mit"
echo ""
echo "📱 Test URLs:"
echo "   - Desktop: https://openlifeos.github.io/mit"
echo "   - Mobile: https://openlifeos.github.io/mit"
echo "   - QR/NFC: https://openlifeos.github.io/mit"
echo ""
echo "📋 Next Steps:"
echo "   1. Generate QR code at qr-code-generator.com"
echo "   2. Add QR code to business card design"
echo "   3. Order business cards from Moo.com"
echo "   4. Order flyers from Vistaprint"
echo "   5. Order NFC tags from Amazon"
echo ""
echo "⏰ Time remaining until MIT Summit: 12 days!"
echo ""