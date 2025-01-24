/*const http = require("http");
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: 'Hello World!',
    }));
  });
  
  server.listen(8000); */

import http from "http";
import fs from "fs";

const app = http.createServer((req, res) =>{
    if(req.url === '/'){
        let webpage = fs.readFileSync("homepage.html")
        res.end(webpage)

    } else if (req.url === `/about`){
        res.end("about us")
    } else if (req.url === `/user/account/id`) {
        res.end("My name is Harman")
    } else if (req.url === `/about`){
        res.end("page not found")
    } 

});

const PORT = 8000;
app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
});