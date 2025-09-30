# School Portal PWA - Deployment Guide

## 🚀 PWA Setup & GitHub Pages Deployment

### Prerequisites
- Node.js 18+
- Yarn package manager
- GitHub account
- GitHub repository

### 📱 PWA Configuration

Your project is already configured as a PWA with:
- **Service Worker**: Automatic caching and offline support
- **Web App Manifest**: Installable on mobile devices
- **Update Notifications**: Automatic app updates
- **Offline Support**: Works without internet connection

### 🔧 Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

### 🌐 GitHub Pages Deployment

#### Option 1: Manual Deployment

```bash
# Install gh-pages package
yarn add -D gh-pages

# Build the project
yarn build

# Deploy to GitHub Pages
yarn deploy
```

#### Option 2: Automatic Deployment (Recommended)

1. **Enable GitHub Pages** in your repository:
   - Go to Settings → Pages
   - Set source to "GitHub Actions"

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy PWA to GitHub Pages"
   git push origin main
   ```

3. **GitHub Actions** will automatically:
   - Build your PWA
   - Deploy to GitHub Pages
   - Generate PWA assets

### 📋 PWA Features

- **Installable**: Users can install like a native app
- **Offline-First**: Works without internet
- **Fast Loading**: Cached resources
- **Auto-Updates**: New versions download automatically
- **Cross-Platform**: Works on desktop and mobile

### 🔍 Testing PWA Features

1. **Local Testing**:
   ```bash
   yarn build
   yarn preview
   ```

2. **Browser DevTools**:
   - Open Application tab
   - Check Service Workers
   - Test offline functionality

3. **Mobile Testing**:
   - Use Chrome DevTools device emulation
   - Test "Add to Home Screen"

### 🌍 Custom Domain (Optional)

To use a custom domain:

1. **Add CNAME file** to `public/` folder:
   ```
   yourdomain.com
   ```

2. **Update vite.config.js**:
   ```javascript
   base: '/school-portal/', // Your repo name
   ```

3. **Configure DNS** in your domain provider

### 📊 Build Output

After building, check `dist/` folder contains:
- `index.html`
- `assets/` (JS, CSS, images)
- `sw.js` (Service Worker)
- `manifest.webmanifest` (PWA manifest)
- PWA icons (192x192, 512x512)

### 🐛 Troubleshooting

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
yarn build
```

**PWA not working:**
- Check browser console for errors
- Verify service worker registration
- Test in incognito mode

**GitHub Pages issues:**
- Ensure repository name matches `base` in vite.config.js
- Check GitHub Actions logs
- Verify Pages settings in repository

### 📞 Support

For issues with:
- **PWA**: Check browser DevTools → Application tab
- **Build**: Check terminal output and `dist/` folder
- **Deployment**: Check GitHub Actions logs

---

**Live Demo**: `https://[username].github.io/school-portal/`