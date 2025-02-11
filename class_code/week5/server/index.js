import express from "express";
import cors from "cors";


const app = express();
const PORT = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Welcome to our server");
});

app.get("/data", (req, res) => {
  const data = {
    fname: "Grug",
    lname: "Rockman"

  }
  res.send(data);
});
app.post("/login", (req, res) => {
  console.log(req.body)
  res.send("Data Gone :(")
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.use("", (req, res) => {
  res.status(404).send("Page not found");
});
