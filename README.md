# PrismPuzzle

**Premium Offline Sliding Puzzle Game**

A beautifully crafted sliding puzzle game built with vanilla HTML5, CSS3, and JavaScript. 100% offline, no backend required.

## Features

### 🎮 Gameplay
- **Multiple Board Sizes**: 3×3 through 7×7 configurations
- **Multiple Game Modes**: Classic, Snake, Spiral, Upside Down
- **Two Play Styles**: Number tiles or custom photos
- **Smooth 60FPS Animation**: Responsive multi-tile sliding mechanics
- **Smart Physics**: Drag multiple tiles simultaneously, momentum-based swiping

### 🏆 Progression System
- **Real-time Statistics**: Track games played, completion rate, personal bests
- **Star Rating System**: 1-3 star ratings based on moves and time
- **Achievements**: 10 unlockable achievements
- **Streak Tracking**: Current and best win streaks
- **Score Records**: Best times and moves per board/mode configuration

### 📱 Mobile Experience
- **Responsive Design**: Optimized for all screen sizes
- **Touch-First Controls**: Intuitive drag and drop with swipe support
- **PWA Compatible**: Install as app, works offline, persistent data
- **Vibration Support**: Optional haptic feedback
- **Sound Effects**: Toggle audio on/off

### 🎨 Design
- **Premium Wood Aesthetic**: Realistic wooden tile rendering
- **Glassmorphism UI**: Modern translucent design elements
- **Dark Luxury Theme**: AMOLED-friendly color scheme
- **Smooth Transitions**: High-quality animations throughout

### 🌐 Offline First
- **100% Offline**: No internet connection required
- **Service Worker**: Automatic caching of all assets
- **Local Storage**: All data persists locally on device
- **No Tracking**: Zero data collection, complete privacy

## Project Structure

```
prism-puzzle/
├── index.html              # Home page
├── game.html               # Gameplay screen
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
│
├── css/
│   ├── common.css         # Shared styles
│   ├── home.css           # Home page styles
│   └── game.css           # Game page styles
│
├── js/
│   ├── storage.js         # LocalStorage management
│   ├── preview.js         # Home page preview system
│   ├── home.js            # Home page logic
│   ├── engine.js          # Sliding puzzle engine
│   ├── game.js            # Game page logic
│   └── pwa.js             # PWA initialization
│
├── json/
│   ├── star-requirements.json    # Star threshold config
│   └── achievements.json         # Achievement definitions
│
└── assets/
    └── images/
        └── photos/        # Placeholder for photo tiles
            ├── photo1.jpg
            ├── photo2.jpg
            ├── photo3.jpg
            ├── photo4.jpg
            └── photo5.jpg
```

## Getting Started

### Installation

1. **Download/Extract Files**: Unzip the project folder
2. **Local Server** (Required for Service Worker):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (with http-server)
   npx http-server
   ```
3. **Open Browser**: Navigate to `http://localhost:8000`

### Adding Custom Images

1. Place image files in `assets/images/photos/`
2. Ensure square or near-square dimensions
3. Reference as `photo1.jpg`, `photo2.jpg`, etc.

**Recommended**:
- Format: JPEG or PNG
- Size: 512×512px or larger
- Optimization: Compress for faster loading

### Customization

#### Colors (in css/common.css)
```css
:root {
    --wood-light: #d2a679;
    --wood-mid: #8b5a2b;
    --wood-dark: #5d3a1a;
    --accent-gold: #d2a679;
    /* ... more colors ... */
}
```

#### Game Parameters (in js/engine.js)
```javascript
const MODES = ['Classic', 'Snake', 'Spiral', 'Upside Down'];
const SIZE_RANGE = [3, 4, 5, 6, 7];
const SHUFFLE_ITERATIONS = 200;
```

## Technology Stack

- **HTML5**: Semantic markup, meta tags for mobile
- **CSS3**: Grid, flexbox, gradients, animations, transitions
- **JavaScript ES6+**: Classes, arrow functions, async/await
- **Service Workers**: Offline caching and asset management
- **LocalStorage**: Persistent game data

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile, etc.)

**Note**: Service Worker support required for full PWA experience.

## Game Rules

### Solvability
All puzzles are guaranteed to be solvable:
- Shuffle algorithm uses valid moves only
- Generated positions respect permutation parity

### Scoring
- **Moves**: Count of tile movements
- **Time**: Elapsed seconds from first move
- **Stars**: 1-3 based on move/time efficiency

### First Move Timer
- Timer starts after first valid tile movement
- Allows puzzle inspection before timer begins

## Storage & Privacy

### Stored Data
- Game statistics (plays, completions, streaks)
- Score records (best times/moves per configuration)
- Achievements (unlocked badges)
- User preferences (sound, vibration, UI settings)
- Custom uploaded images (in Base64)

### Privacy
- ✅ No server communication
- ✅ No tracking or analytics
- ✅ No third-party dependencies
- ✅ No data collection
- ✅ User data never leaves device

### Clearing Data
Users can reset all data via Dashboard → Reset All Data

## Debugging

### LocalStorage Inspector
```javascript
// View all stored data
Object.keys(localStorage)
    .filter(k => k.startsWith('prism_puzzle_'))
    .forEach(k => console.log(k, localStorage.getItem(k)))

// Clear all data
Object.keys(localStorage)
    .filter(k => k.startsWith('prism_puzzle_'))
    .forEach(k => localStorage.removeItem(k))
```

### Service Worker Status
```javascript
// Check registration
navigator.serviceWorker.ready.then(reg => console.log('SW ready', reg))

// View cached assets
caches.open('prism-puzzle-v1').then(c => c.keys().then(keys => console.log(keys)))
```

## Performance

### Optimizations
- RequestAnimationFrame for 60FPS rendering
- CSS transforms for GPU acceleration
- Efficient DOM updates
- Lazy image loading
- Minimal reflows/repaints

### File Sizes
- HTML: ~15KB total
- CSS: ~25KB minified
- JavaScript: ~45KB minified
- Total gzipped: ~20KB

## Mobile Considerations

### Touch Optimization
- Pointer events for unified touch/mouse/pen support
- Larger touch targets (40px+ buttons)
- Swipe gesture detection
- Prevent double-tap zoom

### Responsive Design
- Mobile-first CSS
- Safe area insets for notches
- Viewport-relative sizing (vmin)
- Flexible grid layouts

### Performance
- No blocking scripts
- Async resource loading
- Minimal animations on low-end devices
- Battery-efficient polling

## License & Credits

- **Design & Development**: PrismPuzzle Team
- **Inspiration**: Classic sliding puzzle games
- **Technology**: HTML5, CSS3, JavaScript ES6+

## Known Limitations

- Storage quota varies by browser (typically 5-50MB)
- Large images may exceed storage limits
- Some older browsers lack SW support
- iOS PWA limitations (cache behavior)

## Future Enhancements

Potential features for future versions:
- Multiplayer challenges
- Leaderboards (cloud sync)
- Theme customization
- Advanced hint system
- Daily challenges
- Replay system
- Video tutorials

## Support

For issues or questions:
1. Check this README
2. Clear browser cache/storage
3. Try incognito mode
4. Verify browser compatibility
5. Test on different device

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Stable
