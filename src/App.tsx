import React, { useState, useMemo, useEffect } from 'react';
import { FloatingBubbles } from './components/FloatingBubbles';
import { BreakingTicker } from './components/BreakingTicker';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryButtons, CategoryFilterType } from './components/CategoryButtons';
import { AnnouncementCard } from './components/AnnouncementCard';
import { NewAnnouncementModal } from './components/NewAnnouncementModal';
import { AnnouncementDetailsModal } from './components/AnnouncementDetailsModal';
import { INITIAL_ANNOUNCEMENTS } from './data/initialAnnouncements';
import { Announcement, Comment } from './types/announcement';
import { playBubblePop, playChime } from './utils/sound';
import {
  Sparkles,
  Filter,
  RefreshCw,
  BookmarkCheck,
  ArrowUpDown,
} from 'lucide-react';

export default function App() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('campus_voice_announcements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
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
  const [sortBy, setSortBy] = useState<'latest' | 'likes' | 'comments'>('latest');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);

  // Audio & Interactive Bubble Pop state
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('campus_voice_sound') !== 'false';
  });
  const [bubblesPopped, setBubblesPopped] = useState(0);

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

  useEffect(() => {
    localStorage.setItem('campus_voice_sound', soundEnabled ? 'true' : 'false');
  }, [soundEnabled]);

  // Selected announcement for details modal
  const selectedAnnouncement = useMemo(() => {
    if (!selectedAnnouncementId) return null;
    return announcements.find((a) => a.id === selectedAnnouncementId) || null;
  }, [announcements, selectedAnnouncementId]);

  const toggleBookmark = (id: string) => {
    playChime(soundEnabled);
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleLike = (id: string) => {
    const isCurrentlyLiked = likedIds.includes(id);
    playBubblePop(soundEnabled);

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
    playChime(soundEnabled);
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
    playBubblePop(soundEnabled);
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
    playBubblePop(soundEnabled);
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
    playChime(soundEnabled);
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

  // Filtered and sorted announcements
  const filteredAnnouncements = useMemo(() => {
    const filtered = announcements.filter((ann) => {
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

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'likes') {
        return b.likes - a.likes;
      }
      if (sortBy === 'comments') {
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      }
      return 0; // Default original / latest order
    });
  }, [announcements, selectedCategory, showOnlyBookmarks, bookmarkedIds, searchQuery, sortBy]);

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Sparkly Blue Background with Floating Interactive Bubbles */}
      <FloatingBubbles
        soundEnabled={soundEnabled}
        onBubblePopCount={() => setBubblesPopped((p) => p + 1)}
      />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Live Marquee & Sound Controller */}
        <BreakingTicker
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((v) => !v)}
          bubblesPopped={bubblesPopped}
        />

        {/* Task 1: Header with Campus Voice, Tagline & New Announcement Button */}
        <Header
          onOpenNewModal={() => setIsNewModalOpen(true)}
          announcementCount={announcements.length}
        />

        <main className="flex-1">
          {/* Task 2: Hero Section with Glowing Search Bar */}
          <Hero
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalAnnouncements={filteredAnnouncements.length}
          />

          {/* Main Content Area */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Controls Bar: Category Buttons (Task 3) + Sort & Bookmarks */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
              {/* Task 3: Category Buttons (All, Academic, Events, Placement) */}
              <CategoryButtons
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                counts={categoryCounts}
              />

              {/* Additional controls: Sort & Bookmarks & Reset */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                {/* Sort selector */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-white/10 text-xs text-slate-300">
                  <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'latest' | 'likes' | 'comments')}
                    className="bg-transparent text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="latest" className="bg-slate-900 text-white">Latest</option>
                    <option value="likes" className="bg-slate-900 text-white">Most Liked</option>
                    <option value="comments" className="bg-slate-900 text-white">Most Discussed</option>
                  </select>
                </div>

                {/* Saved Bookmarks */}
                <button
                  type="button"
                  onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                    showOnlyBookmarks
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm shadow-cyan-400/40'
                      : 'bg-slate-900/70 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Saved ({bookmarkedIds.length})</span>
                </button>

                {/* Reset button */}
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  title="Restore default announcements"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 bg-slate-900/70 border border-white/10 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Reset</span>
                </button>
              </div>
            </div>

            {/* Sparkly Blue Theme Banner / Bonus Squad Challenge Kicker */}
            <div className="mt-8 mb-6 glass-panel rounded-2xl p-4 sm:p-5 border border-cyan-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/30 shadow-xs text-cyan-300">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Bonus Squad Challenge: Distinct Category Design</span>
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded-md bg-cyan-950/70 text-cyan-300 border border-cyan-500/30">
                      Interactive Live Board
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Click any floating bubble to pop it, tap notices to view full discussions, or filter by category below.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold shrink-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-500/40">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Academic
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-500/40">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Event
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Placement
                </span>
              </div>
            </div>

            {/* Announcement Cards Grid (Task 4 & Squad Bonus Challenge) */}
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
              <div className="glass-panel rounded-2xl border border-dashed border-white/20 p-12 text-center max-w-lg mx-auto my-12">
                <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 mb-4">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">
                  No announcements found
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 max-w-xs mx-auto">
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
                    className="px-4 py-2 text-xs font-semibold bg-cyan-500 text-slate-950 rounded-xl hover:bg-cyan-400 transition-colors cursor-pointer font-bold"
                  >
                    Clear all filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(true)}
                    className="px-4 py-2 text-xs font-semibold bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Create an announcement
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto bg-slate-950/80 border-t border-white/10 py-8 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Campus Voice</span>
              <span>&bull;</span>
              <span className="text-cyan-300">One campus. One voice.</span>
            </div>
            <div>
              <span>Official University Broadcast Portal &bull; Updated Daily</span>
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
    </div>
  );
}
