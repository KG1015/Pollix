# Deploying POLLIX

You need to deploy two parts: **backend** (Node + Socket.io) and **frontend** (Vite/React). The database (MongoDB Atlas) is already in the cloud; you only need to set `MONGO_URI` on the backend.

A simple option is **Render** (free tier): one Web Service for the backend and one Static Site for the frontend.

---

## 1. MongoDB Atlas

- You already have a cluster. In Atlas: **Network Access** → allow **0.0.0.0/0** (so Render can connect), or add Render’s IPs if you use “Restrict access”.
- **Database Access** → your user must have read/write on the database.
- Copy your **connection string** (e.g. `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`). Replace `<password>` with the real password. You’ll use this as `MONGO_URI` on the backend.

---

## 2. Deploy backend on Render

1. Go to [render.com](https://render.com) and sign up / log in.
2. **New** → **Web Service**.
3. Connect your GitHub repo (the one that contains POLLIX).
4. Configure:
   - **Name:** e.g. `pollix-api`
   - **Root Directory:** leave empty (repo root).
   - **Runtime:** Node.
   - **Build Command:** `npm install && npm run build -w backend`
   - **Start Command:** `npm run start -w backend`  
     (Or if you don’t use workspaces from root: set **Root Directory** to `backend` and use `npm install && npm run build` / `npm start`.)
   - **Instance type:** Free (or paid if you prefer).

5. **Environment** (Environment Variables):
   - `MONGO_URI` = your Atlas connection string (with real password).
   - `PORT` = `4000` (Render sets `PORT` automatically; your app already uses `process.env.PORT`).
   - `CORS_ORIGIN` = your **frontend** URL (you’ll set this after deploying the frontend, e.g. `https://pollix-app.onrender.com`). You can add/update it later.

6. Click **Create Web Service**. Wait until the service is live.
7. Copy the backend URL, e.g. `https://pollix-api.onrender.com`. You’ll need it for the frontend and for `CORS_ORIGIN`.

---

## 3. Deploy frontend on Render (Static Site)

1. **New** → **Static Site**.
2. Connect the same GitHub repo.
3. Configure:
   - **Name:** e.g. `pollix-app`
   - **Root Directory:** leave empty.
   - **Build Command:** `npm install && npm run build -w frontend`
   - **Publish Directory:** `frontend/dist`  
     (Vite builds into `frontend/dist` by default. If your build output is different, change this.)

4. **Environment** (Environment Variables):
   - `VITE_API_URL` = your **backend** URL from step 2, e.g. `https://pollix-api.onrender.com`  
     (No trailing slash. The app uses this for `/api/*` and Socket.io.)

5. Click **Create Static Site**. Wait until the site is live.
6. Copy the frontend URL, e.g. `https://pollix-app.onrender.com`.

---

## 4. Point backend CORS to frontend

1. In Render, open your **backend** Web Service.
2. **Environment** → set **CORS_ORIGIN** to your frontend URL, e.g. `https://pollix-app.onrender.com`.
3. Save. Render will redeploy. After that, the browser will allow requests from your frontend to the backend.

---

## 5. Optional: deploy frontend on Vercel instead

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo.
2. **Root Directory:** `frontend`.
3. **Framework Preset:** Vite.
4. **Build Command:** `npm run build` (run from `frontend`).
5. **Output Directory:** `dist`.
6. **Environment Variable:** `VITE_API_URL` = your backend URL (e.g. `https://pollix-api.onrender.com`).
7. Deploy. Then set **CORS_ORIGIN** on the backend to your Vercel URL (e.g. `https://your-project.vercel.app`).

---

## Summary

| Part       | Where   | Env / config |
|-----------|--------|---------------|
| Database  | Atlas  | Already set up; use same `MONGO_URI` on backend. |
| Backend   | Render (Web Service) | `MONGO_URI`, `CORS_ORIGIN` (frontend URL). |
| Frontend  | Render (Static Site) or Vercel | `VITE_API_URL` (backend URL). |

After deploy, open the frontend URL. Choose Teacher or Student and use the app; polls and votes are stored in Atlas, and real-time updates use Socket.io to your backend.
