# POLLIX — Ask. Vote. Instantly

Live polling system with Teacher and Student roles. Built with React, Node.js, Socket.io, and MongoDB.

## Database & storage

**Stored in MongoDB (persistent):**

| What            | Where              | Details                                                                 |
|-----------------|--------------------|-------------------------------------------------------------------------|
| **Polls**       | `poll` collection  | Question, options, `durationSeconds`, `startedAt`, `status` (draft/live/ended). |
| **Votes**       | `vote` collection  | One document per student per poll: `pollId`, `studentId` (name), `optionIndex`. Enforces one vote per student per poll. |

- **Database:** MongoDB  
- **Connection:** `MONGO_URI` in env (default: `mongodb://127.0.0.1:27017/pollix`).  
- **Poll history** (View poll history) is loaded from the DB; only **ended** polls are shown.

**In memory only (lost on server restart):**

- **Participants list** — who is currently in the session (student names).
- **Kicked students** — list of kicked names (so they can’t rejoin until server restarts).
- **Chat messages** — not saved; only broadcast in real time.
- **Active poll state** — which poll is “live” and timer; recovered from DB on startup only if you reimplement that.

So: **polls and votes are in the database**; participants, kicked list, and chat are **not** stored in the DB.

## Setup

1. **MongoDB**  
   Use **MongoDB Atlas** (no install) or run MongoDB locally.

2. **Using MongoDB Atlas (see your data in the browser)**
   - In [MongoDB Atlas](https://www.mongodb.com/cloud/atlas): create a free cluster if needed.
   - Go to **Database** → **Connect** → **Connect your application** → copy the connection string (looks like `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/`).
   - Replace `<password>` in that string with your database user password. Keep the rest (e.g. `pollix`) or add `?retryWrites=true&w=majority` at the end.
   - In the project: go to the `backend` folder, copy `.env.example` to a new file named `.env`, and set:
     ```bash
     MONGO_URI=paste_your_atlas_connection_string_here
     ```
   - Run the app (see below). When you create polls and vote, data is saved to Atlas. In Atlas, open **Database** → **Browse Collections** to see the `pollix` database and the `polls` and `votes` collections.

3. **Install and run**
   ```bash
   npm install
   npm run dev
   ```
   This starts the backend on port 4000 and the frontend on port 5173. The frontend proxies `/api` and `/socket.io` to the backend.

4. **Env (optional)**
   - `PORT` — backend port (default 4000)
   - `MONGO_URI` — MongoDB URL (default `mongodb://127.0.0.1:27017/pollix`; use Atlas URI in `.env` to use Atlas)
   - `CORS_ORIGIN` — frontend origin (default `http://localhost:5173`)

## Flow

- **Teacher:** Choose role → Create poll (question, options, timer) → See live results → View poll history → Add new question (only when no active poll or everyone has answered). Can remove a student and use chat.
- **Student:** Choose role → Enter name → Wait for question → Answer (timer synced with server) → See results. Can be kicked by teacher; Rejoin resets to role selection.

## File names (as requested)

- **Backend:** `PollSocketHandler.ts`, `PollService.ts`, `pollController.ts`, `server.ts`, `config.ts`, models `poll.ts`, `vote.ts`.
- **Frontend:** `useSocket.ts`, `usePollTimer.ts`, and project-based names: `Brand`, `RoleSelect`, `NameEntry`, `CreatePoll`, `LivePoll`, `WaitForQuestion`, `AnswerQuestion`, `PollHistory`, `KickedOut`, `Chat`, `Participants`, `App`, `theme`.
