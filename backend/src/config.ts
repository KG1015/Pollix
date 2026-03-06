export const config = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  mongoUri: process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/pollix",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
