import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Plus, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import { Project, AuthState } from '../types';

interface ProjectManagerProps {
  authState: AuthState;
  projectToEdit?: Project | null;
  onClose: () => void;
  onProjectSaved: () => void;
}

export default function ProjectManager({ authState, projectToEdit, onClose, onProjectSaved }: ProjectManagerProps) {
  const [title, setTitle] = useState(projectToEdit?.title || '');
  const [category, setCategory] = useState<'hackathon' | 'coursework' | 'side' | 'academic'>(projectToEdit?.category || 'side');
  const [date, setDate] = useState(projectToEdit?.date || '');
  const [badge, setBadge] = useState(projectToEdit?.badge || '');
  const [desc, setDesc] = useState(projectToEdit?.desc || '');
  
  // Custom parsing for inputs since multiple arrays can be complex
  const [tagsInput, setTagsInput] = useState(projectToEdit?.tags.join(', ') || '');
  
  const [contribName1, setContribName1] = useState(projectToEdit?.contributors?.[0]?.name || '');
  const [contribLink1, setContribLink1] = useState(projectToEdit?.contributors?.[0]?.link || '');
  const [contribName2, setContribName2] = useState(projectToEdit?.contributors?.[1]?.name || '');
  const [contribLink2, setContribLink2] = useState(projectToEdit?.contributors?.[1]?.link || '');

  const [linkTitle1, setLinkTitle1] = useState(projectToEdit?.links?.[0]?.label || '');
  const [linkUrl1, setLinkUrl1] = useState(projectToEdit?.links?.[0]?.url || '');
  const [linkTitle2, setLinkTitle2] = useState(projectToEdit?.links?.[1]?.label || '');
  const [linkUrl2, setLinkUrl2] = useState(projectToEdit?.links?.[1]?.url || '');

  const [shade, setShade] = useState<'hackathon' | 'academic' | 'coursework' | 'side' | 'default'>(
    (projectToEdit?.shade as any) || 'default'
  );

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

    // Construct contributors array
    const contributors = [];
    if (contribName1.trim()) contributors.push({ name: contribName1.trim(), link: contribLink1.trim() || '#' });
    if (contribName2.trim()) contributors.push({ name: contribName2.trim(), link: contribLink2.trim() || '#' });

    // Construct links array
    const links = [];
    if (linkTitle1.trim() && linkUrl1.trim()) links.push({ label: linkTitle1.trim(), url: linkUrl1.trim() });
    if (linkTitle2.trim() && linkUrl2.trim()) links.push({ label: linkTitle2.trim(), url: linkUrl2.trim() });

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const projectPayload = {
      title,
      category,
      date: date || 'Ongoing',
      badge: badge || 'Project',
      desc,
      tags,
      contributors,
      links,
      shade: shade === 'default' ? category : shade // match category theme if default
    };

    try {
      const endpoint = projectToEdit 
        ? `/api/projects/${projectToEdit.id}` 
        : '/api/projects';
      const method = projectToEdit ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(projectPayload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save project change');
      }

      onProjectSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during project save.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="project-manager-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Background black overlap click-guard */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <h3 id="mgr-modal-title" className="text-xl font-bold font-sans text-white flex items-center gap-2">
            {projectToEdit ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-emerald-400" />}
            {projectToEdit ? `Edit Project: ${projectToEdit.title}` : 'Add New Portfolio Project'}
          </h3>
          <button
            id="close-manager-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close project manager modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div id="manager-error" className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/20 text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Scrollable form area */}
        <form onSubmit={handleSave} className="space-y-4 overflow-y-auto flex-1 pr-1">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="p-title">Project Title</label>
              <input
                id="p-title"
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="Enterprise FinTech App"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="p-category">Category</label>
              <select
                id="p-category"
                className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                required
              >
                <option value="hackathon">Hackathon</option>
                <option value="coursework">Coursework</option>
                <option value="side">Side Project</option>
                <option value="academic">Academic Helper</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="p-date">Duration/Date</label>
              <input
                id="p-date"
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none"
                placeholder="Jun - Oct 2025"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="p-badge">Status / Badge Label</label>
              <input
                id="p-badge"
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white"
                placeholder="🏆 2nd Place, Capstone Project"
                value={badge}
                onChange={e => setBadge(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="p-shade">Shading Theme Group</label>
              <select
                id="p-shade"
                className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-sm text-white"
                value={shade}
                onChange={e => setShade(e.target.value as any)}
              >
                <option value="default">Use Category Color</option>
                <option value="hackathon">Hackathon (Pink/Orange Glow)</option>
                <option value="academic">Academic (Muted Cyan/Gray)</option>
                <option value="coursework">Coursework (Ocean/Slate Teal)</option>
                <option value="side">Side Project (Vibrant Lavender)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="p-desc">Executive Summary / Description</label>
            <textarea
              id="p-desc"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="Provide a comprehensive summary of the system design and functional outcome..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1" htmlFor="p-tags">Tags (Comma-separated list)</label>
            <input
              id="p-tags"
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white"
              placeholder="React, Express, Node.js, SQLite, Cryptography"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
            />
          </div>

          <div className="border-t border-white/10 pt-3">
            <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Contributors (Optional)</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white"
                  placeholder="Contributor #1 Name"
                  value={contribName1}
                  onChange={e => setContribName1(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white"
                  placeholder="Contributor #1 LinkedIn/GitHub Link"
                  value={contribLink1}
                  onChange={e => setContribLink1(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white"
                  placeholder="Contributor #2 Name"
                  value={contribName2}
                  onChange={e => setContribName2(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white"
                  placeholder="Contributor #2 LinkedIn/GitHub Link"
                  value={contribLink2}
                  onChange={e => setContribLink2(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-3">
            <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">External Links (Optional)</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white"
                  placeholder="Link #1 Label (e.g. Source, Live Demo)"
                  value={linkTitle1}
                  onChange={e => setLinkTitle1(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white"
                  placeholder="Link #1 Destination URL"
                  value={linkUrl1}
                  onChange={e => setLinkUrl1(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white"
                  placeholder="Link #2 Label (e.g. Website, Presentation)"
                  value={linkTitle2}
                  onChange={e => setLinkTitle2(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white"
                  placeholder="Link #2 Destination URL"
                  value={linkUrl2}
                  onChange={e => setLinkUrl2(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Form save section */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-end gap-3 mt-4">
            <button
              id="cancel-mgr-btn"
              type="button"
              onClick={onClose}
              className="py-1.5 px-4 rounded-lg border border-white/10 text-white/70 hover:text-white text-xs transition"
            >
              Cancel
            </button>
            <button
              id="save-mgr-btn"
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-semibold py-1.5 px-6 rounded-lg text-xs transition flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
