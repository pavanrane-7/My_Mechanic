import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function MechanicDashboard() {
  const [status, setStatus] = useState("Unknown");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    garageName: "",
    vehicleTypes: [],
  });

  const token = localStorage.getItem("token");

  // Fetch mechanic profile
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/mechanics/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data);

      setStatus(
        response.data.isAvailable
          ? "Available"
          : "Unavailable"
      );
    } catch {
      setMessage("Failed to load profile");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/mechanic-login";
  };

  // Toggle availability
  const toggleAvailability = async () => {
    try {
      const response = await axios.patch(
        "http://localhost:5000/api/mechanics/toggle",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus(
        response.data.isAvailable
          ? "Available"
          : "Unavailable"
      );

      setMessage("Availability updated");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Failed to update");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Input changes
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Save profile
  const saveProfile = async () => {
    try {
      await axios.patch(
        "http://localhost:5000/api/mechanics/profile",
        {
          ...profile,
          vehicleTypes: profile.vehicleTypes
            .toString()
            .split(",")
            .map((v) => v.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated");
      setTimeout(() => setMessage(""), 3000);
      setIsEditing(false);
    } catch {
      setMessage("Update failed");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#111111]">

        {/* Dashboard Card */}
        <div className="bg-[#2C2C2C] text-white p-10 rounded-3xl shadow-2xl w-[550px] border border-gray-700">

          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-4 text-[#A93226]">
            Mechanic Dashboard
          </h1>

          {/* Message */}
          {message && (
            <p className="text-center mb-4 text-green-400">
              {message}
            </p>
          )}

          {/* Status */}
          <p className="text-center text-lg mb-8">
            Status:
            <span
              className={`ml-2 font-bold ${
                status === "Available"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {status}
            </span>
          </p>

          {/* Inputs */}
          {["name", "phone", "garageName"].map((field) => (
            <input
              key={field}
              name={field}
              value={profile[field]}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-4 bg-[#111111] border border-gray-600 rounded-xl mb-4 text-white"
            />
          ))}

          <input
            name="vehicleTypes"
            value={profile.vehicleTypes}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-4 bg-[#111111] border border-gray-600 rounded-xl mb-6 text-white"
          />

          {/* Buttons */}
          <button
            onClick={toggleAvailability}
            className="bg-[#A93226] hover:bg-[#8B1E14] text-white px-6 py-4 rounded-xl w-full mb-4 transition"
          >
            Toggle Availability
          </button>

          {isEditing ? (
            <button
              onClick={saveProfile}
              className="bg-white text-black px-6 py-4 rounded-xl w-full mb-4"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-300 text-black px-6 py-4 rounded-xl w-full mb-4"
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-black border border-red-500 text-red-500 px-6 py-4 rounded-xl w-full"
          >
            Logout
          </button>

        </div>
      </div>
    </>
  );
}

export default MechanicDashboard;