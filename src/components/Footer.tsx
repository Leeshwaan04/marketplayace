import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-gray-800 bg-gray-950 text-gray-400 text-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 p-[1.5px]">
              <div className="w-full h-full bg-gray-950 rounded-[7px] flex items-center justify-center font-black text-purple-400 text-sm">
                A
              </div>
            </div>
            <span className="text-base font-extrabold text-white tracking-tight">
              MARKET<span className="text-purple-400">PLAY</span>ACE
            </span>
          </div>
          <p className="text-gray-400 leading-relaxed text-xs">
            The next-generation play-first commerce protocol. Blending high-tier creator drops, zero-loss mini-games, squad purchasing, and dynamic Dutch reverse auctions.
          </p>
          <div className="flex items-center space-x-3 pt-1">
            <a
              href="https://github.com/Leeshwaan04/marketplayace"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 transition-colors inline-flex items-center"
              title="GitHub Repository"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Marketplace Modes */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase font-mono tracking-wider text-[11px]">Play Mechanics</h4>
          <ul className="space-y-1.5 text-gray-400">
            <li><span className="hover:text-purple-400 cursor-pointer">Reflex Bar Mini-Games</span></li>
            <li><span className="hover:text-purple-400 cursor-pointer">Dutch Reverse Vault Drops</span></li>
            <li><span className="hover:text-purple-400 cursor-pointer">3-Player Co-op Squad Carts</span></li>
            <li><span className="hover:text-purple-400 cursor-pointer">Daily Ace Mystery Tiles</span></li>
          </ul>
        </div>

        {/* Column 3: Roadmap */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase font-mono tracking-wider text-[11px]">Roadmap 2026</h4>
          <ul className="space-y-1.5 text-gray-400">
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>v1.0 Interactive Play Floor</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span>Spatial 2D/3D Booth Explorer</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Squad Voice Rooms & Live Bids</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>AI Ace Personal Bargain Bot</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Architecture */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase font-mono tracking-wider text-[11px]">Built With</h4>
          <div className="p-3 bg-gray-900 rounded-xl border border-gray-800 space-y-1.5 font-mono text-[11px] text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-500">Engine:</span>
              <span className="text-purple-400">React 19 + Vite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Styling:</span>
              <span className="text-pink-400">Tailwind CSS v4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Audio:</span>
              <span className="text-emerald-400">Web Audio Synth</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Repository:</span>
              <span className="text-cyan-400">Leeshwaan04</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Tech Bar */}
      <div className="border-t border-gray-900 py-6 px-4 text-center text-gray-500 text-[11px] flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <p>© 2026 marketplayace.com. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 flex items-center justify-center space-x-1">
          <span>Engineered with passion for gaming, creators, and play-first commerce</span>
        </p>
      </div>
    </footer>
  )
}

