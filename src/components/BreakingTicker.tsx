import React from 'react';
import { Volume2, VolumeX, Sparkles, Radio } from 'lucide-react';

interface BreakingTickerProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  bubblesPopped: number;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  soundEnabled,
  onToggleSound,
  bubblesPopped,
}) => {
  return (
    <div className="relative z-20 bg-linear-to-r from-blue-950/90 via-indigo-950/90 to-blue-950/90 border-b border-cyan-500/20 text-xs backdrop-blur-md text-cyan-200">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Left tag */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-bold tracking-wider text-cyan-300 uppercase text-[11px] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campus Live</span>
          </span>
        </div>

        {/* Marquee ticker text */}
        <div className="overflow-hidden whitespace-nowrap flex-1 text-slate-300 text-xs">
          <div className="inline-block animate-marquee hover:[animation-play-state:paused]">
            <span className="mx-4 text-cyan-300 font-semibold">•</span>
            <span>Internal assessments begin next Monday — check revised classroom slots</span>
            <span className="mx-4 text-cyan-300 font-semibold">•</span>
            <span className="text-amber-300 font-medium">Ignite 2026: Battle of Bands registrations open</span>
            <span className="mx-4 text-cyan-300 font-semibold">•</span>
            <span className="text-emerald-300 font-medium">Google &amp; Microsoft Pre-placement talk Oct 12th</span>
            <span className="mx-4 text-cyan-300 font-semibold">•</span>
            <span>Library extends 24/7 hours during exam cycle</span>
          </div>
        </div>

        {/* Bubble Pop counter & Sound Toggle */}
        <div className="flex items-center gap-3 shrink-0 text-slate-400">
          {bubblesPopped > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-cyan-900/40 border border-cyan-500/30 text-cyan-300">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{bubblesPopped} popped!</span>
            </span>
          )}

          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-slate-900/60 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Muted</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
