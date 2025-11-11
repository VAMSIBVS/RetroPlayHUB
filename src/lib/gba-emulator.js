// Import the utility function
import { getAssetPath } from './utils';

// GBA Emulator using EmulatorJS (local)
class GBAEmulator {
  constructor(canvas, system = 'gba') {
    this.canvas = canvas;
    this.system = system;
    this.container = canvas.parentElement;
    this.emulatorDiv = null;
    this.emulatorInstance = null;
    console.log(`GBAEmulator initialized for system: ${system}`);
  }

  // Ensure EmulatorJS assets (CSS + JS) are loaded exactly once
  async ensureAssets() {
    if (typeof window.EmulatorJS !== 'undefined') return true;
    if (window.__emulatorjsLoading) {
      // Another instance is loading; wait for it
      await window.__emulatorjsLoading;
      return typeof window.EmulatorJS !== 'undefined';
    }

    window.__emulatorjsLoading = new Promise((resolve, reject) => {
      try {
        const head = document.head;

        // Load CSS if not present
        if (!document.querySelector('link[data-emulatorjs]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = getAssetPath('data/emulator.min.css');
          cssLink.setAttribute('data-emulatorjs', '');
          console.log('Loading EmulatorJS CSS from:', cssLink.href);
          head.appendChild(cssLink);
        }

        // Inject script
        const script = document.createElement('script');
        script.src = getAssetPath('data/emulator.min.js');
        console.log('Loading EmulatorJS script from:', script.src);
        script.async = true;
        script.setAttribute('data-emulatorjs', '');
        script.onload = () => {
          console.log('EmulatorJS script loaded');
          resolve(true);
        };
        script.onerror = (e) => {
          console.error('Failed to load EmulatorJS', e);
          reject(new Error('EmulatorJS load failed'));
        };
        head.appendChild(script);
      } catch (err) {
        reject(err);
      }
    });

    try {
      await window.__emulatorjsLoading;
      return typeof window.EmulatorJS !== 'undefined';
    } catch {
      return false;
    } finally {
      // Allow future retries if failed
      if (typeof window.EmulatorJS === 'undefined') {
        window.__emulatorjsLoading = null;
      }
    }
  }

  async loadROM(arrayBuffer) {
    console.log('ROM received:', arrayBuffer.byteLength, 'bytes');

    const assetsReady = await this.ensureAssets();
    if (!assetsReady) {
      console.error('EmulatorJS assets not available after load attempt');
      return false;
    }

    try {
      // Hide canvas – EmulatorJS manages its own DOM
      this.canvas.style.display = 'none';

      // Create emulator container
      this.emulatorDiv = document.createElement('div');
      this.emulatorDiv.id = 'game';
      this.emulatorDiv.style.width = '100%';
      this.emulatorDiv.style.height = '100%';
      this.container.appendChild(this.emulatorDiv);

      // Convert ArrayBuffer to Blob URL
      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
      const blobUrl = URL.createObjectURL(blob);

      const dataPath = getAssetPath('data/');
      console.log('Instantiating EmulatorJS with dataPath:', dataPath);
      this.emulatorInstance = new window.EmulatorJS('#game', {
        system: this.system,
        gameName: `${this.system.toUpperCase()} Game`,
        gameUrl: blobUrl,
        dataPath: dataPath,
        biosUrl: '',
        startOnLoad: true,
        color: '#06b6d4'
      });

      console.log('EmulatorJS instance created');
      return true;
    } catch (error) {
      console.error('EmulatorJS initialization error:', error);
      return false;
    }
  }
  
  start() {
    console.log('Emulator start');
  }
  
  pause() {
    console.log('Pausing emulator')
    if (this.emulatorInstance) {
      try {
        if (this.emulatorInstance.pause) {
          this.emulatorInstance.pause()
        }
        // Try alternative pause methods
        if (this.emulatorInstance.pauseGame) {
          this.emulatorInstance.pauseGame()
        }
      } catch (error) {
        console.error('Error pausing:', error)
      }
    }
  }
  
  reset() {
    if (this.emulatorInstance && this.emulatorInstance.reset) {
      this.emulatorInstance.reset()
    }
  }
  
  destroy() {
    console.log('Destroying emulator instance')
    
    // Stop the emulator completely
    if (this.emulatorInstance) {
      try {
        // Try all possible stop methods
        if (this.emulatorInstance.stop) this.emulatorInstance.stop()
        if (this.emulatorInstance.pause) this.emulatorInstance.pause()
        if (this.emulatorInstance.destroy) this.emulatorInstance.destroy()
        if (this.emulatorInstance.exit) this.emulatorInstance.exit()
      } catch (error) {
        console.error('Error stopping emulator:', error)
      }
      this.emulatorInstance = null
    }
    
    // Remove the emulator div completely
    if (this.emulatorDiv) {
      // Remove all child elements first
      while (this.emulatorDiv.firstChild) {
        this.emulatorDiv.removeChild(this.emulatorDiv.firstChild)
      }
      this.emulatorDiv.remove()
      this.emulatorDiv = null
    }
    
    // Also check for any #game divs and remove them
    const gameDivs = document.querySelectorAll('#game')
    gameDivs.forEach(div => div.remove())
    
    // Show canvas again
    if (this.canvas) {
      this.canvas.style.display = 'block'
    }
    
    console.log('Emulator destroyed completely')
  }
}

export default GBAEmulator;
