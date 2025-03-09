import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173" })); // Allow Vite frontend
app.use(express.json());

// Temporary storage for registered users
const users = [];

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is working without proxies!" });
});

// Register Route
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Check if the user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already registered" });
  }

  // Save the new user
  users.push({ email, password });
  console.log("Registered Users:", users);

  res.json({ message: "Registration successful! You can now log in." });
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = users.find((user) => user.email === email && user.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({ message: "Login successful!" });
});

// Server setup
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
