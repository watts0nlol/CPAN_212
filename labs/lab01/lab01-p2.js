import http from "http";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const app = http.createServer((req, res) => {
  if (req.url === "/") {
    res.end("Welcome!");
  } else if (req.url === `/about`) {
    if (req.method === "GET") {
      let webpage = fs.readFileSync("./pages/about.html");
      res.end(webpage);
    }
  } else if (req.url === `/homepage`) {
    let webpage = fs.readFileSync("homepage");
    res.end(webpage);
  } else if (req.url === `/contact`) {
    let webpage = fs.readFileSync("homepage");
    res.end(webpage);
  } else if (req.url === `/register`) {
    let webpage = fs.readFileSync("register");
    res.end(webpage);
  } else {
    res.end("Page not found.");
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
