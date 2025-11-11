import React, { useState } from 'react'
import GameCard from '../components/GameCard'
import { getAssetPath } from '../lib/utils'

// LibraryPage: filterable list of games by console.
export default function LibraryPage({ navigate, favorites, toggleFavorite, onPlayGame, defaultFilter = 'ALL' }) {
  const [selectedConsole, setSelectedConsole] = useState(defaultFilter)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  // Removed hoveredCard state as sparkle hover overlay was removed
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('title-asc')
  const consoles = defaultFilter === 'FAVORITES' ? ['FAVORITES'] : ['ALL', 'FAVORITES', 'GBA', 'NES', 'NDS', 'SegaCD']

  const allGames = [
    { id: 1, title: 'Pokemon FireRed', console: 'GBA', year: 2004, thumbnail: '🔥', thumbnailImage: getAssetPath('thumbnails/pokemon_firered.jpg'), romPath: getAssetPath('roms/pokemon_firered.gba') },
    { id: 3, title: 'Pokemon Ruby', console: 'GBA', year: 2002, thumbnail: '💎', thumbnailImage: getAssetPath('thumbnails/pokemon_ruby.jpg'), romPath: getAssetPath('roms/pokemon_ruby.gba') },
    { id: 4, title: 'Pokemon Sapphire', console: 'GBA', year: 2002, thumbnail: '💙', thumbnailImage: getAssetPath('thumbnails/pokemon_sapphire.jpg'), romPath: getAssetPath('roms/pokemon_sapphire.gba') },
    { id: 5, title: 'Pokemon Emerald', console: 'GBA', year: 2004, thumbnail: '💚', thumbnailImage: getAssetPath('thumbnails/pokemon_emerald.jpg'), romPath: getAssetPath('roms/pokemon_emerald.gba') },
    { id: 6, title: 'Mario Kart: Super Circuit', console: 'GBA', year: 2001, thumbnail: '🏎️', thumbnailImage: getAssetPath('thumbnails/mariokart_supercircuit.jpg'), romPath: getAssetPath('roms/mariokart_supercircuit.gba') },
    { id: 7, title: 'Pac-Man (Namco)', console: 'NES', year: 1984, thumbnail: '🟡', thumbnailImage: getAssetPath('thumbnails/pacman.jpeg'), romPath: getAssetPath('roms/pacman.nes') },
    { id: 8, title: 'Sonic 3D Blast', console: 'SegaCD', year: 1996, thumbnail: '🦔', thumbnailImage: getAssetPath('thumbnails/sonic3dblast.jpg'), romPath: getAssetPath('roms/sonic3dblast/Sonic 3D Blast (USA).cue') },
    { id: 9, title: 'Pokemon: Platinum Version', console: 'NDS', year: 2008, thumbnail: '💿', thumbnailImage: getAssetPath('thumbnails/pokemon_platinum.jpg'), romPath: getAssetPath('roms/pokemon_platinum.nds') }
  ]

  // Compose filters: console/favorites -> search -> sort
  let filtered = selectedConsole === 'FAVORITES'
    ? allGames.filter(g => favorites.includes(g.id))
    : selectedConsole === 'ALL'
      ? allGames
      : allGames.filter(g => g.console === selectedConsole)

  // Text search (title)
  if (query.trim()) {
    const q = query.trim().toLowerCase()
    filtered = filtered.filter(g => g.title.toLowerCase().includes(q))
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'title-asc':
        return a.title.localeCompare(b.title)
      case 'title-desc':
        return b.title.localeCompare(a.title)
      case 'year-desc':
        return (b.year ?? 0) - (a.year ?? 0)
      case 'year-asc':
        return (a.year ?? 0) - (b.year ?? 0)
      default:
        return 0
    }
  })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <div className="w-full bg-black" onMouseMove={handleMouseMove}>
      <div className="relative pt-20 pb-16 px-6">
        {/* Balanced background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-black"></div>
        <div className={`absolute inset-0 ${
          defaultFilter === 'FAVORITES'
            ? 'bg-gradient-to-br from-pink-900/8 via-transparent to-red-900/8'
            : 'bg-gradient-to-br from-cyan-900/15 via-transparent to-purple-900/15'
        }`}></div>
        
        {/* Minimal grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ 
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>

        {/* Spotlight effect */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: defaultFilter === 'FAVORITES'
              ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(244,114,182,0.06), transparent 40%)`
              : `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6,182,212,0.08), transparent 40%)`,
            opacity: mousePos.x ? 1 : 0
          }}
        ></div>

        {/* Floating hearts removed per user request */}

        {/* Hidden text revealed by spotlight with individual gradient masks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {(defaultFilter === 'FAVORITES' ? (
            // Favorites page - emoji themed
            [
              { text: '❤️', top: '15%', left: '8%', size: 'text-8xl', color: 'rgba(244,114,182,0.4)', glowColor: 'rgba(244,114,182,0.6)' },
              { text: '⭐', top: '28%', right: '10%', size: 'text-7xl', color: 'rgba(251,191,36,0.4)', glowColor: 'rgba(251,191,36,0.6)' },
              { text: '💖', top: '42%', left: '12%', size: 'text-7xl', color: 'rgba(236,72,153,0.4)', glowColor: 'rgba(236,72,153,0.6)' },
              { text: '✨', top: '35%', left: '50%', size: 'text-6xl', color: 'rgba(168,85,247,0.4)', glowColor: 'rgba(168,85,247,0.6)' },
              { text: '💎', top: '52%', right: '8%', size: 'text-7xl', color: 'rgba(6,182,212,0.4)', glowColor: 'rgba(6,182,212,0.6)' },
              { text: '🌟', top: '22%', left: '45%', size: 'text-6xl', color: 'rgba(251,146,60,0.4)', glowColor: 'rgba(251,146,60,0.6)' }
            ]
          ) : (
            // Library page - gaming themed words
            [
              { text: 'RETRO', top: '58%', right: '5%', size: 'text-8xl', color: 'rgba(6,182,212,0.4)', glowColor: 'rgba(6,182,212,0.7)' },
              { text: 'ARCADE', top: '18%', right: '8%', size: 'text-7xl', color: 'rgba(168,85,247,0.4)', glowColor: 'rgba(168,85,247,0.7)' },
              { text: 'PLAY', top: '32%', left: '12%', size: 'text-8xl', color: 'rgba(244,114,182,0.4)', glowColor: 'rgba(244,114,182,0.7)' },
              { text: 'GAMES', top: '42%', right: '10%', size: 'text-7xl', color: 'rgba(34,197,94,0.4)', glowColor: 'rgba(34,197,94,0.7)' },
              { text: 'PIXEL', top: '28%', left: '50%', size: 'text-6xl', color: 'rgba(251,191,36,0.4)', glowColor: 'rgba(251,191,36,0.7)' },
              { text: 'LEGENDS', top: '52%', left: '8%', size: 'text-7xl', color: 'rgba(239,68,68,0.4)', glowColor: 'rgba(239,68,68,0.7)' }
            ]
          )).map((item, idx) => {
            // Calculate distance from cursor to word center
            const rect = typeof window !== 'undefined' ? {
              left: item.left ? parseFloat(item.left) / 100 * window.innerWidth : window.innerWidth - (parseFloat(item.right) / 100 * window.innerWidth),
              top: parseFloat(item.top) / 100 * window.innerHeight
            } : { left: 0, top: 0 }
            
            const distance = mousePos.x 
              ? Math.sqrt(Math.pow(mousePos.x - rect.left, 2) + Math.pow(mousePos.y - rect.top, 2))
              : 1000
            
            const maxDistance = 300
            const opacity = Math.max(0, Math.min(1, 1 - (distance / maxDistance)))
            
            return (
              <div
                key={idx}
                className={`absolute ${item.size} font-press tracking-wider transition-opacity duration-300 ease-out`}
                style={{
                  top: item.top,
                  left: item.left,
                  right: item.right,
                  color: item.color,
                  opacity: opacity,
                  textShadow: opacity > 0 ? `0 0 ${30 + opacity * 30}px ${item.glowColor}, 0 0 ${60 + opacity * 40}px ${item.glowColor}` : 'none',
                  filter: `brightness(${1 + opacity * 0.5}) saturate(${1 + opacity * 0.5})`,
                }}
              >
                {item.text}
              </div>
            )
          })}
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Balanced header */}
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-press text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-4 tracking-tight" style={{
              filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.35))'
            }}>
              {defaultFilter === 'FAVORITES' ? (
                <span className="inline-flex items-center gap-3">
                  <span className="text-pink-400">❤️</span>
                  <span>YOUR FAVORITES</span>
                </span>
              ) : (
                'GAME LIBRARY'
              )}
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-500/60 to-transparent"></div>
              <p className="text-cyan-300/80 font-mono text-sm tracking-wide">
                {filtered.length} {filtered.length === 1 ? 'game' : 'games'} available
              </p>
            </div>
          </div>

          {/* Filters: console tabs + search + sort */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
            <div className="flex gap-3">
            {consoles.map((c) => (
              <button 
                key={c} 
                onClick={() => setSelectedConsole(c)} 
                className={`relative px-7 py-3 rounded-lg font-mono text-sm font-bold tracking-wide transition-all duration-300 ${
                  selectedConsole === c 
                    ? c === 'FAVORITES'
                      ? 'bg-gradient-to-br from-pink-600/30 to-red-600/30 text-pink-300 border-2 border-pink-500/50 shadow-lg shadow-pink-500/25'
                      : 'bg-gradient-to-br from-cyan-500/25 to-purple-500/25 text-cyan-200 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/25'
                    : c === 'FAVORITES'
                      ? 'bg-slate-800/50 text-pink-400/70 border-2 border-pink-500/25 hover:border-pink-500/50 hover:text-pink-300 hover:bg-pink-500/15'
                      : 'bg-slate-800/50 text-slate-400 border-2 border-slate-700/50 hover:border-cyan-500/40 hover:text-cyan-300 hover:bg-slate-800/70'
                }`}
              >
                <span className="relative z-10">
                  {c === 'FAVORITES' ? '❤️ FAVORITES' : c}
                </span>
                {selectedConsole === c && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                )}
              </button>
            ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search games..."
                  className="w-56 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono text-sm"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500/60 font-mono text-sm"
                aria-label="Sort games"
              >
                <option value="title-asc">Title A→Z</option>
                <option value="title-desc">Title Z→A</option>
                <option value="year-desc">Year New→Old</option>
                <option value="year-asc">Year Old→New</option>
              </select>
            </div>
          </div>

          {/* Game grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filtered.length > 0 ? (
              filtered.map((game, index) => (
                <div 
                  key={game.id}
                  className="transition-opacity duration-300 library-game-card-wrapper"
                  style={{
                    animationDelay: defaultFilter === 'FAVORITES' ? `${index * 0.1}s` : '0s'
                  }}
                >
                  <GameCard 
                    game={game} 
                    navigate={navigate} 
                    isFavorite={favorites.includes(game.id)} 
                    toggleFavorite={toggleFavorite} 
                    onPlay={onPlayGame}
                  />
                  {/* Removed sparkle overlay for cleaner hover experience in Favorites */}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-24 relative z-20">
                <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-pink-500/25 to-red-500/25 border-2 border-pink-500/50">
                  <span className="text-5xl">💔</span>
                </div>
                <h3 className="text-2xl font-press text-white mb-3 drop-shadow-lg">No Favorites Yet</h3>
                <p className="text-slate-300 font-mono text-sm max-w-md mx-auto leading-relaxed">
                  Start building your collection by clicking the ❤️ button on your favorite games
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
