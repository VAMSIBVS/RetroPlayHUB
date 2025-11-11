# ROM Setup Guide

This guide explains how to add ROM files to your RetroPlay Hub installation.

## Quick Setup

1. **Create the ROM directory**:
   ```
   public/roms/
   ```

2. **Add your ROM files** to the directory
3. **Add thumbnail images** to `public/thumbnails/`
4. **Restart the development server**

## Detailed Instructions

### Step 1: Prepare Your ROM Files

Make sure you have legally obtained ROM files for games you own. Common file extensions:

- **Game Boy Advance**: `.gba`
- **Nintendo (NES)**: `.nes`
- **Super Nintendo (SNES)**: `.snes`, `.smc`
- **Nintendo 64**: `.n64`, `.z64`
- **PlayStation**: `.bin/.cue`, `.iso`
- **Nintendo DS**: `.nds`
- **Sega Genesis**: `.md`, `.gen`

### Step 2: File Organization

Organize your files like this:

```
public/
├── roms/
│   ├── pokemon_emerald.gba
│   ├── super_mario_world.snes
│   ├── pacman.nes
│   └── mariokart64.z64
├── thumbnails/
│   ├── pokemon_emerald.jpg
│   ├── super_mario_world.jpg
│   ├── pacman.jpg
│   └── mariokart64.jpg
```

### Step 3: Thumbnail Images

For the best experience, add thumbnail images:

- **Format**: JPG or PNG
- **Size**: 300x400 pixels (recommended)
- **Naming**: Match the ROM filename (without extension)

Example:
- ROM: `pokemon_emerald.gba`
- Thumbnail: `pokemon_emerald.jpg`

### Step 4: Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Library page
3. Your games should appear with thumbnails

## Troubleshooting

### Game doesn't appear in library
- Check file extension is supported
- Ensure ROM file is in `public/roms/`
- Verify file isn't corrupted

### No thumbnail showing
- Check thumbnail file exists in `public/thumbnails/`
- Verify filename matches ROM name
- Ensure image format is JPG/PNG

### Game won't load
- Verify ROM file is valid
- Check browser console for errors
- Try a different ROM file

## Legal Reminder

⚖️ **Important**: Only use ROM files for games you legally own. This project is for educational and game preservation purposes.

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify file paths and naming
3. Ensure ROM files are valid
4. Create an issue on GitHub if problems persist