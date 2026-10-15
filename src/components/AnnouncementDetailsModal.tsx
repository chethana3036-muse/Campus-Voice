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
      setCommentError('Please type a comment before posting.');
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
          colorText: 'text-indigo-700',
          bgBadge: 'bg-indigo-50 border-indigo-200/60',
          accentBorder: 'border-l-indigo-600',
        };
      case 'Events':
        return {
          icon: Calendar,
          colorText: 'text-amber-700',
          bgBadge: 'bg-amber-50 border-amber-200/60',
          accentBorder: 'border-l-amber-500',
        };
      case 'Placement':
        return {
          icon: Briefcase,
          colorText: 'text-emerald-700',
          bgBadge: 'bg-emerald-50 border-emerald-200/60',
          accentBorder: 'border-l-emerald-600',
        };
      default:
        return {
          icon: GraduationCap,
          colorText: 'text-slate-700',
          bgBadge: 'bg-slate-50 border-slate-200/60',
          accentBorder: 'border-l-slate-600',
        };
    }
  };

  const theme = getCategoryTheme();
  const Icon = theme.icon;
  const comments = announcement.comments || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Sticky Header */}
        <div className="shrink-0 flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${theme.bgBadge} ${theme.colorText}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {announcement.category}
            </span>
            {announcement.isImportant && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                High Priority
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 leading-snug">
              {announcement.title}
            </h2>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 font-medium mt-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{announcement.date} • {announcement.time}</span>
              </div>
              {announcement.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{announcement.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {announcement.description}
          </div>

          {/* Department / Author Information */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs text-slate-600">
            {announcement.department && (
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">Issued by: </span>
                  {announcement.department}
                </div>
              </div>
            )}
            {announcement.author && (
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">Authority: </span>
                  {announcement.author}
                </div>
              </div>
            )}
          </div>

          {/* Engagement Bar: Like & Share Action */}
          <div className="flex items-center justify-between py-2 border-y border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleLike && onToggleLike(announcement.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50/50 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-rose-600' : ''}`} />
                <span>{isLiked ? 'Liked' : 'Like'} ({announcement.likes})</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span>{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Campus Discussion & Q&amp;A</span>
              </h3>
              <span className="text-xs text-slate-400">Questions or remarks</span>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handlePostComment} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your Name (e.g. Rahul S.)"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
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
                  placeholder="Ask a question about this notice or leave a comment..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 resize-none"
                />
              </div>

              {commentError && (
                <p className="text-rose-600 text-xs">{commentError}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors cursor-pointer"
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
                    className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{comment.author}</span>
                        {comment.role && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            {comment.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{comment.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {comment.text}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <button
                        type="button"
                        onClick={() => onLikeComment && onLikeComment(announcement.id, comment.id)}
                        className="inline-flex items-center gap-1 hover:text-indigo-600 transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Helpful ({comment.likes || 0})</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">
                    No comments yet. Be the first to start the discussion!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 p-4 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
