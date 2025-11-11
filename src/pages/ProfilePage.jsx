import React, { useState, useEffect } from 'react'
import GameCard from '../components/GameCard'
import StatCard from '../components/StatCard'
import QuickActions from '../components/QuickActions'
import RecentGames from '../components/RecentGames'
import { getAssetPath } from '../lib/utils'
import FavoritesShowcase from '../components/FavoritesShowcase'
import ProfileSettings from '../components/ProfileSettings'
import ProfileCustomization from '../components/ProfileCustomization'
import { User } from 'lucide-react'

// ProfilePage: immersive profile with themed sections and useful actions
export default function ProfilePage({ navigate, favorites, onPlayGame, lastPlayed }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [profileBio, setProfileBio] = useState('Retro gaming enthusiast • Browser-based emulation')

  useEffect(() => {
    // Load saved profile photo and bio
    const savedPhoto = localStorage.getItem('profilePhoto')
    const savedBio = localStorage.getItem('profileBio')
    if (savedPhoto) {
      setProfilePhoto(savedPhoto)
    }
    if (savedBio) {
      setProfileBio(savedBio)
    }
  }, [])

  const handlePhotoChange = (photoUrl) => {
    setProfilePhoto(photoUrl)
  }

  const handleProfileChange = (data) => {
    if (data.bio) {
      setProfileBio(data.bio)
    }
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }
  // Lightweight catalog to resolve favorite IDs to game objects
  const catalog = [
    { id: 1, title: 'Pokemon FireRed', console: 'GBA', year: 2004, thumbnail: '🔥', romPath: getAssetPath('roms/pokemon_firered.gba') },
    { id: 3, title: 'Pokemon Ruby', console: 'GBA', year: 2002, thumbnail: '💎', romPath: getAssetPath('roms/pokemon_ruby.gba') },
    { id: 4, title: 'Pokemon Sapphire', console: 'GBA', year: 2002, thumbnail: '💙', romPath: getAssetPath('roms/pokemon_sapphire.gba') },
    { id: 5, title: 'Pokemon Emerald', console: 'GBA', year: 2004, thumbnail: '💚', romPath: getAssetPath('roms/pokemon_emerald.gba') }
  ]

  // Compute sessions from play history
  let sessions = 0
  let playHistory = []
  try {
    const raw = localStorage.getItem('playHistory')
    playHistory = raw ? JSON.parse(raw) : []
    sessions = playHistory.length
  } catch (err) {
    console.error('Failed to load play history:', err)
  }

  return (
    <div className="w-full min-h-screen bg-black overflow-hidden" onMouseMove={handleMouseMove}>
      <div className="relative py-16 px-6">
        {/* Animated wave gradients */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20 animate-gradient-shift"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-pink-900/10 via-transparent to-blue-900/10 animate-gradient-shift-reverse"></div>
        </div>

        {/* Animated grid that follows mouse with stronger effect */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{ 
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.6) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            backgroundPosition: `${mousePos.x * 0.03}px ${mousePos.y * 0.03}px`
          }}
        ></div>

        {/* Radial gradient pulses */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        {/* Enhanced mouse spotlight with color */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-200"
          style={{
            background: `
              radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6,182,212,0.15), transparent 30%),
              radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168,85,247,0.1), transparent 40%)
            `,
            opacity: mousePos.x ? 1 : 0
          }}
        ></div>

        {/* Scanning line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-scan"></div>
        </div>

        {/* Falling emoji particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${5 + i * 6.5}%`,
                top: '-10%',
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${8 + (i % 3) * 2}s`,
                opacity: 0.12,
                fontSize: `${20 + (i % 4) * 8}px`
              }}
            >
              {['🎮', '⭐', '💎', '🔥', '👾', '🕹️'][i % 6]}
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header / Avatar */}
          <div className="relative overflow-hidden rounded-xl p-6 md:p-8 mb-8 profile-header-card">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 blur-xl animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/20 rounded-xl"></div>
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Animated Profile Photo with Upload on Hover */}
              <div className="relative group cursor-pointer">
                {/* Spinning gradient border */}
                <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-75 group-hover:opacity-100 animate-spin-slow"></div>
                
                {/* Particle orbit effect */}
                <div className="absolute -inset-4">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-orbit"
                      style={{
                        top: '50%',
                        left: '50%',
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: '4s'
                      }}
                    ></div>
                  ))}
                </div>

                {/* Pulsing glow rings */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur-lg animate-pulse opacity-50"></div>
                
                {/* Photo container */}
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-cyan-500/30 shadow-2xl shadow-cyan-500/50 group-hover:ring-cyan-400/50 transition-all duration-300 group-hover:scale-105">
                  {profilePhoto ? (
                    <img 
                      src={profilePhoto} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                      <User className="w-12 h-12 md:w-14 md:h-14 text-white" />
                    </div>
                  )}
                  
                  {/* Scanline effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-scan-fast pointer-events-none"></div>
                  
                  {/* Upload button overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ProfileCustomization onPhotoChange={handlePhotoChange} />
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <ProfileSettings onProfileChange={handleProfileChange} />
                <p className="text-gray-400 font-mono text-sm mt-2">{profileBio}</p>
              </div>
            </div>
          </div>

          {/* Stats + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:col-span-2 stats-cards-wrapper">
              <StatCard label="Favorites" value={favorites.length} accent="cyan" />
              <StatCard label="Platforms" value={1} hint="GBA for now" accent="purple" />
              <StatCard label="Sessions" value={sessions} accent="amber" />
            </div>
            <QuickActions navigate={navigate} lastPlayed={lastPlayed} onPlayGame={onPlayGame} />
          </div>

          {/* Continue Playing */}
          <div className="mb-10 group">
            <h3 className="text-xl font-press text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-4 group-hover:scale-105 transition-transform duration-300 inline-block">CONTINUE PLAYING</h3>
            {lastPlayed ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GameCard game={lastPlayed} navigate={navigate} isFavorite={favorites.includes(lastPlayed.id)} toggleFavorite={() => {}} onPlay={onPlayGame} />
              </div>
            ) : (
              <div className="relative group/empty">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-lg blur group-hover/empty:blur-md transition-all"></div>
                <div className="relative text-gray-400 font-mono text-sm p-6 border border-cyan-500/10 rounded-lg group-hover/empty:border-cyan-500/20 transition-all">
                  No recent session. Start a game from the Library.
                </div>
              </div>
            )}
          </div>

          {/* Recent & Favorites */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentGames playHistory={playHistory} allGames={catalog} onPlayGame={onPlayGame} />
            <FavoritesShowcase favorites={favorites} allGames={catalog} onPlayGame={onPlayGame} />
          </div>
        </div>
      </div>
    </div>
  )
}
