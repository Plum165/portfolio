# Moegamat Samsodien — Portfolio

A full-stack personal portfolio website with built-in user authentication, an admin-managed content system (projects, work experience, activities), and a guestbook/message board.

## Features

- **Project showcase** — browse academic and personal projects, filterable by theme/category
- **Work experience & activities** — sections for professional experience and extracurricular activities
- **Admin dashboard** (`/admin`) — add, edit, and delete projects, work entries, and activities
- **Authentication** — register/login with JWT-based sessions
- **Guestbook** — authenticated visitors can leave messages
- **Gemini-powered features** — uses the Google Gemini API (`@google/genai`) for AI-assisted functionality

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, lucide-react
- **Backend**: Express.js (Node.js), running as a local server in development and as Vercel serverless functions in production
- **Database**: JSON-file-based store (`db.json`)
- **Deployment**: Vercel

See [ARCHITECTURE.md](ARCHITECTURE.md) for a detailed breakdown of the folder structure, API routes, and how to extend the app with new data categories.

## Getting Started

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set your `GEMINI_API_KEY` (get one from [Google AI Studio](https://aistudio.google.com/)):
   ```bash
   cp .env.example .env.local
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   This runs the Express API on `http://localhost:3000` with the Vite dev server for the frontend.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the frontend for production |
| `npm run start` | Run the production server from `dist/` |
| `npm run lint` | Type-check the project with `tsc` |
| `npm run clean` | Remove the `dist/` build output |

## Deployment

The app is deployed on Vercel: `vercel.json` rewrites `/api/*` requests to the serverless handler in `api/index.ts` and serves the admin dashboard at `/admin`. See the [deployment checklist](ARCHITECTURE.md#deployment-checklist) in `ARCHITECTURE.md` before pushing changes that add new data types or routes.
