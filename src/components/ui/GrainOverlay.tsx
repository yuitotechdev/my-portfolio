'use client'

export function GrainOverlay() {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.65" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
      <style jsx>{`
        div {
          animation: noise 0.2s infinite;
        }
        @keyframes noise {
          0% { transform: translate(0,0) }
          10% { transform: translate(-5px,-5px) }
          20% { transform: translate(-10px,5px) }
          30% { transform: translate(5px,-10px) }
          40% { transform: translate(-5px,15px) }
          50% { transform: translate(-10px,5px) }
          60% { transform: translate(15px,0) }
          70% { transform: translate(0,10px) }
          80% { transform: translate(-15px,0) }
          90% { transform: translate(10px,5px) }
          100% { transform: translate(5px,0) }
        }
      `}</style>
    </div>
  )
}
