import { Project } from '../src/types';

export const initialProjects: Project[] = [
  {
    id: 'sta2030s-statistical-theory-calculator',
    title: 'STA2030S — Statistical Theory Calculator',
    category: 'academic',
    date: 'December 2025 - June 2026',
    badge: 'Academic',
    desc: 'Statistical Theory Calculator is an interactive educational platform for probability, distributions, and statistical theory, featuring step-by-step solutions, proofs, and visual learning tools. It includes modules for probability distributions, PDF analysis, MGFs, random variable transformations, and bivariate statistics, all powered by client-side mathematical computation. Built with a modern themed interface and no external API dependencies, it provides a comprehensive environment for learning and exploring statistical concepts.',
    tags: ['Statistics', 'Technical Writing', 'Academic Notes'],
    contributors: [
      { name: 'Moegamat Samsodien', link: 'https://linkedin.com/in/moegamatsamsodien' }
    ],
    links: [
      { label: 'Website', url: 'https://sta2030notes.vercel.app/' }
    ],
    shade: 'academic'
  },
  {
    id: "sta3022f-notes",
    title: "STA3022F — Advanced Statistics Study Notes",
    category: "academic",
    date: "Feb 2026 - May 2026",
    badge: "Academic",
    desc: "A growing collection of detailed study notes for STA3022F aimed at improving conceptual understanding and exam preparation. The notes break down complex statistical concepts into structured explanations and examples to support independent study.",
    tags: ["Statistics", "Technical Writing", "Academic Notes"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [{ label: "Website", url: "https://sta3022fnotes.vercel.app/" }],
    shade: "academic"
  },
  {
    id: 'fnb-dataquest-2026-credit-risk-workstation',
    title: 'FNB DataQuest 2026 – Credit Risk Workstation',
    category: 'hackathon',
    date: 'May 2026 - May 2026',
    badge: 'FNB DataQuest 2026',
 desc: 'Developed an interactive credit risk analytics platform for retail lending, leveraging Logistic Regression, WoE, and IV methodologies to produce transparent and Basel III-compliant credit scorecards. Features include exploratory data analysis, data quality monitoring, model performance evaluation (AUC, Gini, ROC), scorecard generation, and business-facing tools for threshold tuning and portfolio risk simulation.',
    tags: ['Statistics', 'Data Science', 'Typescript', 'Credit Analysis'],
    contributors: [
      { name: 'Moegamat Samsodien', link: 'https://linkedin.com/in/moegamatsamsodien' },
      {
        name: 'Entisaar Elfadl',
        link: 'https://www.linkedin.com/in/entisaar-elfadl-400744351/'
      },
      {
        name: 'Misha Dick',
        link: 'https://www.linkedin.com/in/misha-d-jacobs-3bb754321/'
      }
    ],
    links: [
      { label: 'Website', url: 'https://fnb-data-quest2026.vercel.app/' }
    ],
    shade: 'academic'
  },
  {
    id: 'tournament-os',
    title: 'Tournament OS',
    category: 'side',
    date: 'April 2026 - May 2026',
    badge: 'Sport Organizer',
    desc: 'A web-based tournament management platform designed to simplify scoring, rankings, and administrative tasks for sports competitions such as archery, basketball, and other competitive events. The platform helps organisers manage tournaments more efficiently through automated scoring and structured competition workflows, while also providing users with educational content about different sports, including their rules, background, and history.',
    tags: ["HTML", "JavaScript"],
    contributors: [{ name: 'Moegamat Samsodien', link: 'https://linkedin.com/in/moegamatsamsodien' }],
    links: [{ label: 'Website', url: 'https://tournament-os.vercel.app/index.html' }],
    shade: 'side'
  },
  {
    id: "toa-notes",
    title: "Theory of Algorithms — Interactive Notes & Practice",
    category: "academic",
    date: "Dec 2025 - Present",
    badge: "Academic",
    desc: "An interactive study platform for Theory of Algorithms featuring structured summary notes, interactive exercises for key topics, and guided practice. Currently developing a practical exam simulator where users can submit answers, receive automated marking, and access solution memos after a limited number of attempts.",
    tags: ["HTML", "JavaScript", "Interactive Learning"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [{ label: "Website", url: "https://to-a.vercel.app/" }],
    shade: "academic"
  },
  {
    id: "toc-notes",
    title: "Theory of Computation — Detailed Study Notes",
    category: "academic",
    date: "Dec 2025 - Jan 2026",
    badge: "Academic",
    desc: "A structured set of detailed study notes for Theory of Computation designed to support exam preparation and concept understanding. The material focuses on clear explanations of core theoretical concepts and serves as a comprehensive study reference.",
    tags: ["HTML", "Technical Writing", "Computer Science Theory"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [{ label: "Website", url: "https://to-a.vercel.app/" }],
    shade: "academic"
  },
  {
    id: "vea",
    title: "VEA – Violence Ending Agent",
    category: "side",
    date: "Dec 2025",
    badge: "AI Safety Platform",
    desc: "A confidential AI-driven platform designed to support survivors of gender-based violence through structured, empathetic chat interactions. The system provides guided emotional support, real-time crisis keyword detection, and safe escalation to trained professionals. It also enables moderated peer support connections while maintaining strong privacy protections and offline fallback functionality for accessibility.",
    tags: ["React.js", "Node.js", "AI Chat Systems", "Crisis Detection", "Privacy-first Design"],
    contributors: [
      { name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" },
      { name: "Jawahier Achmat", link: "https://www.linkedin.com/in/jawahier-achmat-783bbb267/" },
      { name: "Nikita Martin", link: "https://www.linkedin.com/in/nikita-martin-17905630a/" },
      { name: "Nooriya Shaik", link: "https://www.linkedin.com/in/nooriya-shaik-bab7b8364/" }
    ],
    links: [{ label: "Source", url: "https://github.com/Plum165/Code-the-Halls-" }],
    shade: "hackathon"
  },
  {
    id: "uav-visualizer",
    title: "UAV Flight Path Visualization & Analysis System",
    category: "coursework",
    date: "Aug - Oct 2025",
    badge: "Capstone Project",
    desc: "A 3D interactive tool to visualize, compare, and analyze drone flight paths over complex terrains. Features 3D mesh rendering, waypoint integration, and camera view playback.",
    tags: ["Python", "Open3D", "pyrender", "trimesh", "PyQt"],
    contributors: [
      { name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" },
      { name: "Aneesah Barnes", link: "https://www.linkedin.com/in/aneesah-barnes-724143237" },
      { name: "Marcus Buxmann", link: "https://www.linkedin.com/in/marcus-buxmann-a63690258/" }
    ],
    links: [{ label: "Source", url: "https://github.com/Plum165/Capstone" }],
    shade: "coursework"
  },
  {
    id: "finance-formulae",
    title: "Managerial Finance (FTX1005F) Calculator",
    category: "academic",
    date: "Sept - Oct 2025",
    badge: "Finance • Tool",
    desc: "A web-based, interactive reference for key financial formulas, ratios, and valuation methods. Features MathJax rendering and a print-to-PDF function.",
    tags: ["HTML", "Tailwind CSS", "JavaScript", "MathJax"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [
      { label: "Live Demo", url: "https://plum165.github.io/FTX-Calculator/" },
      { label: "Source", url: "https://github.com/Plum165/FTX-Calculator" }
    ],
    shade: "academic"
  },
  {
    id: "sta1000",
    title: "STA1000 — Interactive Calculator & Practice",
    category: "academic",
    date: "June - Oct 2025",
    badge: "Academic",
    desc: "A guided statistics practice platform with step-by-step solutions, practice tests, and MathJax-rendered equations.",
    tags: ["HTML", "JavaScript", "MathJax"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [
      { label: "Live Demo", url: "https://plum165.github.io/Stats-Calculator/index.html" },
      { label: "Source", url: "https://github.com/Plum165/Stats-Calculator" }
    ],
    shade: "academic"
  },
  {
    id: "budgetwise",
    title: "BudgetWise – Gamified Budgeting Web App",
    category: "hackathon",
    date: "13 - 14 Sep 2025",
    badge: "Fintech Game",
    desc: "A gamified budgeting app to make personal finance interactive. Features budget tracking, spending summaries, and rewards for hitting milestones.",
    tags: ["JavaScript", "HTML", "CSS", "JSON", "Gamification"],
    contributors: [
      { name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" },
      { name: "Misha Dick", link: "https://www.linkedin.com/in/misha-d-jacobs-3bb754321/" },
      { name: "Entisaar Elfadl", link: "https://www.linkedin.com/in/entisaar-elfadl-400744351/" }
    ],
    links: [
      { label: "Live Demo", url: "https://plum165.github.io/SA_Intervarsity_Hackathon_CryptoKnights/" },
      { label: "Source", url: "https://github.com/Plum165/SA_Intervarsity_Hackathon_CryptoKnights" }
    ],
    shade: "hackathon"
  },
  {
    id: "hack-the-system",
    title: "Hack the System: Budgeting & Investment Game",
    category: "hackathon",
    date: "13 Sep 2025",
    badge: "FinTech Game",
    desc: "A gamified platform where users simulate personal and business budgets, earning points to unlock themes and rewards.",
    tags: ["JavaScript", "HTML", "CSS", "LocalStorage", "Gamification"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [
      { label: "Live Demo", url: "https://plum165.github.io/Budget/" },
      { label: "Source", url: "https://github.com/Plum165/Budget" }
    ],
    shade: "hackathon"
  },
  {
    id: "kaspersky-ctf",
    title: "Kaspersky{CTF} Cybersecurity Challenge",
    category: "side",
    date: "30 - 31 Aug 2025",
    badge: "Cybersecurity",
    desc: "Participated in the international Kaspersky{CTF} competition, solving challenges in cryptography, web exploitation, and reverse engineering.",
    tags: ["Python", "SageMath", "Docker", "Cryptography", "Web Security"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [{ label: "Learn More", url: "https://ctf.kaspersky.com/" }],
    shade: "side"
  },
  {
    id: "task-network",
    title: "Task Network Input Tool",
    category: "side",
    date: "4 Aug 2025",
    badge: "Visualization",
    desc: "Web app for Activity-on-Node diagrams with curved arrows, dark mode, and SVG export.",
    tags: ["HTML", "CSS", "JavaScript", "SVG"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [
      { label: "Source", url: "https://github.com/Plum165/Task-Network-Tool" },
      { label: "Live Demo", url: "https://plum165.github.io/Network_Analysis/" }
    ],
    shade: "side"
  },
  {
    id: "megazoo-planner",
    title: "MegaZoo Hackathon – Grid-Based Zoo Planner",
    category: "hackathon",
    date: "2 Aug 2025",
    badge: "Algorithm",
    desc: "A 2D zoo layout planner that uses an algorithm to position animals and shops on a grid, optimizing for spacing, cost, and visitor interest.",
    tags: ["Python", "JSON", "2D Grid Algorithms"],
    contributors: [
      { name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" },
      { name: "Entisaar Elfadl", link: "https://www.linkedin.com/in/entisaar-elfadl-400744351/" },
      { name: "Misha Jacobs", link: "https://www.linkedin.com/in/misha-d-jacobs-3bb754321/" }
    ],
    links: [{ label: "Source", url: "https://github.com/Plum165/mega-zoo-planner" }],
    shade: "hackathon"
  },
  {
    id: "triage-ai",
    title: "Triage AI — Patient Triage System",
    category: "side",
    date: "Jun 15 – Aug 1, 2025",
    badge: "AI • Healthcare",
    desc: "AI-powered triage chatbot that assigns urgency levels and surfaces cases to a doctor dashboard, with PDF export of summaries.",
    tags: ["Groq API", "React", "Node.js"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [{ label: "Source", url: "https://github.com/Plum165/triage-ai-web" }],
    shade: "side"
  },
  {
    id: "web-usage-tracker",
    title: "Web Usage Time Tracker",
    category: "hackathon",
    date: "15 – 27 July 2025",
    badge: "Productivity",
    desc: "A tool to track time spent on websites. Features a live timer, session logging, and interactive charts to visualize browsing patterns.",
    tags: ["HTML", "CSS", "JavaScript", "Chart.js"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [
      { label: "Live Demo", url: "https://plum165.github.io/Web-Page-Tracker" },
      { label: "Source", url: "https://github.com/Plum165/Web-Page-Tracker" }
    ],
    shade: "hackathon"
  },
  {
    id: "word-wise",
    title: "Word Wise — Adobe Express Addon",
    category: "hackathon",
    date: "May 19 – Jul 21, 2025",
    badge: "Accessibility",
    desc: "Add-on for simplifying English text for learners and content creators, with translation support.",
    tags: ["JavaScript", "Add-on", "Accessibility"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [{ label: "Presentation", url: "https://uctcloud-my.sharepoint.com/:p:/g/personal/smsmoe006_myuct_ac_za/EaZxMVCy0NpApOYo3hyo4SkB9eMuzQUdsJ71OkFcijSSGQ?e=yaW2bX" }],
    shade: "hackathon"
  },
  {
    id: "tasteloop-app",
    title: "TasteLoop App",
    category: "hackathon",
    date: "11 - 13 July 2025",
    badge: "AI-Powered",
    desc: "A proof-of-concept to discover movies, TV shows, and games using natural language. Uses OpenAI and pulls live data from TMDB and RAWG APIs.",
    tags: ["React", "Node.js", "OpenAI API", "TMDB API", "RAWG API"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [{ label: "Source", url: "https://github.com/Plum165/UnitedHacksV5" }],
    shade: "hackathon"
  },
  {
    id: "ussd-interledger",
    title: "USSD + Interledger Payment App",
    category: "hackathon",
    date: "23 - 28 June 2025",
    badge: "🏆 2nd Place",
    desc: "Offline-first payments via USSD integrated with Interledger Open Payments, enabling cross-border transactions without persistent internet.",
    tags: ["Node.js", "USSD", "Interledger", "Express"],
    contributors: [
      { name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" },
      { name: "Sakeenah Majiet", link: "https://www.linkedin.com/in/ACoAADnntV4Bu4s9XL59yet_ghTXc0gIJKTWYg4" },
      { name: "Amukelani Rikhotso", link: "https://www.linkedin.com/in/ACoAAEDuoWQBcswkg52H4swWa25VI2PhzCwnGrU" },
      { name: "Raibim Alam", link: "https://www.linkedin.com/in/ACoAADT8U7YBeUA3iE9Gs7QI6G7H5NQfi1DiudY" },
      { name: "Lateef Ahmed", link: "https://www.linkedin.com/in/ACoAAFnr23UB48-o4BWkMNPH632oUpalqVTN1uQ" }
    ],
    links: [{ label: "Source", url: "https://github.com/Plum165/FinTechHackthon" }],
    shade: "hackathon"
  },
  {
    id: "page-replacement",
    title: "Page Replacement Simulator",
    category: "coursework",
    date: "21 Jun 2025",
    badge: "Coursework",
    desc: "Java implementation of FIFO, LRU, Optimal, and Clock page replacement algorithms with visualizations.",
    tags: ["Java", "Algorithms", "OS"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [{ label: "Source", url: "https://github.com/Plum165/PgAlgo" }],
    shade: "coursework"
  },
  {
    id: "fnb-dataquest",
    title: "FNB DataQuest: Product Recommendation System",
    category: "hackathon",
    date: "1 - 31 May 2025",
    badge: "Data Science",
    desc: "Built a recommendation system by analyzing over 400,000 e-commerce transactions to predict customer purchases. Implemented using LightGBM.",
    tags: ["Python", "LightGBM", "Pandas", "Scikit-learn"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [{ label: "Source", url: "https://github.com/Plum165/RecSystems2025" }],
    shade: "hackathon"
  },
  {
    id: "banker-algo",
    title: "Banker's Algorithm Visualizer",
    category: "coursework",
    date: "15 May 2025",
    badge: "Coursework",
    desc: "Deadlock avoidance simulation using Banker's Algorithm with a step-by-step explanation mode.",
    tags: ["Java", "OS", "Simulation"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [{ label: "Source", url: "https://github.com/Plum165/BankerAlgo" }],
    shade: "coursework"
  },
  {
    id: "java-gym-sim",
    title: "Java Gym Simulation with Time Tracking",
    category: "coursework",
    date: "14 Apr - 6 May 2025",
    badge: "Performance",
    desc: "Simulation demonstrating a custom TimeTracker class for logging performance metrics. It tracks execution times and exports results to CSV for analysis.",
    tags: ["Java", "Performance Tuning", "CSV Export"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [{ label: "Source", url: "https://github.com/Plum165/Java-Gym-Simulation" }],
    shade: "coursework"
  },
  {
    id: "torrent-simulator",
    title: "Simplified Torrent-like File Sharing",
    category: "coursework",
    date: "24 Feb - 18 Mar 2025",
    badge: "Networking",
    desc: "A Python-based P2P file sharing simulation to teach networking principles. Includes a tracker for peer discovery and supports both TCP and UDP.",
    tags: ["Python", "TCP/UDP Sockets", "Multithreading"],
    contributors: [
      { name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" },
      { name: "Aneesah Barnes", link: "https://www.linkedin.com/in/aneesah-barnes-724143237" },
      { name: "Marcus Buxmann", link: "https://www.linkedin.com/in/marcus-buxmann-a63690258/" }
    ],
    links: [{ label: "Source", url: "https://github.com/Plum165/Simplified-torrent-like-file-sharing" }],
    shade: "coursework"
  },
  {
    id: "rural-triage-app",
    title: "Rural Hospital Triage App (Prototype)",
    category: "hackathon",
    date: "29 Nov – 2 Dec 2024",
    badge: "Healthcare",
    desc: "A digital triage system for rural hospitals to assess patient urgency and notify doctors, helping to reduce burnout and streamline case management.",
    tags: ["Figma", "Prototyping"],
    contributors: [
      { name: "Bokang Ndaba", link: "https://www.linkedin.com/in/bokang-ndaba-561286280" },
      { name: "Ntuthuko Clement Motha", link: "https://www.linkedin.com/in/ntuthuko-clement-motha-943915295" },
      { name: "Ntokozo Vundla", link: "https://www.linkedin.com/in/ntokozo-vundla-5a3186237/" },
      { name: "Nyeleti Mushwana", link: "https://www.linkedin.com/in/nyeleti-mushwana-212b93230/" },
      { name: "Kamogelo Selabi", link: "https://www.linkedin.com/in/kamogelo-selabi-368737208/" },
      { name: "Ridaa Botha", link: "https://www.linkedin.com/in/moegamat-ridaa-botha-827783202/" }
    ],
    links: [{ label: "Source", url: "https://github.com/Plum165/Innovate4Health" }],
    shade: "hackathon"
  },
  {
    id: "chommies-sql",
    title: "Chommies SQL Simulation",
    category: "coursework",
    date: "15 Apr - 3 May 2024",
    badge: "Database",
    desc: "A Java and MySQL simulation for university administration tasks, such as adding convenors, updating venues, and managing student registrations.",
    tags: ["Java", "MySQL", "JDBC"],
    contributors: [
      { name: "Aneesah Barnes", link: "https://www.linkedin.com/in/aneesah-barnes-724143237" },
      { name: "Shriya Inderpal", link: "https://www.linkedin.com/in/shriya-inderpal-566255371/" },
      { name: "Casey Hunter", link: "#" },
      { name: "Aria Jeewon", link: "https://www.linkedin.com/in/aria-jeewon-4586182b5/" }
    ],
    links: [{ label: "Source", url: "https://github.com/Plum165/database" }],
    shade: "coursework"
  },
  {
    id: "dict-search-tool",
    title: "Dictionary Search Comparison Tool",
    category: "coursework",
    date: "8 Mar - 23 Mar 2024",
    badge: "Data Structures",
    desc: "A Java app that compares the efficiency of AVL Tree search vs. Binary Search, displaying the number of comparisons for each method.",
    tags: ["Java", "AVL Tree", "Binary Search"],
    contributors: [{ name: "Moegamat Samsodien", link: "https://linkedin.com/in/moegamatsamsodien" }],
    links: [{ label: "Source", url: "https://github.com/Plum165/DictSearchTool" }],
    shade: "coursework"
  }
];
