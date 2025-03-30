
// imports
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// variables
const app = express();
const PORT = process.env.PORT || 8000

// middleware


// routes


// startup
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("DB is connected");
    app.listen(PORT, () => {
        console.log(`https//localhost:${PORT}`);
    })
});
