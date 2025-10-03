document.addEventListener('DOMContentLoaded', () => {
  /***********************************************
   * Portfolio JS: theme, font, project loader,
   * category filters, and dynamic card shading.
   ***********************************************/

  // ----------------- Utilities -----------------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ----------------- Themes -----------------
  const THEMES = [
    { id: 'spiderman', label: 'Spiderman (Default)' },
    { id: 'blood', label: 'Blood' },
    { id: 'sapphire', label: 'Sapphire & Steel' },
    { id: 'emerald', label: 'Emerald & Charcoal' },
    { id: 'digital-twilight', label: 'Digital Twilight' },
    { id: 'coral-aqua', label: 'Coral & Aqua' },
    { id: 'electric-citrus', label: 'Electric Citrus' },
    { id: 'artisan-clay', label: 'Artisan Clay' },
    { id: 'forest-canopy', label: 'Forest Canopy' },
    { id: 'ocean-depth', label: 'Ocean Depth' },
    { id: 'desert-sunset', label: 'Desert Sunset' },
    { id: 'monochrome-focus', label: 'Monochrome Focus' },
    { id: 'soft-nordic', label: 'Soft Nordic' },
    { id: 'neutral-peach', label: 'Neutral Peach' },
    { id: 'retro-pop', label: 'Retro Pop' },
    { id: 'cyberpunk-glow', label: 'Cyberpunk Glow' },
    { id: 'plum-gold', label: 'Plum & Gold' },
    { id: 'purple-black-matter', label: 'Purple Black Matter' },
    { id: 'black-hole', label: 'Black Hole' },
    { id: 'red-blue', label: 'Red & Blue' },
    { id: 'pink-black', label: 'Pink & Black' },
    { id: 'pink-purple', label: 'Pink & Purple' },
    { id: 'rose-gold', label: 'Rose Gold' },
    { id: 'neon-pink', label: 'Neon Pink' },
    { id: 'blush-cherry', label: 'Blush Cherry' },
    { id: 'bubblegum', label: 'Bubblegum' },
    { id: 'flamingo', label: 'Flamingo' },
    { id: 'pink-yellow', label: 'Pink & Yellow' },
    { id: 'pink-white', label: 'Pink & White' },
    { id: 'pink-overall', label: 'Pink Overall' },
    { id: 'black-noir', label: 'Black Noir' },
    { id: 'ladybug-noir', label: 'Ladybug Noir' },
    // --- NEW CHARACTER & YELLOW THEMES ---
    { id: 'prideful-sun', label: 'Prideful Sun' },
    { id: 'kakarot-orange', label: 'Kakarot Orange' },
    { id: 'saiyan-prince', label: 'Saiyan Prince' },
    { id: 'omni-green', label: 'Omni Green' },
    { id: 'goldenrod', label: 'Goldenrod' },
    { id: 'bumblebee', label: 'Bumblebee' },
    { id: 'lemonade', label: 'Lemonade' }
  ];

  const themeSelect = $('#theme-select');
  THEMES.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.label;
    themeSelect.appendChild(opt);
  });

  function applyTheme(id) {
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem('portfolio:theme', id);
    renderAllCardsShadeVariants();
    themeSelect.value = id;
  }

  themeSelect.addEventListener('change', e => applyTheme(e.target.value));
  $('#cycle-theme').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const i = THEMES.findIndex(t => t.id === current);
    const next = THEMES[(i + 1) % THEMES.length].id;
    applyTheme(next);
  });

  // ----------------- Font selector -----------------
  const fontSelect = $('#font-select');
  const fontPreview = $('#font-preview');

  function applyFont(name) {
    const map = {
      "Inter": "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      "Poppins": "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      "Roboto": "'Roboto', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      "Source Sans 3": "'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto"
    };
    document.body.style.fontFamily = map[name] || map["Inter"];
    fontPreview.textContent = name;
    localStorage.setItem('portfolio:font', name);
  }

  fontSelect.addEventListener('change', e => applyFont(e.target.value));

  // ----------------- Mobile Menu -----------------
  $('#mobile-menu-btn').addEventListener('click', () => {
    $('#mobile-menu').classList.toggle('hidden');
  });

  // ----------------- Project CMS JSON -----------------
// ----------------- Project CMS JSON -----------------
const projects = [
  { id: "uav-visualizer", title: "UAV Flight Path Visualization & Analysis System", category: "coursework", date: "Aug - Oct 2025", badge: "Capstone Project", desc: "A 3D interactive tool to visualize, compare, and analyze drone flight paths over complex terrains. Features 3D mesh rendering, waypoint integration, and camera view playback.", tags: ["Python", "Open3D", "pyrender", "trimesh", "PyQt"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }, { name: "Aneesah Barnes", link: "https://www.linkedin.com/in/aneesah-barnes-724143237" }, { name: "Marcus Buxmann", link: "https://www.linkedin.com/in/marcus-buxmann-a63690258/" }], links: [{ label: "Source", url: "https://github.com/Plum165/Capstone" }], shade: "coursework" },
  { id: "finance-formulae", title: "Managerial Finance (FTX1005F) Calculator", category: "academic", date: "Sept - Oct 2025", badge: "Finance • Tool", desc: "A web-based, interactive reference for key financial formulas, ratios, and valuation methods. Features MathJax rendering and a print-to-PDF function.", tags: ["HTML", "Tailwind CSS", "JavaScript", "MathJax"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }], links: [{ label: "Live Demo", url: "https://plum165.github.io/FTX-Calculator/" }, { label: "Source", url: "https://github.com/Plum165/FTX-Calculator" }], shade: "academic" },
  { id: "sta1000", title: "STA1000 — Interactive Calculator & Practice", category: "academic", date: "June - Oct 2025", badge: "Academic", desc: "A guided statistics practice platform with step-by-step solutions, practice tests, and MathJax-rendered equations.", tags: ["HTML", "JavaScript", "MathJax"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }], links: [{ label: "Live Demo", url: "https://plum165.github.io/Stats-Calculator/index.html" }, { label: "Source", url: "https://github.com/Plum165/Stats-Calculator" }], shade: "academic" },
  { id: "budgetwise", title: "BudgetWise – Gamified Budgeting Web App", category: "hackathon", date: "13 - 14 Sep 2025", badge: "Fintech Game", desc: "A gamified budgeting app to make personal finance interactive. Features budget tracking, spending summaries, and rewards for hitting milestones.", tags: ["JavaScript", "HTML", "CSS", "JSON", "Gamification"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }, { name: "Misha Dick", link: "#" }, { name: "Entisaar Elfadl", link: "#" }], links: [{ label: "Live Demo", url: "https://plum165.github.io/SA_Intervarsity_Hackathon_CryptoKnights/" }, { label: "Source", url: "https://github.com/Plum165/SA_Intervarsity_Hackathon_CryptoKnights" }], shade: "hackathon" },
  { id: "hack-the-system", title: "Hack the System: Budgeting & Investment Game", category: "hackathon", date: "13 Sep 2025", badge: "FinTech Game", desc: "A gamified platform where users simulate personal and business budgets, earning points to unlock themes and rewards.", tags: ["JavaScript", "HTML", "CSS", "LocalStorage", "Gamification"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }], links: [{ label: "Live Demo", url: "https://plum165.github.io/Budget/" }, { label: "Source", url: "https://github.com/Plum165/Budget" }], shade: "hackathon" },
  { id: "kaspersky-ctf", title: "Kaspersky{CTF} Cybersecurity Challenge", category: "side", date: "30 - 31 Aug 2025", badge: "Cybersecurity", desc: "Participated in the international Kaspersky{CTF} competition, solving challenges in cryptography, web exploitation, and reverse engineering.", tags: ["Python", "SageMath", "Docker", "Cryptography", "Web Security"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }], links: [{ label: "Learn More", url: "https://ctf.kaspersky.com/" }], shade: "side" },
  { id: "task-network", title: "Task Network Input Tool", category: "side", date: "4 Aug 2025", badge: "Visualization", desc: "Web app for Activity-on-Node diagrams with curved arrows, dark mode, and SVG export.", tags: ["HTML", "CSS", "JavaScript", "SVG"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }], links: [{ label: "Source", url: "https://github.com/Plum165/Task-Network-Tool" }, { label: "Live Demo", url: "https://plum165.github.io/Network_Analysis/" }], shade: "side" },
  { id: "megazoo-planner", title: "MegaZoo Hackathon – Grid-Based Zoo Planner", category: "hackathon", date: "2 Aug 2025", badge: "Algorithm", desc: "A 2D zoo layout planner that uses an algorithm to position animals and shops on a grid, optimizing for spacing, cost, and visitor interest.", tags: ["Python", "JSON", "2D Grid Algorithms"], contributors: [{ name: "Entisaar Elfadl", link: "https://www.linkedin.com/in/entisaar-elfadl-400744351/" }, { name: "Misha Jacobs", link: "#" }], links: [{ label: "Source", url: "https://github.com/Plum165/mega-zoo-planner" }], shade: "hackathon" },
  { id: "triage-ai", title: "Triage AI — Patient Triage System", category: "side", date: "Jun 15 – Aug 1, 2025", badge: "AI • Healthcare", desc: "AI-powered triage chatbot that assigns urgency levels and surfaces cases to a doctor dashboard, with PDF export of summaries.", tags: ["Groq API", "React", "Node.js"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }, { name: "Contributor B", link: "https://linkedin.com/in/contributor-b" }], links: [{ label: "Source", url: "https://github.com/Plum165/triage-ai-web" }], shade: "side" },
  { id: "web-usage-tracker", title: "Web Usage Time Tracker", category: "hackathon", date: "15 – 27 July 2025", badge: "Productivity", desc: "A tool to track time spent on websites. Features a live timer, session logging, and interactive charts to visualize browsing patterns.", tags: ["HTML", "CSS", "JavaScript", "Chart.js"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }], links: [{ label: "Live Demo", url: "https://plum165.github.io/Web-Page-Tracker" }, { label: "Source", url: "https://github.com/Plum165/Web-Page-Tracker" }], shade: "hackathon" },
  { id: "word-wise", title: "Word Wise — Adobe Express Addon", category: "hackathon", date: "May 19 – Jul 21, 2025", badge: "Accessibility", desc: "Add-on for simplifying English text for learners and content creators, with translation support.", tags: ["JavaScript", "Add-on", "Accessibility"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }, { name: "Contributor C", link: "https://linkedin.com/in/contributor-c" }], links: [{ label: "Presentation", url: "https://uctcloud-my.sharepoint.com/:p:/g/personal/smsmoe006_myuct_ac_za/EaZxMVCy0NpApOYo3hyo4SkB9eMuzQUdsJ71OkFcijSSGQ?e=yaW2bX" }], shade: "hackathon" },
  { id: "tasteloop-app", title: "TasteLoop App", category: "hackathon", date: "11 - 13 July 2025", badge: "AI-Powered", desc: "A proof-of-concept to discover movies, TV shows, and games using natural language. Uses OpenAI and pulls live data from TMDB and RAWG APIs.", tags: ["React", "Node.js", "OpenAI API", "TMDB API", "RAWG API"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }], links: [{ label: "Source", url: "https://github.com/Plum165/UnitedHacksV5" }], shade: "hackathon" },
  { id: "ussd-interledger", title: "USSD + Interledger Payment App", category: "hackathon", date: "23 - 28 June 2025", badge: "🏆 2nd Place", desc: "Offline-first payments via USSD integrated with Interledger Open Payments, enabling cross-border transactions without persistent internet.", tags: ["Node.js", "USSD", "Interledger", "Express"], contributors: [{ name: "Moegamat Samsodien (lead)", link: "https://linkedin.com/in/moegamatsamsodien" }, { name: "Team Member 1", link: "https://linkedin.com/in/teammember1" }], links: [{ label: "Source", url: "https://github.com/Plum165/FinTechHackthon" }], shade: "hackathon" },
  { id: "page-replacement", title: "Page Replacement Simulator", category: "coursework", date: "21 Jun 2025", badge: "Coursework", desc: "Java implementation of FIFO, LRU, Optimal, and Clock page replacement algorithms with visualizations.", tags: ["Java", "Algorithms", "OS"], contributors: [{ name: "Course Group", link: "#" }], links: [{ label: "Source", url: "https://github.com/Plum165/PgAlgo" }], shade: "coursework" },
  { id: "fnb-dataquest", title: "FNB DataQuest: Product Recommendation System", category: "hackathon", date: "1 - 31 May 2025", badge: "Data Science", desc: "Built a recommendation system by analyzing over 400,000 e-commerce transactions to predict customer purchases. Implemented using LightGBM.", tags: ["Python", "LightGBM", "Pandas", "Scikit-learn"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }], links: [{ label: "Source", url: "https://github.com/Plum165/RecSystems2025" }], shade: "hackathon" },
  { id: "banker-algo", title: "Banker's Algorithm Visualizer", category: "coursework", date: "15 May 2025", badge: "Coursework", desc: "Deadlock avoidance simulation using Banker's Algorithm with a step-by-step explanation mode.", tags: ["Java", "OS", "Simulation"], contributors: [{ name: "Course Group", link: "#" }], links: [{ label: "Source", url: "https://github.com/Plum165/BankerAlgo" }], shade: "coursework" },
  { id: "java-gym-sim", title: "Java Gym Simulation with Time Tracking", category: "coursework", date: "14 Apr - 6 May 2025", badge: "Performance", desc: "Simulation demonstrating a custom TimeTracker class for logging performance metrics. It tracks execution times and exports results to CSV for analysis.", tags: ["Java", "Performance Tuning", "CSV Export"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }], links: [{ label: "Source", url: "https://github.com/Plum165/Java-Gym-Simulation" }], shade: "coursework" },
  { id: "torrent-simulator", title: "Simplified Torrent-like File Sharing", category: "coursework", date: "24 Feb - 18 Mar 2025", badge: "Networking", desc: "A Python-based P2P file sharing simulation to teach networking principles. Includes a tracker for peer discovery and supports both TCP and UDP.", tags: ["Python", "TCP/UDP Sockets", "Multithreading"], contributors: [{ name: "Moegamat Samsodien (Lead)", link: "https://linkedin.com/in/moegamatsamsodien" }, { name: "Aneesah Barnes", link: "https://www.linkedin.com/in/aneesah-barnes-724143237" }, { name: "Marcus Buxmann", link: "https://www.linkedin.com/in/marcus-buxmann-a63690258/" }], links: [{ label: "Source", url: "https://github.com/Plum165/Simplified-torrent-like-file-sharing" }], shade: "coursework" },
  { id: "rural-triage-app", title: "Rural Hospital Triage App (Prototype)", category: "hackathon", date: "29 Nov – 2 Dec 2024", badge: "Healthcare", desc: "A digital triage system for rural hospitals to assess patient urgency and notify doctors, helping to reduce burnout and streamline case management.", tags: ["Figma", "Prototyping"], contributors: [{ name: "Bokang Ndaba", link: "https://www.linkedin.com/in/bokang-ndaba-561286280" }, { name: "Ntuthuko Clement Motha", link: "https://www.linkedin.com/in/ntuthuko-clement-motha-943915295" }, { name: "Ntokozo Vundla", link: "https://www.linkedin.com/in/ntokozo-vundla-5a3186237/" }, { name: "Nyeleti Mushwana", link: "https://www.linkedin.com/in/nyeleti-mushwana-212b93230/" }, { name: "Kamogelo Selabi", link: "https://www.linkedin.com/in/kamogelo-selabi-368737208/" }, { name: "Ridaa Botha", link: "https://www.linkedin.com/in/moegamat-ridaa-botha-827783202/" }], links: [{ label: "Source", url: "https://github.com/Plum165/Innovate4Health" }], shade: "hackathon" },
  { id: "chommies-sql", title: "Chommies SQL Simulation", category: "coursework", date: "15 Apr - 3 May 2024", badge: "Database", desc: "A Java and MySQL simulation for university administration tasks, such as adding convenors, updating venues, and managing student registrations.", tags: ["Java", "MySQL", "JDBC"], contributors: [{ name: "Aneesah Barnes", link: "https://www.linkedin.com/in/aneesah-barnes-724143237" }, { name: "Shriya Inderpal", link: "https://www.linkedin.com/in/shriya-inderpal-566255371/" }, { name: "Casey Hunter", link: "#" }, { name: "Aria Jeewon", link: "https://www.linkedin.com/in/aria-jeewon-4586182b5/" }], links: [{ label: "Source", url: "https://github.com/Plum165/database" }], shade: "coursework" },
  { id: "dict-search-tool", title: "Dictionary Search Comparison Tool", category: "coursework", date: "8 Mar - 23 Mar 2024", badge: "Data Structures", desc: "A Java app that compares the efficiency of AVL Tree search vs. Binary Search, displaying the number of comparisons for each method.", tags: ["Java", "AVL Tree", "Binary Search"], contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }], links: [{ label: "Source", url: "https://github.com/Plum165/DictSearchTool" }], shade: "coursework" }
];
  // ----------------- Render Projects -----------------
  const projectContainer = $('#projects');

  function escapeHtml(s) {
    return s ? String(s).replace(/</g, '&lt;').replace(/>/g, '&gt;') : s;
  }

  function renderContributors(contribs) {
    if (!contribs || contribs.length === 0) return '';
    return contribs.map(c => c.link && c.link !== '#' ? `<a href="${c.link}" target="_blank" rel="noopener" class="underline">${escapeHtml(c.name)}</a>` : `<span>${escapeHtml(c.name)}</span>`).join(', ');
  }

  function makeProjectCard(p) {
    const shadeClass = { hackathon: 'shade-hack', academic: 'shade-work', coursework: 'shade-edu', side: 'shade-skill', default: 'shade-activity' }[p.shade || p.category || 'default'];
    const tagsHtml = (p.tags || []).map(t => `<span class="pill">${escapeHtml(t)}</span>`).join(' ');
    const linkHtml = (p.links || []).map(l => `<a class="px-3 py-1 rounded-md text-sm bg-black/20" href="${l.url}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`).join(' ');
    const contributorsHtml = p.contributors && p.contributors.length ? `<div class="mt-3 text-sm muted"><strong>Contributors:</strong> ${renderContributors(p.contributors)}</div>` : '';

    const card = document.createElement('article');
    card.className = `project-card ${shadeClass} glass`;
    card.setAttribute('data-category', p.category || 'side');
    card.setAttribute('data-aos', 'zoom-in');
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="badge">${escapeHtml(p.badge || p.category || 'Project')}</span>
        <div class="text-sm muted">${escapeHtml(p.date || '')}</div>
      </div>
      <div class="mt-3">
        <h3 class="text-xl font-bold">${escapeHtml(p.title)}</h3>
        <p class="mt-2 text-sm">${escapeHtml(p.desc)}</p>
        <div class="mt-3 flex flex-wrap gap-2">${tagsHtml}</div>
        ${contributorsHtml}
      </div>
      <div class="mt-4 flex gap-2 flex-wrap">${linkHtml}</div>
    `;
    return card;
  }

  function renderProjects() {
    projectContainer.innerHTML = '';
    projects.forEach(p => projectContainer.appendChild(makeProjectCard(p)));
    AOS.refresh();
    if (window.lucide) lucide.createIcons();
    renderAllCardsShadeVariants();
  }
// ----------------- Activities Section -----------------
  const activities = [
    { id: "chess-competitive", title: "Competitive Chess", category: "sport", date: "Ongoing", badge: "University Player", desc: "Advanced from a school team leader to a university-level player for the College House team, maintaining an average ELO rating of 1500." },
    { id: "volunteer-tutoring", title: "Peer Tutoring & Mentorship", category: "volunteer", date: "Ongoing", badge: "Volunteer", desc: "Dedicated time to mentoring fellow students through peer tutoring and leading community coding workshops, helping them succeed in challenging technical subjects." },
    { id: "rackathon-2025", title: "Rackathon Tournament", category: "sport", date: "10 Sep 2025", badge: "🏆 Tournament Runner-Up", desc: "Competed in a multi-sport tournament combining squash, tennis, table tennis, and badminton. Secured 2nd place in the Men’s D group, showcasing versatility across multiple racket disciplines." },
    { id: "archery", title: "Archery", category: "sport", date: "2025", badge: "Discipline & Focus", desc: "Actively training in archery with a 36lb left-hand bow, a discipline that sharpens precision, patience, and concentration." },
    { id: "basketball-leadership", title: "Basketball Leadership", category: "sport", date: "2023 - 2024", badge: "Coach & Captain", desc: "Coached and captained the College House Residence team for the interleague season, applying years of experience that included a 3v3 tournament runner-up finish." },
    { id: "martial-arts", title: "Martial Arts Practice", category: "sport", date: "2024", badge: "Self-Discipline", desc: "Engaged in multiple martial arts, including Taekwondo for self-defense, Tai Chi for meditative discipline, and boxing for physical conditioning." },
    { id: "moshal-outreach", title: "High School Outreach Speaker", category: "volunteer", date: "Jul 2023", badge: "Moshal Program Volunteer", desc: "Returned to my former high school to inspire learners, sharing personal experiences and practical advice on university pathways, funding options, and careers in tech." },
    { id: "uct-maths-volunteer", title: "UCT Mathematics Competition Volunteer", category: "volunteer", date: "Jul 2023", badge: "Event Support", desc: "Assisted in organizing and running the annual UCT Mathematics Competition, ensuring a smooth and secure exam environment for hundreds of student participants." },
    { id: "tennis-volleyball", title: "Team & Individual Sports", category: "sport", date: "2019 - 2020", badge: "Competitive Player", desc: "Achieved a runner-up position in my tennis division and honed skills as a key receiver in volleyball, participating in boot camps to enhance performance." }
  ];

  const activityContainer = $('#activities-grid');
  const activityButtons = $$('.activity-btn');
  const activityDesc = $('#activity-desc');

  const activityCategoryTexts = {
    all: 'A collection of my athletic, leadership, and community activities.',
    sport: 'Highlights from my experience in team and individual sports.',
    volunteer: 'Efforts to support my community through mentorship and teaching.'
  };

  function makeActivityCard(activity) {
    const card = document.createElement('article');
    card.className = 'info-card glass shade-activity';
    card.setAttribute('data-category', activity.category);
    card.setAttribute('data-aos', 'fade-up');
    card.innerHTML = `
      <div class="flex items-start justify-between">
        <div>
          <div class="text-sm muted">${activity.date}</div>
          <h3 class="font-semibold text-lg">${escapeHtml(activity.title)}</h3>
          <div class="muted text-sm mt-1">${escapeHtml(activity.badge)}</div>
        </div>
      </div>
      <p class="mt-3 text-sm">${escapeHtml(activity.desc)}</p>
    `;
    return card;
  }

  function renderActivities() {
    if (!activityContainer) return;
    activityContainer.innerHTML = '';
    activities.forEach(act => {
      const card = makeActivityCard(act);
      activityContainer.appendChild(card);
    });
    AOS.refresh();
  }

  function setActiveActivityCategory(filter) {
    const cards = $$('#activities-grid .info-card');
    cards.forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'flex' : 'none';
    });
    activityDesc.textContent = activityCategoryTexts[filter] || '';
    activityButtons.forEach(b => b.classList.remove('ring-2','ring-offset-1','ring-white/20'));
    const btn = activityButtons.find(b => b.dataset.filter === filter);
    if (btn) btn.classList.add('ring-2','ring-offset-1','ring-white/20');
  }

  activityButtons.forEach(btn => {
    btn.addEventListener('click', () => setActiveActivityCategory(btn.dataset.filter));
  });

  
   
   renderActivities();
   setActiveActivityCategory('all');
  // ----------------- Category filtering -----------------
  const categoryButtons = $$('.category-btn');
  const categoryDesc = $('#category-desc');
  const categoryTexts = {
    all: 'All projects',
    hackathon: 'Hackathon projects — prototypes built under time constraints (24–72 hours).',
    coursework: 'Coursework — projects aligned with courses and learning outcomes.',
    side: 'Side projects — personal or exploratory work built independently.',
    academic: 'Academic helpers — tools to support learning and teaching.'
  };

  function setActiveCategory(filter) {
    $$('#projects .project-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'flex' : 'none';
    });
    categoryDesc.textContent = categoryTexts[filter] || '';
    categoryButtons.forEach(b => b.classList.remove('ring-2', 'ring-offset-1', 'ring-white/20'));
    const btn = categoryButtons.find(b => b.dataset.filter === filter);
    if (btn) btn.classList.add('ring-2', 'ring-offset-1', 'ring-white/20');
  }

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => setActiveCategory(btn.dataset.filter));
  });

  // ----------------- Dynamic shade generation -----------------
  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(h => h + h).join('');
    const n = parseInt(hex, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function rgbToHex(r, g, b) { return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join(''); }
  function shadeRgb(rgb, percent) {
    const amt = Math.round(255 * Math.abs(percent));
    const op = percent < 0 ? (a, b) => Math.max(0, a - b) : (a, b) => Math.min(255, a + b);
    return { r: op(rgb.r, amt), g: op(rgb.g, amt), b: op(rgb.b, amt) };
  }

  function renderAllCardsShadeVariants() {
    const c1 = (cssVar('--c1') || '#ff0000').split(' ')[0];
    const c2 = (cssVar('--c2') || '#0000ff').split(' ')[0];
    const supportsColorMix = CSS && CSS.supports && CSS.supports('background: color-mix(in srgb, red 20%, blue)');
    const variants = { 'shade-work': { c1: -0.18, c2: -0.08 }, 'shade-hack': { c1: 0.02, c2: -0.22 }, 'shade-edu': { c1: -0.05, c2: 0.05 }, 'shade-skill': { c1: 0.12, c2: 0.12 }, 'shade-activity': { c1: 0.04, c2: -0.04 } };
    const rgb1 = hexToRgb(c1);
    const rgb2 = hexToRgb(c2);

    $$('.shade-work, .shade-hack, .shade-edu, .shade-skill, .shade-activity').forEach(el => {
      const chosen = Object.keys(variants).find(v => el.classList.contains(v));
      if (!chosen) return;
      const v = variants[chosen];
      if (supportsColorMix) {
        el.style.background = `linear-gradient(135deg, color-mix(in srgb, var(--c1) ${Math.round((1 + v.c1) * 50)}%, var(--c2)), color-mix(in srgb, var(--c2) ${Math.round((1 + v.c2) * 50)}%, var(--c1)))`;
      } else {
        const c1Shaded = rgbToHex(...Object.values(shadeRgb(rgb1, v.c1)));
        const c2Shaded = rgbToHex(...Object.values(shadeRgb(rgb2, v.c2)));
        el.style.background = `linear-gradient(135deg, ${c1Shaded}, ${c2Shaded})`;
      }
    });
  }

  // ----------------- Smooth Scroll -----------------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ----------------- Keyboard Shortcuts -----------------
  window.addEventListener('keydown', e => {
    if (e.key === 't' && !e.metaKey && !e.ctrlKey) {
      $('#cycle-theme').click();
    }
  });

  // ----------------- Page Initialization -----------------
  function initPage() {
    AOS.init({ duration: 700, once: true });

    // Load saved theme and font
    const storedTheme = localStorage.getItem('portfolio:theme') || 'spiderman';
    applyTheme(storedTheme);
    const storedFont = localStorage.getItem('portfolio:font') || 'Inter';
    fontSelect.value = storedFont;
    applyFont(storedFont);

    // Initial render
    renderProjects();
    setActiveCategory('all');
    $('#year').textContent = new Date().getFullYear();
    
    // Refresh AOS after a short delay to catch dynamically added elements
    setTimeout(() => AOS.refresh(), 300);
  }

  initPage();
});