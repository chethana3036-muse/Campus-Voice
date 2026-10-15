import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryButtons, CategoryFilterType } from './components/CategoryButtons';
import { AnnouncementCard } from './components/AnnouncementCard';
import { NewAnnouncementModal } from './components/NewAnnouncementModal';
import { AnnouncementDetailsModal } from './components/AnnouncementDetailsModal';
import { INITIAL_ANNOUNCEMENTS } from './data/initialAnnouncements';
import { Announcement, Comment } from './types/announcement';
import { Sparkles, Filter, RefreshCw, BookmarkCheck, Heart, MessageSquare } from 'lucide-react';

export default function App() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('campus_voice_announcements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure likes and comments exist on all loaded announcements
        return parsed.map((item: Partial<Announcement>) => ({
          ...item,
          likes: typeof item.likes === 'number' ? item.likes : 0,
          comments: Array.isArray(item.comments) ? item.comments : [],
        }));
      } catch {
        return INITIAL_ANNOUNCEMENTS;
      }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('campus_voice_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  // User Liked Announcements
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('campus_voice_likes');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('campus_voice_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('campus_voice_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('campus_voice_likes', JSON.stringify(likedIds));
  }, [likedIds]);

  // Selected announcement for details modal
  const selectedAnnouncement = useMemo(() => {
    if (!selectedAnnouncementId) return null;
    return announcements.find((a) => a.id === selectedAnnouncementId) || null;
  }, [announcements, selectedAnnouncementId]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleLike = (id: string) => {
    const isCurrentlyLiked = likedIds.includes(id);

    setLikedIds((prev) =>
      isCurrentlyLiked ? prev.filter((item) => item !== id) : [...prev, id]
    );

    setAnnouncements((prev) =>
      prev.map((ann) => {
        if (ann.id === id) {
          return {
            ...ann,
            likes: isCurrentlyLiked ? Math.max(0, ann.likes - 1) : ann.likes + 1,
          };
        }
        return ann;
      })
    );
  };

  const handleAddAnnouncement = (newAnn: Omit<Announcement, 'id'>) => {
    const created: Announcement = {
      ...newAnn,
      id: `ann-${Date.now()}`,
    };
    setAnnouncements((prev) => [created, ...prev]);
  };

  const handleAddComment = (
    announcementId: string,
    commentData: Omit<Comment, 'id' | 'timestamp'>
  ) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: commentData.author,
      role: commentData.role,
      text: commentData.text,
      timestamp: 'Just now',
      likes: 0,
    };

    setAnnouncements((prev) =>
      prev.map((ann) => {
        if (ann.id === announcementId) {
          return {
            ...ann,
            comments: [newComment, ...(ann.comments || [])],
          };
        }
        return ann;
      })
    );
  };

  const handleLikeComment = (announcementId: string, commentId: string) => {
    setAnnouncements((prev) =>
      prev.map((ann) => {
        if (ann.id === announcementId) {
          return {
            ...ann,
            comments: (ann.comments || []).map((comm) => {
              if (comm.id === commentId) {
                return { ...comm, likes: (comm.likes || 0) + 1 };
              }
              return comm;
            }),
          };
        }
        return ann;
      })
    );
  };

  const handleResetToDefault = () => {
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    localStorage.removeItem('campus_voice_announcements');
    localStorage.removeItem('campus_voice_likes');
    setLikedIds([]);
    setSelectedCategory('All');
    setSearchQuery('');
    setShowOnlyBookmarks(false);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      All: announcements.length,
      Academic: announcements.filter((a) => a.category === 'Academic').length,
      Events: announcements.filter((a) => a.category === 'Events').length,
      Placement: announcements.filter((a) => a.category === 'Placement').length,
    };
  }, [announcements]);

  // Filtered announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      // Category filter
      if (selectedCategory !== 'All' && ann.category !== selectedCategory) {
        return false;
      }

      // Bookmarks filter
      if (showOnlyBookmarks && !bookmarkedIds.includes(ann.id)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = ann.title.toLowerCase().includes(query);
        const matchDesc = ann.description.toLowerCase().includes(query);
        const matchDept = ann.department?.toLowerCase().includes(query);
        const matchCat = ann.category.toLowerCase().includes(query);
        const matchComments = ann.comments?.some((c) =>
          c.text.toLowerCase().includes(query) || c.author.toLowerCase().includes(query)
        );
        return matchTitle || matchDesc || matchDept || matchCat || matchComments;
      }

      return true;
    });
  }, [announcements, selectedCategory, showOnlyBookmarks, bookmarkedIds, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Task 1: Header with Campus Voice, Tagline & New Announcement Button */}
      <Header
        onOpenNewModal={() => setIsNewModalOpen(true)}
        announcementCount={announcements.length}
      />

      <main className="flex-1">
        {/* Task 2: Hero Section with Search Bar */}
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalAnnouncements={filteredAnnouncements.length}
        />

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Controls Bar: Category Buttons (Task 3) + View Options */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
            {/* Task 3: Category Buttons (All, Academic, Events, Placement) */}
            <CategoryButtons
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              counts={categoryCounts}
            />

            {/* Additional quick actions: Saved Bookmarks & Reset */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  showOnlyBookmarks
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Saved ({bookmarkedIds.length})</span>
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                title="Restore default announcements"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Bonus Challenge Feature Callout */}
          <div className="mt-8 mb-6 bg-linear-to-r from-indigo-50/70 via-slate-50 to-emerald-50/70 rounded-xl p-4 sm:p-5 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs text-indigo-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Bonus Squad Challenge & Community Engagement
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Explore category-styled cards with live <strong>Likes</strong>, <strong>Q&amp;A Comments</strong>, and real-time <strong>Search</strong> across campus.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Academic
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-100">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Event
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Placement
              </span>
            </div>
          </div>

          {/* Announcement Cards Grid (Task 4, Bonus Challenge, Likes & Comments) */}
          {filteredAnnouncements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onSelect={(ann) => setSelectedAnnouncementId(ann.id)}
                  isBookmarked={bookmarkedIds.includes(announcement.id)}
                  onToggleBookmark={toggleBookmark}
                  isLiked={likedIds.includes(announcement.id)}
                  onToggleLike={toggleLike}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-12">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No announcements found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {searchQuery
                  ? `No bulletins matched "${searchQuery}". Try a different keyword or clear your search.`
                  : 'There are currently no announcements matching this filter.'}
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setShowOnlyBookmarks(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  Create an announcement
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Campus Voice</span>
            <span>&bull;</span>
            <span>One campus. One voice.</span>
          </div>
          <div>
            <span>Official University Communication Portal &bull; Updated Daily</span>
          </div>
        </div>
      </footer>

      {/* New Announcement Modal */}
      <NewAnnouncementModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAddAnnouncement={handleAddAnnouncement}
      />

      {/* Full Details & Comment Section Modal */}
      <AnnouncementDetailsModal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncementId(null)}
        isLiked={selectedAnnouncement ? likedIds.includes(selectedAnnouncement.id) : false}
        onToggleLike={toggleLike}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
      />
    </div>
  );
}
