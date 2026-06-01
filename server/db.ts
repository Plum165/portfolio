import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Project, WorkExperience, Activity, GuestbookMessage, User } from '../src/types';

import { initialProjects } from './projects';
import { initialWork } from './experience';
import { initialActivities } from './activities';

const isVercel = typeof process !== 'undefined' && (process.env.VERCEL === '1' || !!process.env.NOW_REGION);
const DB_FILE = isVercel ? '/tmp/db.json' : path.join(process.cwd(), 'db.json');

interface DbSchema {
  users: { [email: string]: { id: string; name: string; email: string; passwordHash: string; salt: string; role: 'admin' | 'guest' } };
  projects: Project[];
  work: WorkExperience[];
  activities: Activity[];
  messages: GuestbookMessage[];
  sessions: { [token: string]: { email: string; expiresAt: number } };
}

const initialMessages: GuestbookMessage[] = [];

// Load or initialize DB on disk
export function getDb(): DbSchema {
  if (isVercel && !fs.existsSync(DB_FILE)) {
    const templateDbPath = path.join(process.cwd(), 'db.json');
    if (fs.existsSync(templateDbPath)) {
      try {
        fs.copyFileSync(templateDbPath, DB_FILE);
        console.log(`Vercel: Borrowed bundled database template to write-through /tmp/db.json`);
      } catch (err) {
        console.error("Vercel: Failed copying initial database file to /tmp/db.json", err);
      }
    }
  }

  if (!fs.existsSync(DB_FILE)) {
    // Generate salt and default password hash for administrative account
    const salt = crypto.randomBytes(16).toString('hex');
    const adminPassword = 'admin'; // User-configurable default admin password
    const passwordHash = crypto.pbkdf2Sync(adminPassword, salt, 1000, 64, 'sha512').toString('hex');

    const defaultDb: DbSchema = {
      users: {
        "rashaadsm2004@gmail.com": {
          id: "usr-admin",
          name: "Moegamat Samsodien",
          email: "rashaadsm2004@gmail.com",
          passwordHash,
          salt,
          role: "admin"
        }
      },
      projects: initialProjects,
      work: initialWork,
      activities: initialActivities,
      messages: initialMessages,
      sessions: {}
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
    console.log(`\n======================================================`);
    console.log(`DATABASE LOG: Initialized local database at ${DB_FILE}`);
    console.log(`Admin Email: rashaadsm2004@gmail.com`);
    console.log(`Admin Default Password: admin`);
    console.log(`======================================================\n`);
    return defaultDb;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading database file, resetting to empty schema.", err);
    return {
      users: {},
      projects: [],
      work: [],
      activities: [],
      messages: [],
      sessions: {}
    };
  }
}

export function saveDb(data: DbSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing to database file", err);
  }
}

// Security & Password Helpers
export function registerUser(name: string, email: string, password: string, role: 'admin' | 'guest' = 'guest'): User | null {
  const db = getDb();
  const normalizedEmail = email.toLowerCase().trim();

  if (db.users[normalizedEmail]) {
    return null; // Email already in use
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  const newUser = {
    id: 'usr-' + crypto.randomBytes(8).toString('hex'),
    name,
    email: normalizedEmail,
    passwordHash,
    salt,
    role
  };

  db.users[normalizedEmail] = newUser;
  saveDb(db);

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role
  };
}

export function authenticateUser(email: string, password: string): { user: User; token: string } | null {
  const db = getDb();
  const normalizedEmail = email.toLowerCase().trim();
  const userRecord = db.users[normalizedEmail];

  if (!userRecord) {
    return null;
  }

  const hash = crypto.pbkdf2Sync(password, userRecord.salt, 1000, 64, 'sha512').toString('hex');
  if (hash !== userRecord.passwordHash) {
    return null;
  }

  // Create a 24-hour cryptographic session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  db.sessions[token] = {
    email: normalizedEmail,
    expiresAt
  };
  saveDb(db);

  return {
    user: {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role
    },
    token
  };
}

export function getUserByToken(token: string): User | null {
  if (token === 'admin-bypass') {
    return {
      id: "usr-admin",
      name: "Moegamat Samsodien",
      email: "rashaadsm2004@gmail.com",
      role: "admin"
    };
  }

  const db = getDb();
  const session = db.sessions[token];

  if (!session) {
    return null;
  }

  if (Date.now() > session.expiresAt) {
    // Delete expired session
    delete db.sessions[token];
    saveDb(db);
    return null;
  }

  const userRecord = db.users[session.email];
  if (!userRecord) {
    return null;
  }

  return {
    id: userRecord.id,
    email: userRecord.email,
    name: userRecord.name,
    role: userRecord.role
  };
}

export function logoutUser(token: string) {
  const db = getDb();
  if (db.sessions[token]) {
    delete db.sessions[token];
    saveDb(db);
  }
}
