import React, { useState } from 'react';
import { Megaphone, Plus, Bell, CheckCircle2, Sparkles, X } from 'lucide-react';

interface HeaderProps {
  onOpenNewModal: () => void;
  announcementCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewModal, announcementCount }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Internal assessment timetable updated for 3rd semester', time: '10m ago' },
    { id: 2, text: 'Placement cell added 2 new mock technical interview slots', time: '1h ago' },
    { id: 3, text: 'Ignite 2026 Cultural Fest registrations are surging', time: '3h ago' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/40">
              <Megaphone className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-none">
                  Campus Voice
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-cyan-300 bg-cyan-950/70 rounded-md border border-cyan-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  Live Feed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-200/70 font-medium mt-1">
                One campus. One voice.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full ring-2 ring-slate-900"></span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-4 text-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Campus Alerts</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-xs"
                      >
                        <p className="text-slate-200 font-medium leading-relaxed">{n.text}</p>
                        <span className="text-[10px] text-cyan-300/80 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* + New Announcement Button */}
            <button
              onClick={onOpenNewModal}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-95 rounded-lg shadow-lg shadow-cyan-500/25 border border-cyan-400/30 transition-all duration-150 cursor-pointer"
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
