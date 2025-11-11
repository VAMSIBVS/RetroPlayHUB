# RetroPlay Hub 🎮

A modern web-based retro gaming platform that brings classic games to your browser. Built with React, Vite, and powered by RetroArch emulation cores.

## Features ✨

- **Multi-System Support**: Play games from various retro consoles (GBA, NES, SNES, N64, PlayStation, and more)
- **Modern UI**: Clean, responsive interface with Tailwind CSS
- **Game Library**: Organized game collection with thumbnails and metadata
- **Save States**: Save and load game progress
- **Gamepad Support**: Full controller support for authentic gaming experience
- **Profile System**: Track achievements, recent games, and favorites

## Live Demo 🌐

Check out the live RetroPlay Hub here: [RetroPlayHUB](https://retroplayhub.netlify.app/)

## Tech Stack 🛠️

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Emulation**: RetroArch WebAssembly cores
- **Build Tool**: Vite with HMR

## Installation 🚀

1. **Clone the repository**
   ```bash
   git clone https://github.com/DShivam9/RetroPlayHUB.git
   cd RetroPlayHUB
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add ROM files** (See ROM Setup section below)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## ROM Setup 📁

**Important**: ROM files are not included in this repository due to copyright restrictions and file size limitations.

### Adding Your Own ROMs

1. Create the ROM directory structure:
   ```
   public/roms/
   ```

2. Add your legally obtained ROM files to the appropriate folders:
   ```
   public/roms/
   ├── game1.gba
   ├── game2.nes
   ├── game3.snes
   └── ...
   ```

3. Add corresponding thumbnail images:
   ```
   public/thumbnails/
   ├── game1.jpg
   ├── game2.jpg
   └── ...
   ```

### Supported File Formats

- **Game Boy Advance**: .gba
- **Nintendo Entertainment System**: .nes
- **Super Nintendo**: .snes, .smc
- **Nintendo 64**: .n64, .z64
- **PlayStation**: .bin/.cue, .iso
- **Nintendo DS**: .nds
- **And many more!**

### Legal Notice ⚖️

- Only use ROM files that you legally own
- This project is for educational and preservation purposes
- Respect copyright laws in your jurisdiction

## Project Structure 📂

```
RetroPlayHUB/
├── public/
│   ├── data/           # Emulator cores and configurations
│   ├── roms/           # Game ROM files (not included)
│   └── thumbnails/     # Game thumbnail images
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── lib/            # Utility libraries
│   └── assets/         # Static assets
└── ...
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License 📄

This project is for educational purposes. Please respect all applicable laws and copyrights.

## Acknowledgments 🙏

- RetroArch team for the emulation cores
- React and Vite communities
- All contributors to open-source emulation
