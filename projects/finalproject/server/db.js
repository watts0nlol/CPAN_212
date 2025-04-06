const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/pokemon_teams"; 
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

module.exports = mongoose;
