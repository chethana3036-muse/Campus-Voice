import React from 'react';
import { Megaphone, Plus } from 'lucide-react';

interface HeaderProps {
  onOpenNewModal: () => void;
  announcementCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewModal, announcementCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm ring-4 ring-indigo-50">
              <Megaphone className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-none">
                  Campus Voice
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold tracking-wide text-indigo-700 bg-indigo-50 rounded-md border border-indigo-100/80">
                  Live Feed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                One campus. One voice.
              </p>
            </div>
          </div>

          {/* Action button: + New Announcement */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewModal}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm hover:shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
              <span>New Announcement</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
