import express from "express"
import lab_router from "./routers/lab_routers.js"

const app = express();
const PORT = process.env.PORT || 8000;

// imported routes
// -> localhost:8000/lab
app.use("/lab", lab_router)

app.get("/", (req, res) => {
    res.send("Welcome to the server!")
});

app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`)

});