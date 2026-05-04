const Mechanic = require("../models/Mechanic");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// =============================================
// REGISTER MECHANIC
// =============================================
const registerMechanic = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      garageName,
      latitude,
      longitude,
      vehicleTypes,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !garageName ||
      !latitude ||
      !longitude
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if mechanic already exists
    const existingMechanic =
      await Mechanic.findOne({ email });

    if (existingMechanic) {
      return res.status(400).json({
        message: "Mechanic already exists",
      });
    }

    // Encrypt password before saving
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create new mechanic
    const mechanic = await Mechanic.create({
      name,
      email,
      password: hashedPassword,
      phone,
      garageName,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      vehicleTypes,
    });

    res.status(201).json({
      message: "Mechanic registered successfully",
      mechanic,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// =============================================
// LOGIN MECHANIC
// =============================================
const loginMechanic = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find mechanic
    const mechanic =
      await Mechanic.findOne({ email });

    if (!mechanic) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(
      password,
      mechanic.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: mechanic._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      mechanicId: mechanic._id,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// =============================================
// FIND NEARBY MECHANICS
// Uses MongoDB geospatial query
// =============================================
const getNearbyMechanics = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      vehicleType,
    } = req.query;

    const mechanics = await Mechanic.find({
      isAvailable: true,
      vehicleTypes: vehicleType,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude),
            ],
          },
          $maxDistance: 10000,
        },
      },
    });

    res.status(200).json(mechanics);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// =============================================
// TOGGLE AVAILABILITY
// =============================================
const toggleAvailability = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(
      req.mechanic.id
    );

    if (!mechanic) {
      return res.status(404).json({
        message: "Mechanic not found",
      });
    }

    mechanic.isAvailable =
      !mechanic.isAvailable;

    await mechanic.save();

    res.status(200).json({
      message: "Availability updated",
      isAvailable: mechanic.isAvailable,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// =============================================
// GET LOGGED-IN MECHANIC PROFILE
// =============================================
const getMechanicProfile = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(
      req.mechanic.id
    );

    if (!mechanic) {
      return res.status(404).json({
        message: "Mechanic not found",
      });
    }

    res.status(200).json(mechanic);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// =============================================
// UPDATE PROFILE
// =============================================
const updateMechanicProfile = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(
      req.mechanic.id
    );

    if (!mechanic) {
      return res.status(404).json({
        message: "Mechanic not found",
      });
    }

    mechanic.name =
      req.body.name || mechanic.name;

    mechanic.phone =
      req.body.phone || mechanic.phone;

    mechanic.garageName =
      req.body.garageName ||
      mechanic.garageName;

    mechanic.vehicleTypes =
      req.body.vehicleTypes ||
      mechanic.vehicleTypes;

    await mechanic.save();

    res.status(200).json({
      message: "Profile updated",
      mechanic,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// =============================================
// EXPORT CONTROLLERS
// =============================================
module.exports = {
  registerMechanic,
  loginMechanic,
  getNearbyMechanics,
  toggleAvailability,
  getMechanicProfile,
  updateMechanicProfile,
};