import React, { useState, useSyncExternalStore } from 'react'

function subscribeToMotionPreference(onChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

type Motion = 'unknown' | 'ok' | 'still'

/** Reads the visitor's motion and data-saver preferences. Only callable in the browser. */
function readMotion(): Motion {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return reduced || conn?.saveData ? 'still' : 'ok'
}

/**
 * Decorative looping background for the hero. It carries no information, so it is hidden from
 * assistive tech. Falls back to the poster frame for reduced motion, data saver or playback errors.
 */
export const HeroBackdrop: React.FC = () => {
  // The server (and the first client render, so hydration matches) is 'unknown' and shows only the poster.
  // The video is created after hydration, and only if the visitor has not asked for less motion or data.
  const motion = useSyncExternalStore(subscribeToMotionPreference, readMotion, (): Motion => 'unknown')
  const [failed, setFailed] = useState(false)
  const still = motion !== 'ok' || failed

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-surface-0" aria-hidden>
      {still ? (
        <img src="/media/hero-poster.jpg" alt="" className="h-full w-full object-cover object-[75%_center]" />
      ) : (
        <video
          className="h-full w-full object-cover object-[75%_center]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/hero-poster.jpg"
          onError={() => setFailed(true)}
        >
          <source src="/media/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      )}
      {/* Keeps the headline and search readable over the moving cards */}
      <div className="absolute inset-0 bg-gradient-to-r from-surface-0 via-surface-0/85 to-surface-0/10 max-lg:from-surface-0/90 max-lg:via-surface-0/75 max-lg:to-surface-0/55" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-0 to-transparent" />
    </div>
  )
}
