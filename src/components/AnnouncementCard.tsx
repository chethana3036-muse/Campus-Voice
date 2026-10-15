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
  accentBar: string;
  iconBg: string;
  iconColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_STYLES: Record<Category, CategoryStyleConfig> = {
  Academic: {
    label: 'ACADEMIC',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    accentBorder: 'border-l-indigo-600',
    accentBar: 'bg-indigo-600',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    iconColor: 'text-indigo-600',
    icon: GraduationCap,
  },
  Events: {
    label: 'EVENT',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    accentBorder: 'border-l-amber-500',
    accentBar: 'bg-amber-500',
    iconBg: 'bg-amber-50 text-amber-700 border-amber-100',
    iconColor: 'text-amber-600',
    icon: Calendar,
  },
  Placement: {
    label: 'PLACEMENT',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    accentBorder: 'border-l-emerald-600',
    accentBar: 'bg-emerald-600',
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    iconColor: 'text-emerald-600',
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
      className={`group relative bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 p-6 flex flex-col justify-between cursor-pointer border-l-4 ${style.accentBorder}`}
    >
      <div>
        {/* Top Header: CATEGORY and Card Actions */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center border ${style.iconBg}`}
              aria-hidden="true"
            >
              <CategoryIcon className="w-3.5 h-3.5" />
            </span>
            <span className={`text-xs font-bold tracking-wider uppercase ${style.badgeText}`}>
              {style.label}
            </span>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShare}
              title="Copy announcement"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            {onToggleBookmark && (
              <button
                type="button"
                onClick={handleBookmark}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark announcement'}
                className={`p-1.5 rounded-md transition-colors ${
                  isBookmarked
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Announcement Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
          {announcement.title}
        </h3>

        {/* Announcement description... */}
        <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
          {announcement.description}
        </p>

        {/* Department / Location metadata */}
        {(announcement.department || announcement.location) && (
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
            {announcement.department && (
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{announcement.department}</span>
              </div>
            )}
            {announcement.location && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{announcement.location}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Area: Date • Time & Engagement (Likes, Comments) */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          {/* Date • Time */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <time dateTime={`${announcement.date} ${announcement.time}`}>
              {announcement.date} <span className="text-slate-400 font-bold mx-0.5">•</span> {announcement.time}
            </time>
          </div>

          <span className="text-indigo-600 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            Read more &rarr;
          </span>
        </div>

        {/* Like & Comment Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
          <div className="flex items-center gap-3">
            {/* Like Button */}
            <button
              type="button"
              onClick={handleLike}
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
                isLiked
                  ? 'text-rose-600 bg-rose-50 font-semibold'
                  : 'text-slate-500 hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-600' : ''}`} />
              <span>{announcement.likes}</span>
            </button>

            {/* Comment Count / Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(announcement);
              }}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{commentCount}</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400">Click to discuss</span>
        </div>
      </div>
    </article>
  );
};
