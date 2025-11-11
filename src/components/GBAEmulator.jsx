import { useEffect, useRef, useState } from 'react'

export default function GBAEmulator({ romPath, onError, onLoad }) {
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Prevent arrow key scrolling when emulator is active
    const handleKeyDown = (event) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    if (!romPath || !canvasRef.current) return

    let mounted = true

    const initEmulator = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch the ROM file
        const response = await fetch(romPath)
        if (!response.ok) {
          throw new Error(`ROM file not found: ${romPath}`)
        }

  await response.arrayBuffer()

        // Initialize the emulator with iodine-gba
        // Note: This is a simplified implementation
        // Full implementation would require proper iodine-gba setup
        
        if (mounted) {
          setLoading(false)
          onLoad?.()
        }

      } catch (err) {
        console.error('Emulator error:', err)
        if (mounted) {
          setError(err.message)
          setLoading(false)
          onError?.(err)
        }
      }
    }

    initEmulator()

    return () => {
      mounted = false
      window.removeEventListener("keydown", handleKeyDown);
      // Cleanup emulator if needed
    }
  }, [romPath, onError, onLoad])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded">
        <div className="text-center p-8">
          <p className="text-red-400 font-mono text-sm mb-2">⚠️ Error Loading Game</p>
          <p className="text-gray-500 font-mono text-xs">{error}</p>
          <p className="text-gray-600 font-mono text-xs mt-4">
            Please place ROM files in: public/roms/
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded">
        <div className="text-center">
          <div className="loading-ring mb-4">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <p className="text-neon.cyan font-mono text-sm">Loading Game...</p>
          <p className="text-gray-500 font-mono text-xs mt-2">{romPath}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative bg-slate-900 rounded">
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
