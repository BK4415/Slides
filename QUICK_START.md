# PrismPuzzle - Quick Start Guide

## 🚀 Setup (2 minutes)

### Step 1: Download
Extract the project files to a folder on your computer.

### Step 2: Start Local Server
Service Workers require a local server. Choose your method:

**Python 3** (Windows/Mac/Linux):
```bash
cd prism-puzzle-folder
python -m http.server 8000
```

**Python 2** (older systems):
```bash
cd prism-puzzle-folder
python -m SimpleHTTPServer 8000
```

**Node.js** (install http-server first):
```bash
npm install -g http-server
cd prism-puzzle-folder
http-server
```

**Docker**:
```bash
docker run -p 8000:80 -v $(pwd):/usr/share/nginx/html nginx
```

### Step 3: Open in Browser
- Navigate to: `http://localhost:8000`
- Accept browser's install prompt (optional)
- Bookmark for quick access

---

## 🎮 How to Play

### Start a Game
1. **Select Style**: Choose "Number" or "Photo"
2. **Choose Size**: 3×3 (easy) to 7×7 (hard)
3. **Pick Mode** (Numbers only):
   - Classic: 1-N in order
   - Snake: Left-to-right, zigzag
   - Spiral: Spiral from outside
   - Upside Down: N-1 in reverse
4. **Tap Play**
5. **Make First Move** - Timer starts after first move
6. **Solve the Puzzle!**

### Controls
- **Drag Tiles**: Swipe from any tile toward the empty space
- **Multi-Drag**: Multiple tiles slide together when connected
- **Shuffle**: Randomize before first move (unlimited)
- **Undo/Redo**: Revert or replay moves
- **Hint**: Get suggestion for next move
- **Pause**: Pause and resume anytime

### Photo Mode
- Tap **Numbers** toggle to show/hide tile numbers
- Numbers help identify tiles by position
- Custom images via **Upload Custom Image**

---

## 🏆 Scoring

### Stars (per board)
- ⭐ 1 Star: Basic completion
- ⭐⭐ 2 Stars: Good time/moves
- ⭐⭐⭐ 3 Stars: Optimal performance

### Personal Bests
- **Best Time**: Fastest completion
- **Best Moves**: Fewest moves needed
- **Streaks**: Consecutive wins

### Achievements
10 badges unlock through gameplay:
- First Win
- 10 Wins
- Speed Demon
- Minimalist
- Perfect Score
- On Fire (5-win streak)
- Photo Master
- Big Brain (7×7)
- Custom Creator
- All Modes Master

---

## 📸 Adding Custom Photos

### Step 1: Prepare Image
- Must be image format (JPG, PNG, etc.)
- Aspect ratio: Square (or will be cropped)
- Recommended size: 512×512px or larger

### Step 2: Add to Game
**Method A - In Game**:
1. Select "Photo" style
2. Tap "Upload Custom Image"
3. Select your image

**Method B - File System**:
1. Place image in: `assets/images/photos/`
2. Name it: `photo1.jpg`, `photo2.jpg`, etc.
3. Restart game

### Step 3: Use in Game
Your images auto-appear in the photo selector!

---

## ⚙️ Settings

### In-Game (Menu → Settings)
- ✓ Sound Effects
- ✓ Vibration
- Reset This Game

### Dashboard
- View statistics and achievements
- Reset All Data (careful - permanent!)

---

## 💾 Data & Privacy

### What's Stored
✓ Game statistics (plays, wins, times)
✓ Best scores (per board/mode)
✓ Achievements unlocked
✓ Preferences (sound, vibration)
✓ Custom images (encrypted locally)

### Privacy Guaranteed
✗ No server communication
✗ No data collection
✗ No tracking
✗ No third-party access

All data stays on YOUR device.

---

## 🔧 Troubleshooting

### "Service Worker error"
- Ensure running on local server (not file://)
- Check browser console (F12)
- Clear cache: Settings → Developer → Application → Clear Storage

### "Games not saving"
- Check LocalStorage isn't disabled
- Try clearing browser cache
- Disable browser privacy mode

### "Images not loading"
- Verify image paths in `assets/images/photos/`
- Check browser console for 404 errors
- Ensure images are correct format

### "Game lags/stutters"
- Close other browser tabs
- Disable animations if on old device
- Update browser to latest version

### "Can't install app"
- Only works on HTTPS or localhost
- Try different browser
- Check device storage space

---

## 📱 Mobile Tips

### Installation
1. Open game in mobile browser
2. Tap menu (three dots or share)
3. Select "Add to Home Screen" or "Install App"
4. Confirm
5. App appears on home screen!

### Optimizations
- **Works Offline**: Perfect for flights, subways
- **Battery Efficient**: Minimal animations
- **Auto-Save**: Progress auto-saves
- **Responsive**: Works on any screen size

---

## 🌐 Deployment

### Hosting Options
- **GitHub Pages**: Free, easy setup
- **Netlify**: Drag-and-drop deployment
- **Vercel**: Optimized for performance
- **Any web server**: Requires HTTPS for PWA

### Deploy Steps
1. Upload files to web server
2. Ensure HTTPS enabled
3. Test PWA installation
4. Done!

---

## 🎓 Tips & Tricks

### Solve Faster
- Plan 2-3 moves ahead
- Move fewer tiles = fewer moves
- Smaller boards for speed runs
- Practice Classic mode first

### Unlock Achievements
- Play all modes and sizes
- Get 3 stars on each
- Use custom images
- Build streaks

### Battery Saver
- Disable sound/vibration
- Use dark theme
- Close other apps
- Reduce screen brightness

---

## ❓ FAQ

**Q: Can I play offline?**
A: Yes! 100% offline. Works without internet.

**Q: Will my progress sync?**
A: No. Data stored locally only. Install on other devices separately.

**Q: How many custom images?**
A: Upload 1 at a time. Can swap images anytime.

**Q: Is this open source?**
A: Not currently. Fully offline game for your device.

**Q: Can I play on tablet?**
A: Yes! Fully responsive on any screen size.

**Q: How do I uninstall?**
A: Remove app from home screen (long press) or clear browser data.

---

## 📞 Support

### Issues?
1. Read this guide completely
2. Check README.md for detailed info
3. Clear browser cache
4. Try different browser
5. Reinstall the app

### Questions?
This game is self-contained with built-in help:
- Tap Info icon → Guide section
- Tap Menu → Help

---

## 🎯 Learning Outcomes

By playing PrismPuzzle, you'll develop:
- **Spatial Reasoning**: Visualize tile positions
- **Problem Solving**: Plan move sequences
- **Pattern Recognition**: Identify efficient solutions
- **Time Management**: Beat personal bests
- **Strategic Thinking**: Balance speed vs. precision

---

## 🏅 Benchmark Times

Professional Speed Solvers:
- 3×3: < 15 seconds
- 4×4: < 90 seconds
- 5×5: < 5 minutes
- 6×6: < 15 minutes
- 7×7: < 30 minutes

**Challenge yourself!**

---

Enjoy PrismPuzzle! 🎮✨

**Version 1.0.0** | **Offline First** | **Zero Tracking**
