import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Plus, Edit2, ShieldAlert } from 'lucide-react';
import { WorkExperience, AuthState } from '../types';

interface WorkManagerProps {
  authState: AuthState;
  workToEdit?: WorkExperience | null;
  onClose: () => void;
  onWorkSaved: () => void;
}

export default function WorkManager({ authState, workToEdit, onClose, onWorkSaved }: WorkManagerProps) {
  const [role, setRole] = useState(workToEdit?.role || '');
  const [company, setCompany] = useState(workToEdit?.company || '');
  const [duration, setDuration] = useState(workToEdit?.duration || '');
  const [desc, setDesc] = useState(workToEdit?.desc || '');
  const [category, setCategory] = useState(workToEdit?.category || 'Tutoring');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !company || !desc) {
      setError('Role, Company, and Description are required.');
      return;
    }

    setLoading(true);
    setError('');

    const workPayload = {
      role: role.trim(),
      company: company.trim(),
      duration: duration.trim() || 'Ongoing',
      desc: desc.trim(),
      category: category.trim() || 'Work'
    };

    try {
      const endpoint = workToEdit 
        ? `/api/work/${workToEdit.id}` 
        : '/api/work';
      const method = workToEdit ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(workPayload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save experience change');
      }

      onWorkSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during experience save.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="work-manager-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
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
          <h3 id="work-modal-title" className="text-xl font-bold font-sans text-white flex items-center gap-2">
            {workToEdit ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-emerald-400" />}
            {workToEdit ? `Edit Experience` : 'Add Work Experience'}
          </h3>
          <button
            id="close-work-manager-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close work manager modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div id="work-manager-error" className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/20 text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form area */}
        <form onSubmit={handleSave} className="space-y-4 overflow-y-auto flex-1 pr-1">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="w-role">Role Title</label>
            <input
              id="w-role"
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              placeholder="Computer Science Tutor, Software Intern"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="w-company">Company / Institution</label>
              <input
                id="w-company"
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="University of Cape Town"
                value={company}
                onChange={e => setCompany(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="w-category">Category Badge</label>
              <input
                id="w-category"
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="Tutoring, Development, Internship"
                value={category}
                onChange={e => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="w-duration">Duration Label</label>
            <input
              id="w-duration"
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              placeholder="Feb 2025 — Jul 2025"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="w-desc">Role Description & Responsibilities</label>
            <textarea
              id="w-desc"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="Provided academic support, facilitated lab sessions, guided students through debugging complex computer science problems..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              required
            />
          </div>

          {/* Save & Cancel Actions */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-end gap-3 mt-4">
            <button
              id="cancel-work-btn"
              type="button"
              onClick={onClose}
              className="py-1.5 px-4 rounded-lg border border-white/10 text-white/70 hover:text-white text-xs transition"
            >
              Cancel
            </button>
            <button
              id="save-work-btn"
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-semibold py-1.5 px-6 rounded-lg text-xs transition flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? 'Saving...' : 'Save Work'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
