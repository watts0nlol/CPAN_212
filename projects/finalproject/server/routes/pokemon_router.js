const express = require("express");
const Team = require("../models/Team");

const router = express.Router();

// Save a new team to MongoDB
router.post("/api/save-team", async (req, res) => {
  try {
    const newTeam = new Team({ team: req.body.team });
    await newTeam.save();
    res.status(201).json({ message: "Team saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save team." });
  }
});

// Get all saved teams
router.get("/api/get-teams", async (req, res) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch teams." });
  }
});

// Delete a team
router.delete("/api/delete-team/:id", async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Team deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete team." });
  }
});

// Update a team
router.put("/api/update-team/:id", async (req, res) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { team: req.body.team },
      { new: true }
    );
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: "Failed to update team." });
  }
});

module.exports = router;
