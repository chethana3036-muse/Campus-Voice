import React, { useState } from 'react';
import { Announcement, Comment } from '../types/announcement';
import {
  X,
  Clock,
  Building2,
  MapPin,
  Share2,
  Check,
  User,
  GraduationCap,
  Calendar,
  Briefcase,
  Heart,
  MessageSquare,
  Send,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';

interface AnnouncementDetailsModalProps {
  announcement: Announcement | null;
  onClose: () => void;
  isLiked?: boolean;
  onToggleLike?: (id: string) => void;
  onAddComment?: (announcementId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  onLikeComment?: (announcementId: string, commentId: string) => void;
}

export const AnnouncementDetailsModal: React.FC<AnnouncementDetailsModalProps> = ({
  announcement,
  onClose,
  isLiked = false,
  onToggleLike,
  onAddComment,
  onLikeComment,
}) => {
  const [copied, setCopied] = useState(false);
  const [authorName, setAuthorName] = useState(() => {
    return localStorage.getItem('campus_voice_user_name') || '';
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('campus_voice_user_role') || 'Student';
  });
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  if (!announcement) return null;

  const handleCopy = () => {
    const text = `${announcement.title}\n\n${announcement.description}\n\nCategory: ${announcement.category}\nDate & Time: ${announcement.date} • ${announcement.time}\nDepartment: ${announcement.department || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setCommentError('Please write a comment or question before submitting.');
      return;
    }
    const name = authorName.trim() || 'Anonymous Student';
    localStorage.setItem('campus_voice_user_name', name);
    localStorage.setItem('campus_voice_user_role', role);

    if (onAddComment) {
      onAddComment(announcement.id, {
        author: name,
        role: role,
        text: commentText.trim(),
        likes: 0,
      });
    }

    setCommentText('');
    setCommentError('');
  };

  const getCategoryTheme = () => {
    switch (announcement.category) {
      case 'Academic':
        return {
          icon: GraduationCap,
          colorText: 'text-indigo-300',
          bgBadge: 'bg-indigo-950/80 border-indigo-500/50',
          accentBorder: 'border-l-indigo-500',
        };
      case 'Events':
        return {
          icon: Calendar,
          colorText: 'text-amber-300',
          bgBadge: 'bg-amber-950/80 border-amber-500/50',
          accentBorder: 'border-l-amber-400',
        };
      case 'Placement':
        return {
          icon: Briefcase,
          colorText: 'text-emerald-300',
          bgBadge: 'bg-emerald-950/80 border-emerald-500/50',
          accentBorder: 'border-l-emerald-400',
        };
      default:
        return {
          icon: GraduationCap,
          colorText: 'text-cyan-300',
          bgBadge: 'bg-cyan-950/80 border-cyan-500/50',
          accentBorder: 'border-l-cyan-500',
        };
    }
  };

  const theme = getCategoryTheme();
  const Icon = theme.icon;
  const comments = announcement.comments || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-slate-900/95 backdrop-blur-2xl rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-cyan-400/25 animate-in fade-in zoom-in-95 duration-150 text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Sticky Header */}
        <div className="shrink-0 flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${theme.bgBadge} ${theme.colorText}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {announcement.category}
            </span>
            {announcement.isImportant && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-rose-950/70 text-rose-300 border border-rose-500/40">
                High Priority
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              {announcement.title}
            </h2>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400 font-medium mt-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{announcement.date} • {announcement.time}</span>
              </div>
              {announcement.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{announcement.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line py-1">
            {announcement.description}
          </div>

          {/* Department / Author Information */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-white/10 space-y-2 text-xs text-slate-300">
            {announcement.department && (
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Issued by: </span>
                  {announcement.department}
                </div>
              </div>
            )}
            {announcement.author && (
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Authority: </span>
                  {announcement.author}
                </div>
              </div>
            )}
          </div>

          {/* Engagement Bar: Like & Share Action */}
          <div className="flex items-center justify-between py-2.5 border-y border-white/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleLike && onToggleLike(announcement.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-500/20'
                    : 'bg-white/5 text-slate-200 border border-white/10 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-500/30'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-rose-400' : ''}`} />
                <span>{isLiked ? 'Liked' : 'Like'} ({announcement.likes})</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Share Notice</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Campus Discussion &amp; Q&amp;A</span>
              </h3>
              <span className="text-xs text-cyan-300/80">Active student discussion</span>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handlePostComment} className="bg-slate-950/70 p-4 rounded-xl border border-white/10 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your Name (e.g. Rahul S.)"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/15 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400"
                  />
                </div>
                <div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/15 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Placement Rep">Placement Rep</option>
                    <option value="Club Lead">Club Lead</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ask a question about this notice or leave a remark..."
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/15 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 resize-none"
                />
              </div>

              {commentError && (
                <p className="text-rose-400 text-xs">{commentError}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 rounded-lg shadow-md shadow-cyan-400/30 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-1">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3.5 bg-slate-950/60 rounded-xl border border-white/10 space-y-1.5 hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{comment.author}</span>
                        {comment.role && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                            {comment.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{comment.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                      {comment.text}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <button
                        type="button"
                        onClick={() => onLikeComment && onLikeComment(announcement.id, comment.id)}
                        className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3 h-3 text-cyan-400" />
                        <span>Helpful ({comment.likes || 0})</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-slate-950/40 rounded-xl border border-dashed border-white/10">
                  <p className="text-xs text-slate-400">
                    No comments yet. Be the first to start the discussion!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 p-4 border-t border-white/10 bg-slate-950/80 rounded-b-2xl flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
