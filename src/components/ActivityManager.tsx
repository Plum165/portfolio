import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Plus, Edit2, ShieldAlert } from 'lucide-react';
import { Activity, AuthState } from '../types';

interface ActivityManagerProps {
  authState: AuthState;
  activityToEdit?: Activity | null;
  onClose: () => void;
  onActivitySaved: () => void;
}

export default function ActivityManager({ authState, activityToEdit, onClose, onActivitySaved }: ActivityManagerProps) {
  const [title, setTitle] = useState(activityToEdit?.title || '');
  const [category, setCategory] = useState<'sport' | 'volunteer'>(activityToEdit?.category || 'sport');
  const [date, setDate] = useState(activityToEdit?.date || 'Ongoing');
  const [badge, setBadge] = useState(activityToEdit?.badge || 'Volunteer');
  const [desc, setDesc] = useState(activityToEdit?.desc || '');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !category) {
      setError('Title, Description and Category are required.');
      return;
    }

    setLoading(true);
    setError('');

    const activityPayload = {
      title: title.trim(),
      category,
      date: date.trim() || 'Ongoing',
      badge: badge.trim() || 'Activity',
      desc: desc.trim()
    };

    try {
      const endpoint = activityToEdit 
        ? `/api/activities/${activityToEdit.id}` 
        : '/api/activities';
      const method = activityToEdit ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(activityPayload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save activity change');
      }

      onActivitySaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during activity save.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="activity-manager-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Background black overlap click-guard */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <h3 id="act-modal-title" className="text-xl font-bold font-sans text-white flex items-center gap-2">
            {activityToEdit ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-emerald-400" />}
            {activityToEdit ? `Edit Activity` : 'Add Activity / Sport'}
          </h3>
          <button
            id="close-act-manager-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close activity manager modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div id="activity-manager-error" className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/20 text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form area */}
        <form onSubmit={handleSave} className="space-y-4 overflow-y-auto flex-1 pr-1">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="act-title">Activity Title</label>
            <input
              id="act-title"
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              placeholder="UCT Archery Club Equipment Manager"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="act-category">Type / Category</label>
              <select
                id="act-category"
                className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                required
              >
                <option value="sport">Sports & Rec</option>
                <option value="volunteer">Volunteering & Community</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="act-badge">Badge Label</label>
              <input
                id="act-badge"
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="Club Management, Coach & Captain"
                value={badge}
                onChange={e => setBadge(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="act-date">Date / Year Range</label>
            <input
              id="act-date"
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              placeholder="2025 – 2026 or Ongoing"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="act-desc">Responsibilities / Highlights</label>
            <textarea
              id="act-desc"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="Overseeing archery club operations, maintaining gear, coordinating with treasurer..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              required
            />
          </div>

          {/* Actions */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-end gap-3 mt-4">
            <button
              id="cancel-act-btn"
              type="button"
              onClick={onClose}
              className="py-1.5 px-4 rounded-lg border border-white/10 text-white/70 hover:text-white text-xs transition"
            >
              Cancel
            </button>
            <button
              id="save-act-btn"
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-semibold py-1.5 px-6 rounded-lg text-xs transition flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
