const express = require("express");
const router = express.Router();

// JWT authentication middleware
const protect = require("../middleware/authMiddleware");

// Controller functions
const {
  registerMechanic,
  loginMechanic,
  getNearbyMechanics,
  toggleAvailability,
  getMechanicProfile,
  updateMechanicProfile,
} = require("../controllers/mechanicController");


// ---------------- PUBLIC ROUTES ----------------

// Register new mechanic
router.post("/register", registerMechanic);

// Login mechanic
router.post("/login", loginMechanic);

// Find nearby mechanics for users
router.get("/nearby", getNearbyMechanics);


// ---------------- PROTECTED ROUTES ----------------
// Requires JWT token

// Toggle mechanic availability
router.patch("/toggle", protect, toggleAvailability);

// Get logged-in mechanic profile
router.get("/profile", protect, getMechanicProfile);

// Update logged-in mechanic profile
router.patch("/profile", protect, updateMechanicProfile);


// Export routes
module.exports = router;