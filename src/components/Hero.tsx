import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

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
    <section className="pt-10 pb-8 sm:pt-14 sm:pb-10 border-b border-slate-200/80 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          {/* Bulletin badge */}
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-3.5">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Official Student & Faculty Bulletin</span>
          </div>

          {/* Heading & Subtitle */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            What&apos;s happening on campus?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Stay updated with the latest announcements.
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="bg-slate-50 p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 shadow-xs max-w-3xl">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-slate-500" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search announcements by title, department, exam, or keyword..."
              className="w-full pl-11 pr-10 py-3 text-sm sm:text-base bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 outline-none transition-all shadow-2xs font-normal"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full p-0.5" />
              </button>
            )}
          </div>

          {/* Quick Search Tags & Result Counter */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 px-1 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-slate-500">
              <span className="font-medium text-slate-600">Popular:</span>
              {quickSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onSearchChange(term)}
                  className={`px-2 py-0.5 rounded-md text-xs transition-colors cursor-pointer ${
                    searchQuery.toLowerCase() === term.toLowerCase()
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/70'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="text-slate-500 font-medium ml-auto">
              {searchQuery ? (
                <span className="text-indigo-600 font-semibold">
                  Found {totalAnnouncements} result{totalAnnouncements !== 1 ? 's' : ''}
                </span>
              ) : (
                <span>{totalAnnouncements} active announcement{totalAnnouncements !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
