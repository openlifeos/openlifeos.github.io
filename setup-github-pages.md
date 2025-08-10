# GitHub Pages Setup Instructions

## Repository Successfully Created! ✅

The OpenLifeOS website is now live at:
- Repository: https://github.com/openlifeos/openlifeos.github.io
- Website (after DNS): https://openlifeos.ai

## Current Status
- ✅ Landing page deployed
- ✅ CNAME file configured for openlifeos.ai
- ✅ All demo pages available
- ✅ Vercel configuration ready (as backup)

## Next Steps

### 1. Enable GitHub Pages
1. Go to: https://github.com/openlifeos/openlifeos.github.io/settings/pages
2. Under "Source", select: **Deploy from a branch**
3. Branch: **master** / folder: **/ (root)**
4. Click **Save**

### 2. Configure GoDaddy DNS
Add these DNS records in your GoDaddy account:

```
Type    Name    Value                   TTL
A       @       185.199.108.153        600 seconds
A       @       185.199.109.153        600 seconds
A       @       185.199.110.153        600 seconds
A       @       185.199.111.153        600 seconds
CNAME   www     openlifeos.github.io   600 seconds
```

### 3. Verify DNS Propagation
- Check status: https://dnschecker.org/#A/openlifeos.ai
- Usually takes 10-30 minutes, can take up to 48 hours

### 4. Add GitHub Actions (Optional)
To add automatic deployment workflow, create this file manually in GitHub:

**.github/workflows/deploy.yml**
```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [master, main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Pages
        uses: actions/configure-pages@v3
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: '.'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

## Available Routes
Once DNS is configured, these routes will work:
- https://openlifeos.ai - Landing page
- https://openlifeos.ai/demo - Main presentation
- https://openlifeos.ai/playground - Interactive playground
- https://openlifeos.ai/demos/life-os-complete.html - Complete demo
- https://openlifeos.ai/demos/presentation-final.html - Competition presentation

## Alternative Deployment (Vercel)
If you prefer Vercel instead:
```bash
cd openlifeos-repos/openlifeos.github.io
vercel --prod
```

## Repository Structure
```
openlifeos.github.io/
├── index.html              # Landing page ✅
├── CNAME                   # Custom domain ✅
├── vercel.json            # Vercel config ✅
├── package.json           # NPM scripts ✅
├── demos/                 # All demos ✅
│   ├── presentation-final.html
│   ├── life-os-complete.html
│   └── ...
└── assets/                # Images & logos ✅
```

## Quick Commands
```bash
# View website locally
python3 -m http.server 8080
# Open http://localhost:8080

# Push updates
git add .
git commit -m "Update website"
git push origin master
```

## Support Links
- GitHub Pages Docs: https://docs.github.com/en/pages
- GoDaddy DNS Help: https://www.godaddy.com/help/manage-dns-680
- Repository: https://github.com/openlifeos/openlifeos.github.io