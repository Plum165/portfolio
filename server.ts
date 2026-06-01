import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  getDb,
  saveDb,
  registerUser,
  authenticateUser,
  getUserByToken,
  logoutUser
} from './server/db';
import { Project, GuestbookMessage } from './src/types';

const app = express();
const PORT = 3000;

// Body parser middlewares
app.use(express.json());

// Initialize DB immediately on boot
const db = getDb();

  // Helper middleware for auth checks
  const getAuthenticatedUser = (req: express.Request) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    return getUserByToken(token);
  };

  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
      res.status(403).json({ error: 'Access denied. Admin role required.' });
      return;
    }
    next();
  };

  // --- AUTHENTICATION ENDPOINTS ---
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    try {
      const newUser = registerUser(name, email, password, 'guest');
      if (!newUser) {
        res.status(400).json({ error: 'Email is already in use.' });
        return;
      }
      res.status(201).json({ user: newUser });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    try {
      const authResult = authenticateUser(email, password);
      if (!authResult) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
      res.json(authResult);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Login failed' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      logoutUser(token);
    }
    res.json({ success: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    res.json({ user });
  });

  // --- PORTFOLIO DATA ENDPOINTS ---
  app.get('/api/projects', (req, res) => {
    const currentDb = getDb();
    res.json(currentDb.projects);
  });

  app.post('/api/projects', requireAdmin, (req, res) => {
    const projectData: Omit<Project, 'id'> = req.body;
    if (!projectData.title || !projectData.category || !projectData.desc) {
      res.status(400).json({ error: 'Title, category, and description are required' });
      return;
    }

    const currentDb = getDb();
    const newProject: Project = {
      ...projectData,
      id: 'proj-' + Math.random().toString(36).substr(2, 9),
      tags: projectData.tags || [],
      contributors: projectData.contributors || [],
      links: projectData.links || [],
      shade: projectData.shade || 'default'
    };

    currentDb.projects.push(newProject);
    saveDb(currentDb);
    res.status(201).json(newProject);
  });

  app.put('/api/projects/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const currentDb = getDb();
    const projectIndex = currentDb.projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const updatedProject = {
      ...currentDb.projects[projectIndex],
      ...req.body,
      id // prevent id overwrite
    };

    currentDb.projects[projectIndex] = updatedProject;
    saveDb(currentDb);
    res.json(updatedProject);
  });

  app.delete('/api/projects/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const currentDb = getDb();
    const projectIndex = currentDb.projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    currentDb.projects.splice(projectIndex, 1);
    saveDb(currentDb);
    res.json({ success: true });
  });

  app.get('/api/work', (req, res) => {
    const currentDb = getDb();
    res.json(currentDb.work);
  });

  app.post('/api/work', requireAdmin, (req, res) => {
    const workData = req.body;
    if (!workData.role || !workData.company || !workData.desc) {
      res.status(400).json({ error: 'Role, company, and description are required.' });
      return;
    }

    const currentDb = getDb();
    const newWork = {
      ...workData,
      id: 'wrk-' + Math.random().toString(36).substr(2, 9),
      category: workData.category || 'Work'
    };

    currentDb.work.push(newWork);
    saveDb(currentDb);
    res.status(201).json(newWork);
  });

  app.put('/api/work/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const currentDb = getDb();
    const index = currentDb.work.findIndex(w => w.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Work experience not found' });
      return;
    }

    const updatedWork = {
      ...currentDb.work[index],
      ...req.body,
      id
    };

    currentDb.work[index] = updatedWork;
    saveDb(currentDb);
    res.json(updatedWork);
  });

  app.delete('/api/work/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const currentDb = getDb();
    const index = currentDb.work.findIndex(w => w.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Work experience not found' });
      return;
    }

    currentDb.work.splice(index, 1);
    saveDb(currentDb);
    res.json({ success: true });
  });

  app.get('/api/activities', (req, res) => {
    const currentDb = getDb();
    res.json(currentDb.activities);
  });

  app.post('/api/activities', requireAdmin, (req, res) => {
    const activityData = req.body;
    if (!activityData.title || !activityData.category || !activityData.desc) {
      res.status(400).json({ error: 'Title, category, and description are required.' });
      return;
    }

    const currentDb = getDb();
    const newActivity = {
      ...activityData,
      id: 'act-' + Math.random().toString(36).substr(2, 9),
      date: activityData.date || 'Ongoing',
      badge: activityData.badge || 'Activity'
    };

    currentDb.activities.push(newActivity);
    saveDb(currentDb);
    res.status(201).json(newActivity);
  });

  app.put('/api/activities/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const currentDb = getDb();
    const index = currentDb.activities.findIndex(a => a.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    const updatedActivity = {
      ...currentDb.activities[index],
      ...req.body,
      id
    };

    currentDb.activities[index] = updatedActivity;
    saveDb(currentDb);
    res.json(updatedActivity);
  });

  app.delete('/api/activities/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const currentDb = getDb();
    const index = currentDb.activities.findIndex(a => a.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    currentDb.activities.splice(index, 1);
    saveDb(currentDb);
    res.json({ success: true });
  });

  // --- GUESTBOOK / COMMMUNITY BOARD ENDPOINTS ---
  app.get('/api/messages', (req, res) => {
    const currentDb = getDb();
    // Sort youngest first
    const sortedMessages = [...currentDb.messages].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    res.json(sortedMessages);
  });

  app.post('/api/messages', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) {
      res.status(401).json({ error: 'You must be registered or logged in to leave a message.' });
      return;
    }

    const { content } = req.body;
    if (!content || !content.trim()) {
      res.status(400).json({ error: 'Message content is required.' });
      return;
    }

    const currentDb = getDb();
    const newMessage: GuestbookMessage = {
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      authorName: user.name,
      authorEmail: user.email,
      authorRole: user.role,
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    currentDb.messages.push(newMessage);
    saveDb(currentDb);
    res.status(201).json(newMessage);
  });

  app.delete('/api/messages/:id', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const currentDb = getDb();
    const msgIndex = currentDb.messages.findIndex(m => m.id === id);

    if (msgIndex === -1) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    const msg = currentDb.messages[msgIndex];
    // Admins can delete anything; ordinary guests can only delete their own comments
    if (user.role !== 'admin' && user.email !== msg.authorEmail) {
      res.status(403).json({ error: 'Permission denied. You can only delete your own messages.' });
      return;
    }

    currentDb.messages.splice(msgIndex, 1);
    saveDb(currentDb);
    res.json({ success: true });
  });

  // --- INTEGRATE VITE FOR DEVELOPMENT OR SERVE STATICS FOR PRODUCTION ---
  const isVercel = typeof process !== 'undefined' && (process.env.VERCEL === '1' || !!process.env.NOW_REGION);

  if (!isVercel) {
    if (process.env.NODE_ENV !== 'production') {
      createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      }).then((vite) => {
        app.use(vite.middlewares);
        app.listen(PORT, '0.0.0.0', () => {
          console.log(`\n------------------------------------------------`);
          console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
          console.log(`Working Environment: ${process.env.NODE_ENV || 'development'}`);
          console.log(`------------------------------------------------\n`);
        });
      }).catch((err) => {
        console.error("Vite server initialization failed", err);
      });
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });

      app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n------------------------------------------------`);
        console.log(`Production Standalone Server running on port ${PORT}`);
        console.log(`------------------------------------------------\n`);
      });
    }
  }

export default app;
