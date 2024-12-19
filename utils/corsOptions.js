export const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://commercify-client-5bjr.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
