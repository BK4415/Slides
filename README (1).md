# Assets Folder Structure

## Overview

This folder contains all static assets for PrismPuzzle.

```
assets/
└── images/
    └── photos/
        ├── photo1.jpg
        ├── photo2.jpg
        ├── photo3.jpg
        ├── photo4.jpg
        └── photo5.jpg
```

## 📸 Photo Tiles

### Location
`assets/images/photos/`

### File Requirements
- **Format**: JPEG (.jpg) or PNG (.png)
- **Naming**: `photo1.jpg`, `photo2.jpg`, etc.
- **Aspect Ratio**: Square (1:1) preferred
- **Dimensions**: 512×512px or larger
- **File Size**: < 500KB per image

### Adding Photos

1. Place image files in this directory
2. Name files: `photo1.jpg`, `photo2.jpg`, etc.
3. The game auto-detects up to 5 photos
4. Photos appear in Photo selector on home screen
5. Users can select preset photos or upload custom

### Supported Formats
- ✓ JPEG (.jpg, .jpeg)
- ✓ PNG (.png)
- ✓ WebP (.webp) - for modern browsers

### Recommendations

**Best Practices**:
- Use vibrant, distinct images
- Avoid single-color images (hard to solve)
- Test on mobile devices
- Optimize file size with compression

**Good Candidates**:
- Nature photography
- Landmarks
- Artwork
- Maps
- Abstract patterns
- City scenes
- Portraits
- Textures

**Avoid**:
- Very small or tiny details (hard to see)
- Uniform colors (no visual reference)
- Extremely dark/light images
- Text-heavy images

### Image Optimization

Use tools like:
- ImageOptim (Mac)
- FileOptimizer (Windows)
- TinyPNG (online)
- ImageMagick (CLI)

Example command:
```bash
# Using ImageMagick to resize and compress
convert photo1.jpg -resize 512x512 -quality 85 photo1-optimized.jpg
```

### Testing

To test custom photos:
1. Add image to this folder
2. Restart the game
3. Select "Photo" style on home screen
4. Navigate to your photo using arrows
5. Check tile rendering looks good
6. Play a game to ensure smooth performance

### Troubleshooting

**Photo not appearing**?
- Check filename: must be `photo1.jpg`, `photo2.jpg`, etc.
- Check file is in correct folder: `assets/images/photos/`
- Check format is supported (JPG or PNG)
- Clear browser cache
- Reload page

**Photo looks distorted**?
- Image should be square (1:1 aspect ratio)
- For rectangular images, crop to square first
- Ensure high enough resolution (512×512 min)

**Photo loads slowly**?
- Reduce file size using compression
- Aim for < 250KB per image
- Use JPEG format (smaller than PNG usually)

### Storage Limits

Browser LocalStorage limits:
- Total game data: 5-50MB depending on browser
- Custom uploaded images: 1-2MB each (Base64 encoded)
- Recommendation: Keep preset photos under 500KB total

### CDN / Hosting

If hosting on slow connection:
- Compress images heavily
- Use optimized formats
- Consider WebP with fallback
- Enable GZIP compression on server

### Legal Notes

Ensure you have rights to use any images:
- Personal photos: always OK
- Stock photos: check license
- Creative Commons: require attribution
- Copyrighted images: get permission

---

## Future Asset Types

This structure is ready for:
- **Icons**: `assets/icons/`
- **Sounds**: `assets/sounds/`
- **Fonts**: `assets/fonts/`
- **Videos**: `assets/videos/`

Add as needed!

---

**Total Recommended Size**: < 2MB for optimal performance
