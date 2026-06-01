export interface Contributor {
  name: string;
  link?: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'hackathon' | 'coursework' | 'side' | 'academic';
  date: string;
  badge: string;
  desc: string;
  tags: string[];
  contributors?: Contributor[];
  links?: ProjectLink[];
  shade?: 'hackathon' | 'academic' | 'coursework' | 'side' | 'default';
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  duration: string;
  desc: string;
  category: string;
}

export interface Activity {
  id: string;
  title: string;
  category: 'sport' | 'volunteer';
  date: string;
  badge: string;
  desc: string;
}

export interface GuestbookMessage {
  id: string;
  authorName: string;
  authorEmail: string;
  authorRole: 'admin' | 'guest';
  content: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'guest';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface Theme {
  id: string;
  label: string;
  c1: string; // Left/Top gradient color
  c2: string; // Right/Bottom gradient color
}
