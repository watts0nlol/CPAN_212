import http from "http";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const app = http.createServer((req, res) => {
  if (req.url === "/") {
    let webpage = fs.readFileSync("./pages/welcome.html");
    res.end(webpage);
  } 
  else if (req.url === `/homepage`) {
    if (req.method === "GET") {
      let webpage = fs.readFileSync("./pages/homepage.html");
      res.end(webpage);
    }
  } 
  else if (req.url === `/about`) {
    if (req.method === "GET") {
      let webpage = fs.readFileSync("./pages/about.html");
      res.end(webpage);
    }
  }
  else if (req.url === `/register`) {
    if (req.method === "GET") {
      let webpage = fs.readFileSync("./pages/register.html");
      res.end(webpage);
    }
  }
  else {
      (req.method === "GET") 
      let webpage = fs.readFileSync("./pages/notfound.html");
      res.end(webpage);
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
