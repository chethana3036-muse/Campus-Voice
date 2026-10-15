import React, { useState } from 'react';
import { Announcement, Category } from '../types/announcement';
import {
  GraduationCap,
  Calendar,
  Briefcase,
  Clock,
  MapPin,
  Building2,
  Bookmark,
  Check,
  Share2,
  Heart,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface AnnouncementCardProps {
  announcement: Announcement;
  onSelect: (announcement: Announcement) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  isLiked?: boolean;
  onToggleLike?: (id: string) => void;
}

interface CategoryStyleConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  accentBorder: string;
  accentGlow: string;
  iconBg: string;
  iconColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_STYLES: Record<Category, CategoryStyleConfig> = {
  Academic: {
    label: 'ACADEMIC',
    badgeBg: 'bg-indigo-950/70 border-indigo-500/40',
    badgeText: 'text-indigo-300',
    accentBorder: 'border-l-indigo-500',
    accentGlow: 'hover:shadow-indigo-500/20',
    iconBg: 'bg-indigo-900/50 text-indigo-300 border-indigo-500/40',
    iconColor: 'text-indigo-400',
    icon: GraduationCap,
  },
  Events: {
    label: 'EVENT',
    badgeBg: 'bg-amber-950/70 border-amber-500/40',
    badgeText: 'text-amber-300',
    accentBorder: 'border-l-amber-400',
    accentGlow: 'hover:shadow-amber-500/20',
    iconBg: 'bg-amber-900/50 text-amber-300 border-amber-500/40',
    iconColor: 'text-amber-400',
    icon: Calendar,
  },
  Placement: {
    label: 'PLACEMENT',
    badgeBg: 'bg-emerald-950/70 border-emerald-500/40',
    badgeText: 'text-emerald-300',
    accentBorder: 'border-l-emerald-400',
    accentGlow: 'hover:shadow-emerald-500/20',
    iconBg: 'bg-emerald-900/50 text-emerald-300 border-emerald-500/40',
    iconColor: 'text-emerald-400',
    icon: Briefcase,
  },
};

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onSelect,
  isBookmarked = false,
  onToggleBookmark,
  isLiked = false,
  onToggleLike,
}) => {
  const [copied, setCopied] = useState(false);
  const style = CATEGORY_STYLES[announcement.category] || CATEGORY_STYLES.Academic;
  const CategoryIcon = style.icon;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `${announcement.title}\n${announcement.description}\n${announcement.date} • ${announcement.time}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(announcement.id);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleLike) {
      onToggleLike(announcement.id);
    }
  };

  const commentCount = announcement.comments?.length || 0;

  return (
    <article
      onClick={() => onSelect(announcement)}
      className={`group relative glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer border-l-4 ${style.accentBorder} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${style.accentGlow}`}
    >
      <div>
        {/* Top Header: CATEGORY and Card Actions */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center border shadow-xs ${style.iconBg}`}
              aria-hidden="true"
            >
              <CategoryIcon className="w-3.5 h-3.5" />
            </span>
            <span
              className={`text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${style.badgeBg} ${style.badgeText}`}
            >
              {style.label}
            </span>
            {announcement.isImportant && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded-md">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1 text-slate-400">
            <button
              type="button"
              onClick={handleShare}
              title="Copy announcement"
              className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            {onToggleBookmark && (
              <button
                type="button"
                onClick={handleBookmark}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark announcement'}
                className={`p-1.5 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'text-cyan-400 bg-cyan-950/70 border border-cyan-500/30'
                    : 'hover:text-white hover:bg-white/10'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-cyan-400' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Announcement Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
          {announcement.title}
        </h3>

        {/* Announcement description... */}
        <p className="mt-2.5 text-sm text-slate-300 leading-relaxed line-clamp-3 font-normal">
          {announcement.description}
        </p>

        {/* Department / Location metadata */}
        {(announcement.department || announcement.location) && (
          <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs text-slate-400">
            {announcement.department && (
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
                <span className="truncate">{announcement.department}</span>
              </div>
            )}
            {announcement.location && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
                <span className="truncate">{announcement.location}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Area: Date • Time & Engagement (Likes, Comments) */}
      <div className="mt-5 pt-3.5 border-t border-white/10 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          {/* Date • Time */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <time dateTime={`${announcement.date} ${announcement.time}`}>
              {announcement.date} <span className="text-cyan-400 font-bold mx-0.5">•</span> {announcement.time}
            </time>
          </div>

          <span className="text-cyan-300 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            Read details &rarr;
          </span>
        </div>

        {/* Like & Comment Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
          <div className="flex items-center gap-3">
            {/* Like Button */}
            <button
              type="button"
              onClick={handleLike}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                isLiked
                  ? 'text-rose-300 bg-rose-950/70 border border-rose-500/40 font-semibold shadow-xs shadow-rose-500/20'
                  : 'text-slate-400 hover:text-rose-400 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-400' : ''}`} />
              <span>{announcement.likes}</span>
            </button>

            {/* Comment Count / Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(announcement);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{commentCount}</span>
            </button>
          </div>

          <span className="text-[11px] text-cyan-400/80">Campus Q&amp;A</span>
        </div>
      </div>
    </article>
  );
};
