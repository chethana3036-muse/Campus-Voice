import React from 'react';
import { Search, X, Sparkles, Flame } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalAnnouncements: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  totalAnnouncements,
}) => {
  const quickSearches = ['Assessment', 'Ignite', 'Google', 'Internship', 'Hackathon'];

  return (
    <section className="relative z-10 pt-10 pb-8 sm:pt-14 sm:pb-12 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          {/* Bulletin badge with glowing border */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 px-3.5 py-1.5 rounded-full mb-4 shadow-sm shadow-cyan-500/20 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" aria-hidden="true" />
            <span>Official Student &amp; Faculty Broadcast</span>
          </div>

          {/* Heading & Subtitle */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white via-cyan-100 to-sky-300 tracking-tight leading-tight filter drop-shadow-sm">
            What&apos;s happening on campus?
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
            Stay updated with the latest announcements.
          </p>
        </div>

        {/* Enhanced Glassmorphic Search Bar with Cyan Glow */}
        <div className="glass-panel p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-cyan-400/20 max-w-3xl relative group">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-cyan-400">
              <Search className="w-5 h-5" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search announcements by title, department, exam, or keyword..."
              className="w-full pl-12 pr-10 py-3.5 text-sm sm:text-base bg-slate-900/80 text-white placeholder:text-slate-400 rounded-xl border border-white/10 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all shadow-inner font-normal"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4 bg-slate-800 hover:bg-slate-700 rounded-full p-0.5" />
              </button>
            )}
          </div>

          {/* Quick Search Tags & Live Count */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 px-1 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-slate-300">
              <span className="font-medium text-cyan-300 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                Popular:
              </span>
              {quickSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onSearchChange(term)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    searchQuery.toLowerCase() === term.toLowerCase()
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-400/50'
                      : 'bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white border border-white/10'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="text-slate-400 font-medium ml-auto">
              {searchQuery ? (
                <span className="text-cyan-300 font-semibold bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/30">
                  {totalAnnouncements} matching result{totalAnnouncements !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-slate-400">
                  <span className="text-cyan-300 font-semibold">{totalAnnouncements}</span> active bulletin{totalAnnouncements !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
