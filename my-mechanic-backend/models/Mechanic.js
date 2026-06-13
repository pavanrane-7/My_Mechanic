const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    garageName: {
      type: String,
      required: true,
    },

    // Geospatial Field 
    location: {
      type: {
        type: String,
        enum: ["Point"], 
        required: true,
      },
      coordinates: {
        type: [Number], 
        required: true,
      },
    },

    vehicleTypes: [
      {
        type: String, 
      },
    ],

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial Index 
mechanicSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Mechanic", mechanicSchema);
