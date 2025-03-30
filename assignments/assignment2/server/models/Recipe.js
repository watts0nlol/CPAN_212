
// models/Recipe.js (Recipe Model)
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: String,
    description: String,
    difficulty: String,
    ingredients: [String],
    steps: [String]
});

module.exports = mongoose.model('Recipe', recipeSchema);
