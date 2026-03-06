# Connect POLLIX to MongoDB Atlas (cloud)

## 1. Get your Atlas connection string

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Open your **project** → click your **cluster** (e.g. Cluster0).
3. Click **Connect** → choose **Drivers** or **Connect your application**.
4. Copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace **`<username>`** with your Atlas database username.
6. Replace **`<password>`** with your Atlas database password (the one you set for that user).
7. Optional: add a database name before the `?` so the app uses a dedicated DB, e.g.:
   ```
   mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/pollix?retryWrites=true&w=majority
   ```
   (If you don’t add `/pollix`, the app will still create a `pollix` database when it runs.)

## 2. Add the connection string to the app

1. Open the **`backend`** folder of the POLLIX project.
2. Create a new file named **`.env`** (exactly that name, with the dot at the start).
3. Put this line in `.env` (paste your real URI, no quotes needed unless it has spaces):
   ```
   MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/pollix?retryWrites=true&w=majority
   ```
4. Save the file.

**Important:** If your password has special characters (e.g. `#`, `@`, `%`), encode them in the URI or wrap the whole value in single quotes in `.env`.

## 3. Run the app

From the **project root** (the Pollix folder that contains both `frontend` and `backend`):

```bash
npm install
npm run dev
```

The backend will connect to Atlas. When you create polls and vote, data will be stored in your Atlas cluster. You can see it in Atlas under **Database → Browse Collections**, or in MongoDB Compass by connecting with the same URI.
