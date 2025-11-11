import React, { useState, useRef, useEffect, useCallback } from 'react'
import SimpleGamePlayer from '../lib/simple-game-player'

// Game-specific details
const getGameDetails = (gameTitle) => {
  const details = {
    'Pokemon FireRed': {
      description: 'Return to the Kanto region where your Pokémon journey began! As a young trainer from Pallet Town, choose between Bulbasaur, Charmander, or Squirtle and embark on an epic adventure. Battle the nefarious Team Rocket, collect eight Gym Badges, and challenge the Elite Four. This enhanced remake features updated graphics, new areas like the Sevii Islands, and compatibility with Ruby and Sapphire for trading.',
      region: 'Kanto Region',
      genre: 'RPG / Adventure',
      developer: 'Game Freak',
      publisher: 'Nintendo / The Pokémon Company'
    },
    'Pokemon Ruby': {
      description: 'Explore the tropical Hoenn region in this groundbreaking adventure! As a new trainer, you\'ll face off against the dangerous Team Magma, who seek to expand the landmass by awakening the legendary Groudon. Discover over 135 new Pokémon species, participate in thrilling Pokémon Contests, build your Secret Base, and master the new Double Battle system. The journey to become Hoenn Champion begins here!',
      region: 'Hoenn Region',
      genre: 'RPG / Adventure',
      developer: 'Game Freak',
      publisher: 'Nintendo / The Pokémon Company'
    },
    'Pokemon Sapphire': {
      description: 'Dive into the oceanic adventure of the Hoenn region! Counter the sinister plans of Team Aqua as they attempt to expand the seas by awakening the legendary Kyogre. Experience a unique story parallel to Ruby, discover exclusive Pokémon, and explore underwater routes with Dive. Build Secret Bases, compete in Contests, and challenge powerful Gym Leaders on your quest to become the Champion of Hoenn!',
      region: 'Hoenn Region',
      genre: 'RPG / Adventure',
      developer: 'Game Freak',
      publisher: 'Nintendo / The Pokémon Company'
    },
    'Pokemon Emerald': {
      description: 'The definitive Hoenn experience! Face both Team Magma and Team Aqua as they awaken the legendary Groudon and Kyogre, threatening to tear the region apart. Only with the help of Rayquaza can balance be restored. This enhanced version features the Battle Frontier with seven unique challenge facilities, animated Pokémon sprites, expanded post-game content, and the ability to catch both legendary mascots. The ultimate Hoenn adventure awaits!',
      region: 'Hoenn Region',
      genre: 'RPG / Adventure',
      developer: 'Game Freak',
      publisher: 'Nintendo / The Pokémon Company'
    },
    'Mario Kart: Super Circuit': {
      description: 'Experience high-speed kart racing action on the Game Boy Advance! Race as Mario, Luigi, Princess Peach, and other beloved Nintendo characters across 40 exciting tracks - 20 brand new circuits plus all 20 classic tracks from Super Mario Kart. Master power-sliding techniques, collect coins to boost your speed, and unleash devastating items like shells, bananas, and lightning bolts. Compete in Grand Prix cups, beat Time Trial records, and challenge friends via link cable in this portable racing masterpiece!',
      region: 'Mushroom Kingdom',
      genre: 'Racing / Arcade',
      developer: 'Intelligent Systems',
      publisher: 'Nintendo'
    },
    'Pac-Man (Namco)': {
      description: 'Navigate the iconic yellow hero through maze-like stages, gobbling pellets while avoiding the relentless ghosts Blinky, Pinky, Inky, and Clyde. Snag Power Pellets to turn the tables and chomp the ghosts for big points, grab bonus fruits, and clear each board as the pace ramps up. A timeless arcade classic that defined an era.',
      region: 'Arcade Maze',
      genre: 'Maze / Arcade',
      developer: 'Namco',
      publisher: 'Namco'
    },
    'Sonic 3D Blast': {
      description: 'Experience Sonic in a whole new dimension! Guide the blue blur through isometric 3D environments as you rescue Flickies from Dr. Robotnik\'s clutches. Collect Chaos Emeralds, battle robotic enemies, and explore vibrant zones filled with secrets. This unique perspective on the Sonic franchise combines classic speed with puzzle-solving elements for an unforgettable adventure on the Sega CD.',
      region: 'Green Grove Zone',
      genre: 'Platformer / Action',
      developer: 'Traveller\'s Tales',
      publisher: 'Sega'
    },
    'Pokemon: Platinum Version': {
      description: 'Return to the Sinnoh region in this enhanced third version! Confront Team Galactic\'s plot to control the Legendary Pokémon Dialga and Palkia while the mysterious Distortion World emerges, ruled by Giratina. Expanded Pokédex, new story elements, refined Battle Frontier-style challenges, and improved regional encounters make this the definitive Sinnoh adventure.',
      region: 'Sinnoh Region',
      genre: 'RPG / Adventure',
      developer: 'Game Freak',
      publisher: 'Nintendo / The Pokémon Company'
    }
  }
  
  return details[gameTitle] || {
    description: 'Experience a classic gaming adventure in your browser. Challenge yourself with this retro masterpiece!',
    region: 'Unknown Region',
    genre: 'Classic Game',
    developer: 'Unknown',
    publisher: 'Unknown'
  }
}

export default function PlayerPage({ navigate, game }) {
  const currentGame = game || { title: 'SELECT A GAME', console: 'N/A', year: '----', id: 0, romPath: null }
  const gameDetails = getGameDetails(currentGame.title)
  
  console.log('PlayerPage loaded with game:', currentGame)
  console.log('Has romPath?', currentGame.romPath)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [playtime, setPlaytime] = useState(0)
  const [romData, setRomData] = useState(null)
  const canvasRef = useRef(null)
  const intervalRef = useRef(null)
  const emulatorRef = useRef(null)

  // Memoized loader must be declared BEFORE effects that reference it
  const loadROM = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setRomData(null)
      
      console.log('Starting ROM load for:', currentGame.title)
      console.log('ROM path:', currentGame.romPath)
      
      const response = await fetch(currentGame.romPath)
      if (!response.ok) throw new Error('ROM file not found')
      const data = await response.arrayBuffer()
      console.log('ROM loaded:', currentGame.title, data.byteLength, 'bytes')
      
      setRomData(data)
      setLoading(false)
    } catch (err) {
      console.error('ROM loading error:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [currentGame.romPath, currentGame.title])

  useEffect(() => {
    // Clean up previous emulator instance first
    if (emulatorRef.current) {
      console.log('Destroying previous emulator instance')
      emulatorRef.current.destroy()
      emulatorRef.current = null
      setRomData(null)
    }
    
    if (currentGame.romPath) {
      loadROM()
      startTimer()
    } else {
      setLoading(false)
    }
    
    // Cleanup when component unmounts or game changes
    return () => {
      console.log('PlayerPage cleanup - stopping emulator')
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (emulatorRef.current) {
        emulatorRef.current.destroy()
        emulatorRef.current = null
      }
      // Clear the game container
      const gameDiv = document.getElementById('game')
      if (gameDiv) {
        gameDiv.remove()
      }
    }
  }, [currentGame.romPath, loadROM])

  // Initialize emulator after canvas is rendered
  useEffect(() => {
    if (romData && canvasRef.current && !emulatorRef.current) {
      console.log('Canvas available, initializing emulator...')
      try {
        // Determine system type from currentGame.console
  let system = 'gba';
  if (currentGame.console === 'NES') system = 'nes';
  if (currentGame.console === 'SegaCD') system = 'segaCD';
  if (currentGame.console === 'NDS') system = 'nds'; // Placeholder mapping for Nintendo DS
        emulatorRef.current = new SimpleGamePlayer(canvasRef.current, system);
        emulatorRef.current.loadROM(romData);
        emulatorRef.current.start();
        console.log('Emulator started successfully!');
      } catch (err) {
        console.error('Emulator initialization error:', err);
        setError('Failed to start emulator');
      }
    }
  }, [romData, currentGame.console])

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setPlaytime(t => t + 1), 1000)
  }

  const formatTime = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  
  return (
    <div className="w-full min-h-screen bg-black overflow-hidden">
      <div className="relative py-16 px-6">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/15 via-transparent to-purple-900/15"></div>
        
        {/* Animated Rayquaza */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="rayquaza-float">
            <div className="text-8xl opacity-20 hover:opacity-30 transition-opacity duration-500" 
                 style={{ 
                   filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))',
                   transform: 'rotate(-15deg)'
                 }}>
              🐉
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <button onClick={() => navigate('library')} className="mb-6 text-cyan-300 hover:text-cyan-100 font-mono text-sm transition-colors drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">← BACK TO LIBRARY</button>

          <h2 className="text-4xl font-press text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-8 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">{currentGame.title.toUpperCase()}</h2>

          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-neon.cyan/20 to-neon.purple/20 blur-2xl rounded-lg" />
            <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-lg p-6 border-4 border-cyan-500/30 shadow-crt-glow">
              <div className="absolute inset-0 bg-gradient-to-b from-neon.cyan/8 to-neon.purple/8 rounded pointer-events-none" />

              {error ? (
                <div className="w-full aspect-video bg-slate-900 rounded crt-scanlines flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">⚠️</div>
                    <p className="text-red-400 font-mono text-sm mb-2">Error Loading Game</p>
                    <p className="text-gray-400 font-mono text-xs">{error}</p>
                  </div>
                </div>
              ) : loading ? (
                <div className="w-full aspect-video bg-slate-900 rounded crt-scanlines flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">{currentGame.thumbnail || '🎮'}</div>
                    <div className="flex gap-4 justify-center mb-4">
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                    </div>
                    <p className="text-neon.cyan font-mono text-sm">Loading {currentGame.title}...</p>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video bg-slate-900 rounded overflow-hidden">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-full rounded"
                    style={{ 
                      imageRendering: 'pixelated',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </div>
              )}

              <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(6,182,212,0.02) 3px, rgba(6,182,212,0.02) 6px)' }} />
            </div>
          </div>

          {/* Game Details Section */}
          <div className="mt-8 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/20">
            <h3 className="text-2xl font-press text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-4">ABOUT THIS GAME</h3>
            
            <div className="space-y-4 text-gray-300 font-mono text-sm leading-relaxed">
              <p className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold min-w-[120px]">Title:</span>
                <span className="text-white">{currentGame.title}</span>
              </p>
              
              <p className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold min-w-[120px]">Platform:</span>
                <span className="text-white">Game Boy Advance ({currentGame.console})</span>
              </p>
              
              <p className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold min-w-[120px]">Release:</span>
                <span className="text-white">{currentGame.year}</span>
              </p>
              
              <p className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold min-w-[120px]">Region:</span>
                <span className="text-white">{gameDetails.region}</span>
              </p>
              
              <p className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold min-w-[120px]">Genre:</span>
                <span className="text-white">{gameDetails.genre}</span>
              </p>
              
              <p className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold min-w-[120px]">Developer:</span>
                <span className="text-white">{gameDetails.developer}</span>
              </p>
              
              <p className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold min-w-[120px]">Publisher:</span>
                <span className="text-white">{gameDetails.publisher}</span>
              </p>
              
              <div className="mt-6 pt-6 border-t border-cyan-500/20">
                <p className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold min-w-[120px]">Story:</span>
                  <span className="text-gray-300 leading-relaxed">
                    {gameDetails.description}
                  </span>
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-cyan-500/20">
                <p className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold min-w-[120px]">Controls:</span>
                  <span className="text-gray-300">
                    <span className="block mb-3 text-cyan-300 font-semibold">Keyboard:</span>
                    <span className="block mb-1 ml-4">• Arrow Keys → D-Pad (Movement)</span>
                    <span className="block mb-1 ml-4">• X → A Button (Confirm/Interact)</span>
                    <span className="block mb-1 ml-4">• Z → B Button (Cancel/Run)</span>
                    <span className="block mb-1 ml-4">• A → L Shoulder</span>
                    <span className="block mb-1 ml-4">• S → R Shoulder</span>
                    <span className="block mb-1 ml-4">• Enter → Start (Menu)</span>
                    <span className="block mb-3 ml-4">• Shift → Select</span>
                    
                    <span className="block mb-3 mt-4 text-purple-300 font-semibold">Emulator Controls:</span>
                    <span className="block mb-1 ml-4">• Click the emulator menu for Save/Load states</span>
                    <span className="block mb-1 ml-4">• Use emulator's fullscreen button for better experience</span>
                    <span className="block mb-1 ml-4">• Access settings for video/audio adjustments</span>
                    <span className="block ml-4">• On-screen controls available on mobile devices</span>
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Animated Stats Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Console Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-shimmer"></div>
                </div>
                
                {/* Scanline effect */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,1) 2px, rgba(6,182,212,1) 4px)' }}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-400/30 flex items-center justify-center text-2xl">
                      🎮
                    </div>
                    <div>
                      <div className="text-cyan-400 font-mono text-xs tracking-wider uppercase mb-1">Platform</div>
                      <div className="text-white font-press text-xl">{currentGame.console}</div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs font-mono">{currentGame.console === 'GBA' ? 'Game Boy Advance' : currentGame.console === 'NES' ? 'Nintendo Entertainment System' : currentGame.console === 'Genesis' ? 'Sega Genesis / Mega Drive' : currentGame.console === 'SegaCD' ? 'Sega CD / Mega CD' : currentGame.console}</div>
                </div>
              </div>
            </div>
            
            {/* Playtime Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer"></div>
                </div>
                
                {/* Scanline effect */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(168,85,247,1) 2px, rgba(168,85,247,1) 4px)' }}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-400/30 flex items-center justify-center text-2xl">
                      ⏱️
                    </div>
                    <div>
                      <div className="text-purple-400 font-mono text-xs tracking-wider uppercase mb-1">Session Time</div>
                      <div className="text-white font-press text-xl">{formatTime(playtime)}</div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs font-mono">Current play session</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
