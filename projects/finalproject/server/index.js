import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173" })); // Allow Vite frontend
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is working without proxies!" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});