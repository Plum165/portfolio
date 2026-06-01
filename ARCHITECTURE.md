# Portfolio Project Architecture

## Overview
This is a full-stack portfolio website built with **React + TypeScript** (frontend) and **Express.js** (backend API). The project uses a serverless deployment on Vercel with persistent database storage.

---

## Folder Structure Breakdown

```
Website/
├── src/                          # Frontend React application
│   ├── App.tsx                  # Main app component with state management
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Global styles
│   ├── types.ts                 # TypeScript type definitions
│   ├── components/              # Reusable React components
│   │   ├── ProjectManager.tsx   # Add/edit/delete projects UI
│   │   ├── WorkManager.tsx      # Add/edit/delete work experience UI
│   │   └── ActivityManager.tsx  # Add/edit/delete activities UI
│   └── utils/
│       └── themes.ts            # Theme configuration and color utilities
│
├── api/                          # Serverless API functions (Vercel)
│   └── index.ts                 # Main API handler - all routes defined here
│                                # Handles: Auth, Projects, Work, Activities, Messages
│
├── server/                       # Backend shared utilities
│   ├── db.ts                    # Database operations (CRUD, auth, sessions)
│   ├── projects.ts              # Initial projects data
│   ├── experience.ts            # Initial work experience data
│   └── activities.ts            # Initial activities data
│
├── public/                       # Static assets
│   └── admin/
│       └── index.html           # Admin dashboard HTML
│
├── server.ts                     # Express app definition (for local development)
├── dev-server.ts                # Local development server runner
├── index.html                   # Frontend HTML entry point
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
├── vercel.json                  # Vercel deployment configuration
├── db.json                       # SQLite database file (auto-created)
└── metadata.json                # Portfolio metadata
```

---

## How It Works

### 1. **Frontend (React)**
- **Location**: `src/App.tsx`
- **Responsibility**: Display portfolio, manage filters, handle authentication UI
- **Data Flow**:
  ```
  App.tsx
    ├── Fetches /api/projects → setProjects
    ├── Fetches /api/work → setWork
    ├── Fetches /api/activities → setActivities
    └── Manages auth state (login/register)
  ```

### 2. **Backend API (Express/Serverless)**
- **Location**: `api/index.ts`
- **Responsibility**: Handle all HTTP requests, validate data, manage database
- **Endpoints**:
  ```
  GET  /api/projects              → Returns all projects
  POST /api/projects              → Create project (admin only)
  PUT  /api/projects/:id          → Update project (admin only)
  DELETE /api/projects/:id        → Delete project (admin only)

  GET  /api/work                  → Returns all work experience
  POST /api/work                  → Create work entry (admin only)
  PUT  /api/work/:id              → Update work entry (admin only)
  DELETE /api/work/:id            → Delete work entry (admin only)

  GET  /api/activities            → Returns all activities
  POST /api/activities            → Create activity (admin only)
  PUT  /api/activities/:id        → Update activity (admin only)
  DELETE /api/activities/:id      → Delete activity (admin only)

  POST /api/auth/register         → Register new user
  POST /api/auth/login            → Login user
  POST /api/auth/logout           → Logout user
  GET  /api/auth/me               → Get current authenticated user

  GET  /api/messages              → Get all guestbook messages
  POST /api/messages              → Post guestbook message (auth required)
  DELETE /api/messages/:id        → Delete own message or admin delete any
  ```

### 3. **Database (SQLite)**
- **Location**: `db.json` (local) or `/tmp/db.json` (Vercel)
- **Responsibility**: Persistent storage for projects, work, activities, users, messages
- **Managed By**: `server/db.ts`
- **Default Admin**: `rashaadsm2004@gmail.com` / `admin`

### 4. **Local Development**
- **Command**: `npm run dev`
- **Server**: `dev-server.ts` starts Express on port 3000
- **Frontend**: Vite dev server (usually port 5173)
- **Database**: Uses local `db.json` file

### 5. **Production (Vercel)**
- **Frontend**: Built React app served from `dist/` folder
- **API**: `api/index.ts` runs as serverless functions
- **Database**: Stored in `/tmp/db.json` (Vercel ephemeral storage)
- **Routing**: `vercel.json` rewrites all `/api/*` requests to `api/index.ts`

---

## How to Add New Data Categories (e.g., "Anime")

### Step 1: Add Types to `src/types.ts`
```typescript
export interface AnimeEntry {
  id: string;
  title: string;
  genre: string;
  rating: number;
  description: string;
  year: number;
  status: 'watching' | 'completed' | 'planned';
}
```

### Step 2: Create Initial Data File
Create `server/anime.ts`:
```typescript
import { AnimeEntry } from '../src/types';

export const initialAnime: AnimeEntry[] = [
  {
    id: 'anime-1',
    title: 'Attack on Titan',
    genre: 'Action, Fantasy',
    rating: 9.0,
    description: '...',
    year: 2013,
    status: 'completed'
  }
];
```

### Step 3: Update Database Schema in `server/db.ts`
```typescript
interface DbSchema {
  users: {...};
  projects: Project[];
  work: WorkExperience[];
  activities: Activity[];
  anime: AnimeEntry[];        // ← Add this
  messages: GuestbookMessage[];
  sessions: {...};
}

// In getDb() function, add:
if (!fs.existsSync(DB_FILE)) {
  const defaultDb: DbSchema = {
    // ... existing properties
    anime: initialAnime,        // ← Add this
  };
}

// Import at top of file
import { initialAnime } from './anime';
```

### Step 4: Add API Routes to `api/index.ts`
```typescript
// Add these routes
app.get('/api/anime', (req, res) => {
  const currentDb = getDb();
  res.json(currentDb.anime);
});

app.post('/api/anime', requireAdmin, (req, res) => {
  const animeData = req.body;
  if (!animeData.title || !animeData.genre) {
    res.status(400).json({ error: 'Title and genre required' });
    return;
  }
  
  const currentDb = getDb();
  const newAnime = {
    ...animeData,
    id: 'anime-' + Math.random().toString(36).substr(2, 9)
  };
  
  currentDb.anime.push(newAnime);
  saveDb(currentDb);
  res.status(201).json(newAnime);
});

app.put('/api/anime/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const currentDb = getDb();
  const index = currentDb.anime.findIndex(a => a.id === id);
  
  if (index === -1) {
    res.status(404).json({ error: 'Anime not found' });
    return;
  }
  
  const updated = { ...currentDb.anime[index], ...req.body, id };
  currentDb.anime[index] = updated;
  saveDb(currentDb);
  res.json(updated);
});

app.delete('/api/anime/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const currentDb = getDb();
  const index = currentDb.anime.findIndex(a => a.id === id);
  
  if (index === -1) {
    res.status(404).json({ error: 'Anime not found' });
    return;
  }
  
  currentDb.anime.splice(index, 1);
  saveDb(currentDb);
  res.json({ success: true });
});
```

### Step 5: Create React Component `src/components/AnimeManager.tsx`
```typescript
import { useState } from 'react';
import { AnimeEntry } from '../types';

export default function AnimeManager() {
  const [anime, setAnime] = useState<AnimeEntry[]>([]);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  
  const handleAdd = async () => {
    try {
      const res = await fetch('/api/anime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, genre, rating: 0, description: '', year: 2024, status: 'planned' })
      });
      if (res.ok) {
        const newEntry = await res.json();
        setAnime([...anime, newEntry]);
        setTitle('');
        setGenre('');
      }
    } catch (err) {
      console.error('Failed to add anime', err);
    }
  };
  
  return (
    <div>
      <h2>Add Anime</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <input value={genre} onChange={e => setGenre(e.target.value)} placeholder="Genre" />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
```

### Step 6: Integrate Into App.tsx
```typescript
import AnimeManager from './components/AnimeManager';

export default function App() {
  const [anime, setAnime] = useState<AnimeEntry[]>([]);
  
  const fetchAnime = async () => {
    try {
      const res = await fetch('/api/anime');
      if (res.ok) {
        setAnime(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch anime', err);
    }
  };
  
  useEffect(() => {
    fetchAnime();
  }, []);
  
  return (
    <div>
      {/* ... existing code ... */}
      <AnimeManager onAdd={() => fetchAnime()} />
      <div>
        {anime.map(a => (
          <div key={a.id}>{a.title} - {a.rating}/10</div>
        ))}
      </div>
    </div>
  );
}
```

---

## Deployment Checklist

### Before Pushing to Vercel:
1. ✅ Update `api/index.ts` with new routes
2. ✅ Update `server/db.ts` with new data types
3. ✅ Create initial data file in `server/`
4. ✅ Update `src/types.ts` with new interfaces
5. ✅ Create React components for managing new data
6. ✅ Test locally with `npm run dev`
7. ✅ Commit and push to GitHub
8. ✅ Vercel automatically deploys on push

### Testing on Vercel:
- Check [Vercel Dashboard Logs](https://vercel.com/plum165s-projects/moe-samsodien-portfolio/logs)
- Look for module import errors
- Verify `/api/*` endpoints return data
- Test in browser DevTools Network tab

---

## Common Issues & Fixes

### Issue: "Cannot find module '/var/task/server.ts'"
**Cause**: API importing from relative path that doesn't exist in Vercel's environment  
**Fix**: Ensure `api/index.ts` doesn't import from `../server.ts` - keep all API logic in `api/index.ts`

### Issue: Projects/Activities don't show on Vercel
**Cause**: API endpoints returning 500 errors  
**Fix**: 
1. Check Vercel logs for exact error
2. Verify `db.json` imports in `server/db.ts`
3. Ensure all relative paths use `../server/` not `../server`

### Issue: Database not persisting on Vercel
**Cause**: Using local filesystem that gets reset between deployments  
**Fix**: This is expected with Vercel's ephemeral storage - use external database (Firebase/MongoDB) for production persistence

---

## Local Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start local dev server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check TypeScript
```

---

## Technologies Used

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: SQLite (JSON file)
- **Build**: Vite, ESBuild
- **Deployment**: Vercel Serverless Functions
- **Auth**: JWT tokens stored in localStorage
