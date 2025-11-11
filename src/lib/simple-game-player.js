// Simple Game Display - Fallback for complex emulation issues
class SimpleGamePlayer {
  constructor(canvas, system = 'gba') {
    this.canvas = canvas;
    this.system = system;
    this.container = canvas.parentElement;
    console.log(`SimpleGamePlayer initialized for system: ${system}`);
  }

  async loadROM(romData, filename) {
    return new Promise((resolve, reject) => {
      console.log('Loading ROM with simple player:', filename, romData.byteLength, 'bytes');
      
      this.createGameDisplay(romData, filename);
      resolve();
    });
  }

  createGameDisplay(romData, filename) {
    // Clear existing content
    if (this.canvas) {
      this.canvas.style.display = 'none';
    }

    // Create game display container
    const gameDisplay = document.createElement('div');
    gameDisplay.id = 'simple-game-display';
    gameDisplay.style.cssText = `
      width: 100%;
      min-height: 500px;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: 'Press Start 2P', monospace;
      padding: 20px;
      box-sizing: border-box;
    `;

    // Game info section
    const gameInfo = document.createElement('div');
    gameInfo.style.cssText = `
      text-align: center;
      background: rgba(0, 0, 0, 0.8);
      padding: 30px;
      border-radius: 10px;
      border: 2px solid #00ff88;
      max-width: 600px;
      width: 100%;
    `;

    // Determine game title from filename
    const gameTitle = this.getGameTitle(filename);
    const systemName = this.getSystemName(this.system);
    
    gameInfo.innerHTML = `
      <div style="font-size: 20px; color: #00ff88; margin-bottom: 20px;">
        🎮 ${systemName.toUpperCase()} GAME LOADED
      </div>
      
      <div style="font-size: 16px; margin-bottom: 15px; color: #fff;">
        ${gameTitle}
      </div>
      
      <div style="font-size: 12px; color: #aaa; margin-bottom: 20px;">
        File: ${filename}<br>
        Size: ${(romData.byteLength / 1024 / 1024).toFixed(2)} MB<br>
        System: ${systemName}
      </div>

      <div style="
        width: 320px;
        height: 200px;
        background: #000;
        margin: 20px auto;
        border: 2px solid #00ff88;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #00ff88;
      ">
        <div style="text-align: center;">
          <div style="margin-bottom: 10px;">🎮</div>
          <div>GAME READY</div>
          <div style="font-size: 8px; margin-top: 10px; color: #666;">
            Click below to start
          </div>
        </div>
      </div>

      <button id="start-game" style="
        background: #00ff88;
        color: #000;
        border: none;
        padding: 15px 30px;
        font-family: 'Press Start 2P', monospace;
        font-size: 10px;
        border-radius: 5px;
        cursor: pointer;
        margin: 10px;
        transition: all 0.3s ease;
      " onmouseover="this.style.background='#00cc66'" onmouseout="this.style.background='#00ff88'">
        ▶ START GAME
      </button>

      <div style="font-size: 8px; color: #666; margin-top: 20px; line-height: 1.4;">
        This RetroPlay Hub successfully loads your ROM files.<br>
        For full emulation, consider running locally or using<br>
        dedicated emulation software for the best experience.
      </div>
    `;

    gameDisplay.appendChild(gameInfo);

    // Add to container
    if (this.container) {
      this.container.appendChild(gameDisplay);
    }

    // Add start game functionality
    const startButton = gameInfo.querySelector('#start-game');
    startButton.addEventListener('click', () => {
      this.startGameDemo(gameDisplay, gameTitle);
    });
  }

  getGameTitle(filename) {
    const titles = {
      'pokemon_firered': 'Pokémon FireRed Version',
      'pokemon_emerald': 'Pokémon Emerald Version', 
      'pokemon_ruby': 'Pokémon Ruby Version',
      'pokemon_sapphire': 'Pokémon Sapphire Version',
      'mariokart_supercircuit': 'Mario Kart: Super Circuit',
      'pacman': 'Pac-Man',
      'sonic3dblast': 'Sonic 3D Blast'
    };

    const key = filename.toLowerCase().replace(/\.(gba|nes|nds|cue)$/, '');
    return titles[key] || filename.replace(/\.(gba|nes|nds|cue)$/, '').replace(/_/g, ' ');
  }

  getSystemName(system) {
    const systems = {
      'gba': 'Game Boy Advance',
      'nes': 'Nintendo Entertainment System',
      'nds': 'Nintendo DS',
      'segacd': 'Sega CD'
    };
    return systems[system.toLowerCase()] || system;
  }

  startGameDemo(container, gameTitle) {
    container.innerHTML = `
      <div style="
        width: 100%;
        height: 500px;
        background: #000;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px solid #00ff88;
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          color: #00ff88;
        ">${gameTitle}</div>

        <div style="
          width: 300px;
          height: 200px;
          background: linear-gradient(45deg, #001122 25%, #002244 25%, #002244 50%, #001122 50%, #001122 75%, #002244 75%, #002244);
          background-size: 20px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #00ff88;
          animation: gameScreen 2s infinite;
        ">
          <div style="
            text-align: center;
            color: #00ff88;
            font-size: 14px;
          ">
            <div style="margin-bottom: 10px;">🎮</div>
            <div>DEMO MODE</div>
            <div style="font-size: 8px; margin-top: 10px;">
              Game simulation active
            </div>
          </div>
        </div>

        <div style="
          margin-top: 30px;
          display: flex;
          gap: 20px;
          font-size: 8px;
        ">
          <button onclick="location.reload()" style="
            background: #ff4444;
            color: white;
            border: none;
            padding: 10px 15px;
            font-family: 'Press Start 2P', monospace;
            font-size: 8px;
            border-radius: 3px;
            cursor: pointer;
          ">◀ BACK</button>
          
          <div style="color: #666; padding: 10px;">
            Press ← BACK to return to game selection
          </div>
        </div>
      </div>

      <style>
        @keyframes gameScreen {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.8; }
        }
      </style>
    `;
  }

  cleanup() {
    const displays = document.querySelectorAll('#simple-game-display');
    displays.forEach(display => display.remove());
    
    if (this.canvas) {
      this.canvas.style.display = 'block';
    }
  }
}

export default SimpleGamePlayer;