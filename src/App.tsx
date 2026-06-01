import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code, Award, BookOpen, Heart, Mail, Folder, Plus, Edit, Trash2, User,
  LogOut, Settings, Activity as ActivityIcon, ChevronDown, Compass,
  Book, Menu, X, ExternalLink, ShieldCheck, HelpCircle, GraduationCap, Briefcase
} from 'lucide-react';

import { Project, WorkExperience, Activity, AuthState } from './types';
import { THEMES, getShadeGradient, getFontFamilyString } from './utils/themes';
import ProjectManager from './components/ProjectManager';
import WorkManager from './components/WorkManager';
import ActivityManager from './components/ActivityManager';

// Category descriptions matching original JS exactly
const categoryTexts = {
  all: "All projects: a collection of everything I’ve built, from quick experiments to full-scale systems. Explore the range of my work across AI, FinTech, and creative tech.",
  hackathon: "Hackathon projects: rapid, high-energy builds created in 24–72 hours. These prototypes combine innovation, teamwork, and problem-solving under intense time pressure, designed to test what’s possible in a weekend.",
  coursework: "Coursework projects: structured academic builds demonstrating technical mastery, clean design, and deep understanding of computer science principles. Each project reflects problem-solving through theory-driven implementation.",
  side: "Side projects: self-driven explorations born from curiosity. These experiments blend creativity and engineering, from concept prototypes to tools that reflect what I love learning outside the classroom.",
  academic: "Academic helpers: tools and systems designed to enhance learning and teaching. They streamline workflows, visualize concepts, and make computer science more approachable for students and educators alike."
};

const activityCategoryTexts = {
  all: 'Leadership and community engagement are key parts of who I am. Whether mentoring students, volunteering, or captaining sports teams, I strive to uplift others and lead with empathy and purpose.',
  sport: 'Highlights from my experience in team and individual sports.',
  volunteer: 'Efforts to support my community through mentorship and teaching.'
};

export default function App() {
  // Theme & Typography States
  const [currentTheme, setCurrentTheme] = useState('elegant-dark');
  const [currentFont, setCurrentFont] = useState('Inter');

  // Interactive Filter States
  const [projectFilter, setProjectFilter] = useState<'all' | 'hackathon' | 'coursework' | 'side' | 'academic'>('all');
  const [activityFilter, setActivityFilter] = useState<'all' | 'sport' | 'volunteer'>('all');

  // Backend Loaded States
  const [projects, setProjects] = useState<Project[]>([]);
  const [work, setWork] = useState<WorkExperience[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Authentication State - Default to secure unauthenticated state for visitors
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  // UI Modals State
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Work & Activities editor states
  const [isWorkOpen, setIsWorkOpen] = useState(false);
  const [workToEdit, setWorkToEdit] = useState<WorkExperience | null>(null);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);

  // API fetches
  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Projects download failed', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchStaticData = async () => {
    try {
      const workRes = await fetch('/api/work');
      const actRes = await fetch('/api/activities');
      if (workRes.ok) setWork(await workRes.json());
      if (actRes.ok) setActivities(await actRes.json());
    } catch (err) {
      console.error('Static sections preload failed', err);
    }
  };

  const syncSession = async () => {
    const token = localStorage.getItem('portfolio:token');
    const savedUser = localStorage.getItem('portfolio:user');

    if (token && savedUser) {
      try {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setAuthState({
            isAuthenticated: true,
            user: data.user,
            token
          });
        } else {
          // Token is invalid/expired, remove it cleanly
          localStorage.removeItem('portfolio:token');
          localStorage.removeItem('portfolio:user');
        }
      } catch (err) {
        // Fallback to local cache if network lags
        try {
          setAuthState({
            isAuthenticated: true,
            user: JSON.parse(savedUser),
            token
          });
        } catch (_) {}
      }
    }
  };

  useEffect(() => {
    // Initial data pipeline
    fetchProjects();
    fetchStaticData();
    syncSession();

    // Check localStorage for saved theme/font preferences
    const savedTheme = localStorage.getItem('portfolio:theme');
    if (savedTheme) setCurrentTheme(savedTheme);
    const savedFont = localStorage.getItem('portfolio:font');
    if (savedFont) setCurrentFont(savedFont);

    // Keyboard 't' key shortcut listener for cycling theme, and 'Alt + A' for admin gateway
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 't') {
        cycleTheme();
      }
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        // Redirect to discrete private admin gateway
        window.location.href = '/admin/';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update document metadata when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Theme Cycling Handlers
  const cycleTheme = () => {
    const currentIndex = THEMES.findIndex(t => t.id === currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    const nextTheme = THEMES[nextIndex].id;
    setCurrentTheme(nextTheme);
    localStorage.setItem('portfolio:theme', nextTheme);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const themeId = e.target.value;
    setCurrentTheme(themeId);
    localStorage.setItem('portfolio:theme', themeId);
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fontName = e.target.value;
    setCurrentFont(fontName);
    localStorage.setItem('portfolio:font', fontName);
  };



  const handleDeleteProject = async (projId: string) => {
    if (!window.confirm('Delete this project forever from database filesystem?')) return;
    try {
      const response = await fetch(`/api/projects/${projId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authState.token}` }
      });
      if (response.ok) {
        fetchProjects();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Delete failed.');
      }
    } catch {
      alert('Network error deleting project.');
    }
  };

  const handleDeleteWork = async (workId: string) => {
    if (!window.confirm('Delete this work experience entry forever from database filesystem?')) return;
    try {
      const response = await fetch(`/api/work/${workId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authState.token}` }
      });
      if (response.ok) {
        fetchStaticData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Delete failed.');
      }
    } catch {
      alert('Network error deleting work experience.');
    }
  };

  const handleDeleteActivity = async (actId: string) => {
    if (!window.confirm('Delete this activity entry forever from database filesystem?')) return;
    try {
      const response = await fetch(`/api/activities/${actId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authState.token}` }
      });
      if (response.ok) {
        fetchStaticData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Delete failed.');
      }
    } catch {
      alert('Network error deleting activity.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio:token');
    localStorage.removeItem('portfolio:user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
  };

  // Filter lists inside viewport
  const filteredProjects = projects.filter(p => projectFilter === 'all' || p.category === projectFilter);
  const filteredActivities = activities.filter(a => activityFilter === 'all' || a.category === activityFilter);

  // Selected Font stack
  const bodyFontStack = getFontFamilyString(currentFont);

  return (
    <div 
      className="min-h-screen text-gray-100 flex flex-col selection:bg-blue-500/20 selection:text-white"
      style={{ fontFamily: bodyFontStack }}
    >
      {/* Dynamic Theme Glow Background Accents */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-[40%] -left-[20%] w-[80%] h-[70%] rounded-full opacity-10 blur-[130px] transition-all duration-[800s]"
          style={{ background: THEMES.find(t => t.id === currentTheme)?.c1 || '#e30022' }}
        />
        <div 
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[130px] transition-all duration-[800s]"
          style={{ background: THEMES.find(t => t.id === currentTheme)?.c2 || '#002d62' }}
        />
      </div>

      {/* HEADER NAVIGATION SHELL */}
      <nav 
        id="navbar-fixed" 
        className="fixed w-full z-40 top-4 left-0 px-4 transition-all"
        style={{ top: '16px' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="glass px-3 py-2 flex items-center gap-3 rounded-xl border border-white/10">
            <a href="#top" className="flex items-center gap-2" aria-label="Home">
              <div 
                id="logo-swatch" 
                className="w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-white text-md shadow transition duration-546"
                style={{ background: `linear-gradient(135deg, ${THEMES.find(t => t.id === currentTheme)?.c1}, ${THEMES.find(t => t.id === currentTheme)?.c2})` }}
              >
                MS
              </div>
              <span className="text-white font-extrabold text-sm tracking-wider hidden md:inline">Moegamat</span>
            </a>
            {authState.isAuthenticated && authState.user?.role === 'admin' && (
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg text-[10px] font-mono font-bold ml-1 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Active</span>
                <span className="opacity-35">|</span>
                <button 
                  onClick={handleLogout} 
                  title="Sign Out of Admin Mode" 
                  className="hover:text-emerald-200 transition-colors cursor-pointer flex items-center h-full"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="hidden lg:block h-4 w-[1px] bg-white/10" />
            <div className="hidden lg:flex items-center gap-4 text-xs font-semibold px-2">
              <a className="nav-link transition duration-150" href="#work">Work</a>
              <span className="opacity-20 select-none text-white font-light">|</span>
              <a className="nav-link transition duration-150" href="#education">Education & Outreach</a>
              <span className="opacity-20 select-none text-white font-light">|</span>
              <a className="nav-link transition duration-150" href="#projects">Projects</a>
              <span className="opacity-20 select-none text-white font-light">|</span>
              <a className="nav-link transition duration-150" href="#activities">Activities</a>
              <span className="opacity-20 select-none text-white font-light">|</span>
              <a className="nav-link transition duration-150" href="#skills">Skills</a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font selector */}
            <div className="glass px-2 py-1.5 hidden sm:flex items-center gap-2 rounded-xl text-xs border border-white/10">
              <span className="muted font-semibold">Font:</span>
              <select 
                id="font-select" 
                className="bg-transparent outline-none font-bold text-white cursor-pointer"
                value={currentFont}
                onChange={handleFontChange}
                aria-label="Set Site font style"
              >
                <option value="Inter" className="bg-zinc-950 font-sans">Inter</option>
                <option value="Poppins" className="bg-zinc-950 font-sans">Poppins</option>
                <option value="Roboto" className="bg-zinc-950 font-sans">Roboto</option>
                <option value="Source Sans 3" className="bg-zinc-950 font-sans">Source Sans</option>
              </select>
            </div>

            {/* Dynamic theme selector */}
            <div className="glass px-2.5 py-1.5 flex items-center gap-1 rounded-xl text-xs border border-white/10">
              <span className="muted font-semibold hidden sm:inline">Theme:</span>
              <select 
                id="theme-select" 
                className="bg-transparent outline-none font-bold text-white max-w-[130px] text-right sm:text-left truncate cursor-pointer"
                value={currentTheme}
                onChange={handleThemeChange}
                aria-label="Select system UI accent scheme"
              >
                {THEMES.map(t => (
                  <option key={t.id} value={t.id} className="bg-zinc-950 text-white">
                    {t.label}
                  </option>
                ))}
              </select>
              <button 
                id="cycle-theme" 
                onClick={cycleTheme}
                className="ml-1 px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition font-bold tracking-tight text-[10px]"
                title="Cycle through available schemes (Hotkey: 't')"
              >
                Cycle
              </button>
            </div>

            <button 
              id="mobile-menu-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="glass p-2 lg:hidden rounded-xl border border-white/10" 
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-w-7xl mx-auto mt-2 overflow-hidden lg:hidden"
            >
              <div className="glass p-4 rounded-xl flex flex-col gap-2 border border-white/10">
                <a className="nav-link py-2" href="#work" onClick={() => setMobileMenuOpen(false)}>Work</a>
                <a className="nav-link py-2" href="#education" onClick={() => setMobileMenuOpen(false)}>Education & Outreach</a>
                <a className="nav-link py-2" href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
                <a className="nav-link py-2" href="#activities" onClick={() => setMobileMenuOpen(false)}>Activities</a>
                <a className="nav-link py-2" href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* PRIMARY VIEWS CONTAINER */}
      <main id="top" className="max-w-7xl mx-auto px-4 pt-32 pb-16 flex-1 w-full">
        {/* HERO HEADER */}
        <header className="flex flex-col lg:flex-row items-start lg:items-center gap-8 justify-between mt-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest font-extrabold text-blue-400 bg-[#1a1a1a] border border-[#ffffff08] px-3 py-1 rounded-full">
              Moshal Scholar & CSE Student
            </span>
            <h1 className="text-4xl sm:text-6xl font-black leading-tight mt-3 tracking-tight text-white hover:scale-[1.01] transition-transform duration-300">
              Moegamat Samsodien
            </h1>
            <p className="mt-2 text-lg sm:text-xl font-medium text-white/70">
              Full-Stack & AI Developer • Computer Science Tutor • Hackathon Contributor
            </p>
            <div className="mt-6 flex flex-wrap gap-2 items-center">
              <a href="#projects" className="px-4 py-2 rounded-lg text-sm font-semibold transition hover:opacity-90 flex items-center gap-1"
                 style={{ background: `linear-gradient(135deg, ${THEMES.find(t => t.id === currentTheme)?.c1}, ${THEMES.find(t => t.id === currentTheme)?.c2})` }}>
                <Folder className="w-4 h-4" /> View Projects
              </a>
              <a href="#work" className="px-4 py-2 rounded-lg text-sm font-semibold glass border border-white/5 hover:bg-white/10 transition flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-white/80" /> Experience
              </a>
              <a href="mailto:rashaadsm2004@gmail.com" className="px-4 py-2 rounded-lg text-sm font-semibold glass border border-white/5 hover:bg-white/10 transition flex items-center gap-1">
                <Mail className="w-4 h-4 text-white/80" /> Email
              </a>
              <a href="https://github.com/Plum165" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-sm font-semibold glass border border-white/5 hover:bg-white/10 transition flex items-center gap-1">
                <Code className="w-4 h-4 text-white/80" /> GitHub
              </a>
              <a href="https://linkedin.com/in/moegamatsamsodien" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-sm font-semibold glass border border-white/5 hover:bg-white/10 transition flex items-center gap-1">
                <ExternalLink className="w-4 h-4 text-white/80" /> LinkedIn
              </a>
            </div>
            
            <p className="mt-6 text-sm text-white/75 leading-relaxed max-w-2xl bg-white/5 border border-white/5 p-4 rounded-xl backdrop-blur-md">
              I’m a Computer Science student and Moshal Scholar at the University of Cape Town (UCT), passionate about building impactful, human-centered technology. I enjoy architecting scalable systems, crafting intuitive interfaces, and solving real-world challenges through AI, fintech, and full-stack development.
            </p>
          </div>

          {/* Quick contact panel */}
          <aside className="glass p-5 rounded-2xl w-full lg:w-80 border border-white/10 flex flex-col gap-3 relative overflow-hidden backdrop-blur-xl">
            <h3 className="text-xs uppercase tracking-widest font-black text-blue-400">Primary Contact</h3>
            <div className="text-sm space-y-2.5">
              <div>
                <span className="block text-xs text-white/50">Email Address</span>
                <a className="underline text-blue-400 font-medium break-all" href="mailto:rashaadsm2004@gmail.com">rashaadsm2004@gmail.com</a>
              </div>
              <div>
                <span className="block text-xs text-white/50">GitHub profile</span>
                <a className="underline text-blue-400 font-medium" href="https://github.com/Plum165" target="_blank" rel="noopener noreferrer">github.com/Plum165</a>
              </div>
              <div>
                <span className="block text-xs text-white/50">LinkedIn Networking</span>
                <a className="underline text-blue-400 font-medium" href="https://linkedin.com/in/moegamatsamsodien" target="_blank" rel="noopener noreferrer">moegamatsamsodien</a>
              </div>
              <div className="pt-2 border-t border-white/5 text-[11px] text-white/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                <span>Verified Studio Portfolio</span>
              </div>
            </div>
          </aside>
        </header>

        {/* WORK EXPERIENCE */}
        <section id="work" className="mt-16 container-section">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-white/10 pb-2 mb-4">
            <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              Work Experience
            </h2>
            {authState.isAuthenticated && authState.user?.role === 'admin' && (
              <button
                id="create-work-inline"
                onClick={() => { setWorkToEdit(null); setIsWorkOpen(true); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-2.5 rounded-lg text-[11px] transition flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-950/20 hover:scale-[1.02]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Experience
              </button>
            )}
          </div>
          <p className="text-sm muted mb-6 max-w-2xl">
            Teaching has been central to my growth; tutoring computer science has deepened both my technical understanding and my ability to communicate ideas clearly. I value mentorship as much as problem-solving.
          </p>

          <div id="work-grid" className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {work.map((experience) => (
              <article key={experience.id} className="info-card glass p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between border border-white/5 hover:-translate-y-1 transition duration-300">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-blue-400 font-mono tracking-tight">{experience.duration}</span>
                    <div className="flex items-center gap-2">
                      <span className="badge">{experience.category}</span>
                      {authState.isAuthenticated && authState.user?.role === 'admin' && (
                        <div className="flex gap-1">
                          <button
                            id={`edit-wrk-${experience.id}`}
                            onClick={() => { setWorkToEdit(experience); setIsWorkOpen(true); }}
                            className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 transition"
                            title="Edit experience"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            id={`delete-wrk-${experience.id}`}
                            onClick={() => handleDeleteWork(experience.id)}
                            className="p-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 transition"
                            title="Delete experience"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-white mt-1.5 leading-tight">{experience.role}</h3>
                  <div className="text-sm text-blue-200/70 mt-1">{experience.company}</div>
                </div>
                <p className="mt-3 text-sm text-white/80 leading-relaxed font-sans">
                  {experience.desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* EDUCATION & FOUNDATIONS */}
        <section id="education" className="mt-20 container-section">
          <h2 className="text-2xl font-bold font-sans text-white border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-500" />
            Education & Foundational Programs
          </h2>
          <p className="text-sm muted mb-6 max-w-2xl">
            My studies at UCT have shaped a strong foundation in computing, while programs like Moshal and 100UP have strengthened my professional and personal development beyond the classroom.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* College Card */}
            <article className="info-card glass p-5 rounded-2xl border border-white/5 relative flex flex-col justify-between hover:-translate-y-1 transition duration-300">
              <div>
                <div className="text-xs text-blue-400 font-mono">2023 - Present</div>
                <h3 className="font-bold text-lg text-white mt-1">University of Cape Town (UCT)</h3>
                <div className="text-xs muted font-sans">Bachelor of Science, Computer Science</div>
                <p className="mt-3 text-sm text-white/80 leading-relaxed font-sans">
                  Focusing on core principles of computing, database organization and network engineering. My coursework provides a strong foundation in system design, algorithms, and data-driven problem-solving.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5">
                <strong className="text-xs text-blue-400 uppercase tracking-widest font-bold">Key Coursework</strong>
                <ul className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1.5 text-xs text-white/70">
                  <li>• Operating Systems</li>
                  <li>• Networks & Sockets</li>
                  <li>• DB & Parallel Comp</li>
                  <li>• Data Struct & Algos</li>
                </ul>
              </div>
            </article>

            {/* Moshal Card */}
            <article className="info-card glass p-5 rounded-2xl border border-white/5 relative flex flex-col justify-between hover:-translate-y-1 transition duration-300">
              <div>
                <div className="text-xs text-blue-400 font-mono">Scholar Training</div>
                <h3 className="font-bold text-lg text-white mt-1">The Moshal Program Scholar</h3>
                <div className="text-xs muted font-sans">Career & Professional Development</div>
                <p className="mt-3 text-sm text-white/80 leading-relaxed font-sans">
                  Selected for a comprehensive scholarship program that extends beyond financial aid to build career-readiness. This program has been instrumental in my professional growth.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5">
                <strong className="text-xs text-blue-400 uppercase tracking-widest font-bold font-sans">Key Training Areas</strong>
                <ul className="grid grid-cols-1 gap-1 mt-1.5 text-xs text-white/70">
                  <li>• Professional career masterclasses</li>
                  <li>• Advanced coding bootcamps</li>
                  <li>• Soft skills & communication mentoring</li>
                </ul>
              </div>
            </article>

            {/* Spine Road High Card */}
            <article className="info-card glass p-5 rounded-2xl border border-white/5 relative flex flex-col justify-between hover:-translate-y-1 transition duration-300">
              <div>
                <div className="text-xs text-blue-400 font-mono">2018 - 2022</div>
                <h3 className="font-bold text-lg text-white mt-1">Spine Road High School</h3>
                <div className="text-xs muted">National Senior Certificate (76.57% GPA)</div>
                <p className="mt-2 text-sm text-white/85 leading-relaxed font-sans">
                  Graduated with a strong academic foundation, excelling in Mathematics, IT, and Natural Sciences. My passion for technology began here, where I actively contributed to establishing the school's first robotics lab and participated in the chess club.
                </p>
              </div>
            </article>

            {/* 100UP Card */}
            <article className="info-card glass p-5 rounded-2xl border border-white/5 relative flex flex-col justify-between hover:-translate-y-1 transition duration-300">
              <div>
                <div className="text-xs text-blue-400 font-mono">Jun - Nov 2022</div>
                <h3 className="font-bold text-lg text-white mt-1">100UP Gill Net Program</h3>
                <div className="text-xs muted">University of Cape Town</div>
                <p className="mt-2 text-sm text-white/85 leading-relaxed font-sans">
                  Selected for UCT's high-potential learner program designed to bridge the gap between high school and university. This initiative provided targeted academic support, mentorship, and resources that were crucial for strengthening my Matric results and securing university admission.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="mt-20 container-sectionScroll">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-500" />
                Dynamic Systems & Built Projects
              </h2>
              {authState.isAuthenticated && authState.user?.role === 'admin' && (
                <button
                  id="create-project-inline"
                  onClick={() => { setProjectToEdit(null); setIsManagerOpen(true); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-2.5 rounded-lg text-[11px] transition flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-950/20 hover:scale-[1.02]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Project
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'hackathon', 'coursework', 'side', 'academic'] as const).map((filter) => (
                <button
                  key={filter}
                  id={`filter-btn-${filter}`}
                  onClick={() => setProjectFilter(filter)}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition cursor-pointer select-none ${
                    projectFilter === filter 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-950/30 ring-2 ring-blue-500/30' 
                      : 'bg-white/5 border border-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {filter === 'all' ? 'All Projects' : filter === 'side' ? 'Side Projects' : filter === 'academic' ? 'Academic Helpers' : filter}
                </button>
              ))}
            </div>
          </div>

          <div id="category-desc" className="text-sm muted leading-relaxed mb-6 bg-white/5 p-3 rounded-xl border border-white/5">
            {categoryTexts[projectFilter]}
          </div>

          {/* Grid list of projects */}
          {loadingProjects ? (
            <div id="projects-loader" className="text-center py-12 text-sm text-white/50">
              Loading dynamic project database records...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div id="projects-empty" className="text-center py-16 text-sm text-white/40 border border-dashed border-white/10 rounded-2xl">
              No projects added in this category yet. {authState.user?.role === 'admin' && 'Use the top admin ribbon to add one!'}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => {
                  const gradientStr = getShadeGradient(currentTheme, project.shade || project.category);
                  return (
                    <motion.article
                      key={project.id}
                      id={`project-card-${project.id}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className={`project-card glass p-5 rounded-2xl relative flex flex-col justify-between overflow-hidden group min-h-[300px] ${
                        currentTheme === 'elegant-dark'
                          ? `border-l-2 ${project.category === 'hackathon' ? 'border-l-blue-600' : 'border-l-white/10'} border-t-[#ffffff08] border-r-[#ffffff08] border-b-[#ffffff08]`
                          : 'border border-white/10'
                      }`}
                      style={{ background: gradientStr }}
                    >
                      {/* Badge and date metadata header */}
                      <div className="flex items-center justify-between gap-2 mb-3 z-10">
                        <span className="badge text-[10px]">{project.badge}</span>
                        <span className="text-[11px] text-white/60 font-mono">{project.date}</span>
                      </div>

                      {/* Info body */}
                      <div className="flex-1 z-10">
                        <h3 className="text-xl font-bold text-white tracking-tight leading-snug group-hover:text-amber-100 transition duration-200">
                          {project.title}
                        </h3>
                        <p className="mt-2.5 text-xs text-white/80 leading-relaxed font-sans line-clamp-4">
                          {project.desc}
                        </p>

                        {/* Tag list */}
                        <div className="mt-4 flex flex-wrap gap-1">
                          {project.tags.map((tag, idx) => (
                            <span key={idx} className="pill text-[10px] bg-black/15 text-white/90">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Co-contributors metadata block */}
                        {project.contributors && project.contributors.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-white/60">
                            <strong>Contributors:</strong>{' '}
                            {project.contributors.map((contrib, cIdx) => (
                              <React.Fragment key={cIdx}>
                                {contrib.link && contrib.link !== '#' ? (
                                  <a href={contrib.link} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition">
                                    {contrib.name}
                                  </a>
                                ) : (
                                  <span>{contrib.name}</span>
                                )}
                                {cIdx < (project.contributors?.length || 0) - 1 && ', '}
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Project action links and optional admin settings */}
                      <div className="mt-5 flex items-center justify-between gap-2 z-10">
                        <div className="flex gap-1.5">
                          {project.links?.map((link, lIdx) => (
                            <a
                              key={lIdx}
                              href={link.url}
                              target="_blank"
                              aria-label={`Open link for ${project.title}`}
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded bg-black/30 hover:bg-black/50 text-[11px] font-bold text-white flex items-center gap-1 transition"
                            >
                              {link.label}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>

                        {/* Admin editing hooks visible to authorized accounts */}
                        {authState.isAuthenticated && authState.user?.role === 'admin' && (
                          <div className="flex gap-1">
                            <button
                              id={`edit-proj-${project.id}`}
                              onClick={() => { setProjectToEdit(project); setIsManagerOpen(true); }}
                              className="p-1.5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 transition duration-546"
                              title="Edit database project"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`delete-proj-${project.id}`}
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 transition duration-546"
                              title="Delete database project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* ACTIVITIES & LEADERSHIP */}
        <section id="activities" className="mt-20 container-section">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
                <ActivityIcon className="w-5 h-5 text-blue-500" />
                Activities & Leadership
              </h2>
              {authState.isAuthenticated && authState.user?.role === 'admin' && (
                <button
                  id="create-activity-inline"
                  onClick={() => { setActivityToEdit(null); setIsActivityOpen(true); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-2.5 rounded-lg text-[11px] transition flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-950/20 hover:scale-[1.02]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Activity
                </button>
              )}
            </div>

            <div className="flex gap-1.5">
              {(['all', 'sport', 'volunteer'] as const).map((filter) => (
                <button
                  key={filter}
                  id={`activity-filter-${filter}`}
                  onClick={() => setActivityFilter(filter)}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition cursor-pointer ${
                    activityFilter === filter 
                      ? 'bg-blue-600 text-white shadow shadow-blue-950/35 ring-2 ring-blue-500/30' 
                      : 'bg-white/5 border border-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {filter === 'all' ? 'All Activities' : filter === 'sport' ? 'Sports' : 'Volunteering'}
                </button>
              ))}
            </div>
          </div>

          <div id="activity-desc" className="text-sm muted leading-relaxed mb-6 bg-white/5 p-3 rounded-xl border border-white/5">
            {activityCategoryTexts[activityFilter]}
          </div>

          <div id="activities-grid" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredActivities.map((act) => (
              <article key={act.id} className="info-card glass p-5 rounded-2xl border border-white/5 hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-blue-400 font-mono tracking-wider">{act.date}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="badge text-[10px]">{act.badge}</span>
                      {authState.isAuthenticated && authState.user?.role === 'admin' && (
                        <div className="flex gap-1">
                          <button
                            id={`edit-act-${act.id}`}
                            onClick={() => { setActivityToEdit(act); setIsActivityOpen(true); }}
                            className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 transition"
                            title="Edit activity"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            id={`delete-act-${act.id}`}
                            onClick={() => handleDeleteActivity(act.id)}
                            className="p-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 transition"
                            title="Delete activity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-white mt-2 leading-tight">{act.title}</h3>
                </div>
                <p className="mt-3 text-xs text-white/80 leading-relaxed font-sans">{act.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* SKILLS & STRENGTHS */}
        <section id="skills" className="mt-20 container-section">
          <h2 className="text-2xl font-bold font-sans text-white border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Skills & Strengths
          </h2>

          <div className="info-card glass p-6 rounded-2xl border border-white/10 relative">
            <div>
              <h3 className="font-bold text-lg text-white mb-4">Technical Proficiency Matrix</h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-blue-500 mb-2 font-mono">Languages</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="pill bg-white/5">Python</span>
                    <span className="pill bg-white/5">Java</span>
                    <span className="pill bg-white/5">JavaScript</span>
                    <span className="pill bg-white/5">SQL</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-blue-500 mb-2 font-mono">Frameworks</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="pill bg-white/5">React</span>
                    <span className="pill bg-white/5">Node.js</span>
                    <span className="pill bg-white/5">Express</span>
                    <span className="pill bg-white/5">LightGBM</span>
                    <span className="pill bg-white/5">Pandas</span>
                    <span className="pill bg-white/5">Open3D</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-blue-500 mb-2 font-mono">Infrastructure</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="pill bg-white/5">MySQL</span>
                    <span className="pill bg-white/5">Postgres</span>
                    <span className="pill bg-white/5">Docker</span>
                    <span className="pill bg-white/5">Git & GitHub</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-blue-500 mb-2 font-mono">APIs & Protocols</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="pill bg-white/5">Interledger</span>
                    <span className="pill bg-white/5">USSD Codecs</span>
                    <span className="pill bg-white/5">MathJax Engine</span>
                    <span className="pill bg-white/5">TCP Sockets</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/5 grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-bold text-white mb-2 font-sans flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Key Strengths
                </h4>
                <ul className="text-xs text-white/70 space-y-1.5 ml-3 list-disc">
                  <li>Full-Stack Server & DB System Design</li>
                  <li>Agile Prototyping inside Hackathons</li>
                  <li>Algorithmic Problem-Solving & Analysis</li>
                  <li>Leadership & Academic CS Mentorship</li>
                  <li>Sleek visual layouts & Interface Polish</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2 font-sans flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Design & Platform Tools
                </h4>
                <ul className="text-xs text-white/70 space-y-1.5 ml-3 list-disc">
                  <li>Figma (High-fidelity visual blueprinting)</li>
                  <li>Chart.js / Data Visualization panels</li>
                  <li>Technical Writing (Detailed academic notes)</li>
                  <li>Adobe Express ecosystems</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2 font-sans flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Primary Interests
                </h4>
                <ul className="text-xs text-white/70 space-y-1.5 ml-3 list-disc">
                  <li>FinTech structures for social good</li>
                  <li>AI deployment in Heathcare & Access</li>
                  <li>Offensive Cybersecurity and CTF solutions</li>
                  <li>Open Source peer collaboration</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER METADATA */}
        <footer className="mt-20 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          <p className="font-sans">
            © {new Date().getFullYear()} Moegamat Samsodien — UCT CS Scholar.
          </p>
          <div className="flex justify-center gap-3 mt-1.5">
            <a href="https://github.com/Plum165" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition">GitHub Profile</a>
            <span>•</span>
            <a href="https://linkedin.com/in/moegamatsamsodien" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition">LinkedIn</a>
          </div>
        </footer>
      </main>

      {/* SYSTEM SCREEN FLOATING WINDOW MODALS */}

      <AnimatePresence>
        {isManagerOpen && (
          <ProjectManager
            authState={authState}
            projectToEdit={projectToEdit}
            onClose={() => { setIsManagerOpen(false); setProjectToEdit(null); }}
            onProjectSaved={() => { fetchProjects(); }}
          />
        )}
        {isWorkOpen && (
          <WorkManager
            authState={authState}
            workToEdit={workToEdit}
            onClose={() => { setIsWorkOpen(false); setWorkToEdit(null); }}
            onWorkSaved={() => { fetchStaticData(); }}
          />
        )}
        {isActivityOpen && (
          <ActivityManager
            authState={authState}
            activityToEdit={activityToEdit}
            onClose={() => { setIsActivityOpen(false); setActivityToEdit(null); }}
            onActivitySaved={() => { fetchStaticData(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
