import React, { useState } from 'react';
import { Category, Announcement } from '../types/announcement';
import { X, Plus, GraduationCap, Calendar, Briefcase } from 'lucide-react';

interface NewAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
}

export const NewAnnouncementModal: React.FC<NewAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onAddAnnouncement,
}) => {
  const [category, setCategory] = useState<Category>('Academic');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  });
  const [time, setTime] = useState(() => {
    const today = new Date();
    return today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  });
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an announcement title.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide announcement details.');
      return;
    }

    onAddAnnouncement({
      category,
      title: title.trim(),
      description: description.trim(),
      date: date.trim() || 'Today',
      time: time.trim() || '10:00 AM',
      department: department.trim() || undefined,
      location: location.trim() || undefined,
      isImportant,
      likes: 0,
      comments: [],
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setDepartment('');
    setLocation('');
    setIsImportant(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 id="modal-title" className="text-xl font-bold text-slate-900">
              Post New Announcement
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Broadcast updates to all campus students and faculty
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Select Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'Academic', icon: GraduationCap, activeBorder: 'border-indigo-600 bg-indigo-50 text-indigo-700' },
                  { id: 'Events', icon: Calendar, activeBorder: 'border-amber-500 bg-amber-50 text-amber-800' },
                  { id: 'Placement', icon: Briefcase, activeBorder: 'border-emerald-600 bg-emerald-50 text-emerald-800' },
                ] as const
              ).map(({ id, icon: Icon, activeBorder }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCategory(id)}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
                    category === id
                      ? `${activeBorder} shadow-xs ring-1 ring-inset`
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span>{id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Announcement Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Announcement Title *
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mid-Term Assessment Schedule or Hackathon Launch"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          {/* Announcement Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide clear instructions, deadlines, links or eligibility guidelines..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="date" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Date
              </label>
              <input
                id="date"
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="28 September 2026"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Time
              </label>
              <input
                id="time"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:30 AM"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* Department & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="department" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Department / Wing
              </label>
              <input
                id="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Dean Academics"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Location / Venue
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Main Auditorium"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              Publish Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
