# POLLIX

Ask. Vote. Instantly.

A simple live polling app. Teachers create polls with a timer, students join and vote in real time. Results show up live and you can see past polls too.

**Stack:** React, Node.js, Express, Socket.io, MongoDB, TypeScript.

---

## What it does

- **Teacher:** Create a question, add options, set a time limit (e.g. 60 seconds). See live results as votes come in. View past polls. Can kick a student and use in-session chat.
- **Student:** Enter your name, wait for the question, vote before time runs out. Timer is synced with the server (e.g. if you join 10 seconds late, you see 50 seconds left). See results after voting.

Polls and votes are saved in MongoDB. If you refresh the page mid-poll, the app recovers state from the server.

---

## Run locally

1. **MongoDB**  
   Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier is enough) or install MongoDB locally. If using Atlas, create a cluster, get the connection string, and put it in `backend/.env` (see `backend/.env.example`).

2. **Install and start**
   ```bash
   npm install
   npm run dev
   ```
   Backend runs on port 4000, frontend on 5173. Open http://localhost:5173 in the browser.

3. **Env (optional)**  
   In `backend/.env`: `MONGO_URI` for your MongoDB URL. Default is `mongodb://127.0.0.1:27017/pollix` if you run MongoDB locally.

---

## Project structure

- **backend/** — Express server, Socket.io, MongoDB (Mongoose). Poll and vote models, poll service, socket handler.
- **frontend/** — React app (Vite). Role selection, name entry, poll creation, live poll view, history, chat, participants.

Polls and votes are stored in MongoDB. Participants list, kicked users, and chat are in-memory only (lost on server restart).
