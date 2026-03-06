# POLLIX – Step-by-step deployment

Deploy **backend on Render** and **frontend on Vercel**. Use your existing MongoDB Atlas for the database.

---

# Part 1: Backend on Render

## Step 1.1 – MongoDB Atlas (quick check)

1. Open [cloud.mongodb.com](https://cloud.mongodb.com) and log in.
2. **Network Access** → ensure you have an entry that allows access (e.g. **0.0.0.0/0** or “Allow access from anywhere”). If not, click **Add IP Address** → **Allow access from anywhere** → Confirm.
3. **Database** → **Connect** → **Connect your application** → copy the connection string. It looks like:
   `mongodb+srv://USERNAME:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
4. Replace `<password>` with your actual database user password. Keep this string; you’ll use it as `MONGO_URI` on Render.

---

## Step 1.2 – Create the backend service on Render

1. Go to [render.com](https://render.com) and sign up or log in (e.g. with GitHub).
2. Click **Dashboard** (if you’re not already there).
3. Click **New +** (top right) → **Web Service**.
4. Under **Connect a repository**, find your POLLIX repo and click **Connect**. If it’s not listed, click **Configure account** and give Render access to the right GitHub account/repos, then connect the POLLIX repo.
5. After the repo is connected, you’ll see the configuration form. Fill it like this:

| Field | Value |
|-------|--------|
| **Name** | `pollix-api` (or any name you like) |
| **Region** | Choose the one closest to you (e.g. Oregon) |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | Leave **empty** |
| **Runtime** | **Node** |
| **Build Command** | `npm install && npm run build -w backend` |
| **Start Command** | `npm run start -w backend` |
| **Instance Type** | **Free** (or paid if you prefer) |

6. Scroll to **Environment Variables**. Click **Add Environment Variable** and add:

| Key | Value |
|-----|--------|
| `MONGO_URI` | Your full Atlas connection string (from Step 1.1), with the real password. |
| `CORS_ORIGIN` | Leave empty for now. You’ll set it to your frontend URL after deploying the frontend (e.g. `https://pollix-xxx.vercel.app`). |

You can add `CORS_ORIGIN` later and redeploy.

7. Click **Create Web Service**. Render will clone the repo, run the build, then start the app.
8. Wait until the status is **Live** (green). If the build or start fails, open the **Logs** tab and fix any errors.
9. At the top of the page you’ll see the service URL, e.g. `https://pollix-api.onrender.com`. **Copy this URL** – this is your **backend URL**. You’ll use it for the frontend and for `CORS_ORIGIN`.

---

# Part 2: Frontend on Vercel

## Step 2.1 – Deploy the frontend

1. Go to [vercel.com](https://vercel.com) and sign up or log in (e.g. with GitHub).
2. Click **Add New…** → **Project**.
3. **Import** your POLLIX GitHub repo. If you don’t see it, adjust Vercel’s GitHub access and try again.
4. You’ll see **Configure Project**. Set:

| Field | Value |
|-------|--------|
| **Framework Preset** | Vite (Vercel usually detects it; if not, choose Vite) |
| **Root Directory** | Click **Edit** → set to `frontend` → **Continue** |
| **Build Command** | Leave default (`npm run build` or `vite build`) |
| **Output Directory** | Leave default (`dist`) |
| **Install Command** | Leave default (`npm install`) |

5. Under **Environment Variables**, add one variable:

| Name | Value |
|------|--------|
| `VITE_API_URL` | Your **backend URL** from Part 1 (e.g. `https://pollix-api.onrender.com`) – **no trailing slash** |

6. Click **Deploy**. Wait until the deployment finishes.
7. When it’s done, you’ll see a success screen and a URL like `https://pollix-xxxx.vercel.app`. **Copy this URL** – this is your **frontend URL**.

---

# Part 3: Connect frontend and backend (CORS)

1. Go back to **Render** → open your **backend** Web Service (e.g. `pollix-api`).
2. Go to the **Environment** tab.
3. Add or edit the variable:
   - **Key:** `CORS_ORIGIN`
   - **Value:** Your **frontend URL** from Part 2 (e.g. `https://pollix-xxxx.vercel.app`) – no trailing slash.
4. Save. Render will redeploy the backend. Wait until it’s **Live** again.

After this, the browser will allow your frontend to call the backend and Socket.io.

---

# Part 4: Test the app

1. Open your **frontend URL** (e.g. `https://pollix-xxxx.vercel.app`) in the browser.
2. Choose **Teacher** or **Student** and go through the flow (create a poll, vote, etc.).
3. If something fails:
   - **Backend:** Check Render **Logs** for errors.
   - **Frontend:** Check browser **Developer Tools** → **Console** and **Network** for errors or blocked requests.
   - **CORS:** If you see CORS errors, double-check `CORS_ORIGIN` on Render matches the frontend URL exactly (same scheme and no trailing slash).

---

# Quick reference

| What | Where | Important env / config |
|------|--------|-------------------------|
| Database | MongoDB Atlas | Connection string → `MONGO_URI` on backend. |
| Backend | Render → Web Service | `MONGO_URI`, `CORS_ORIGIN` = frontend URL. |
| Frontend | Vercel → Project (root `frontend`) | `VITE_API_URL` = backend URL. |

- **Backend URL** = Render Web Service URL (e.g. `https://pollix-api.onrender.com`).
- **Frontend URL** = Vercel deployment URL (e.g. `https://pollix-xxxx.vercel.app`).
