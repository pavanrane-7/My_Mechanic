import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function MechanicDashboard() {
  // Availability status
  const [status, setStatus] = useState("Unknown");

  // Edit mode toggle
  const [isEditing, setIsEditing] = useState(false);

  // Success / Error messages
  const [message, setMessage] = useState("");

  // Mechanic profile data
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    garageName: "",
    vehicleTypes: [],
  });

  // JWT token
  const token = localStorage.getItem("token");

  // ---------------- FETCH PROFILE ----------------
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

  // Load profile when dashboard opens
  useEffect(() => {
    fetchProfile();
  }, []);

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/mechanic-login";
  };

  // ---------------- TOGGLE AVAILABILITY ----------------
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
      setMessage("Failed to update status");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- SAVE PROFILE ----------------
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

      setMessage("Profile updated successfully");
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

      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-[500px]">

          {/* Dashboard Title */}
          <h1 className="text-3xl font-bold mb-4 text-center">
            Mechanic Dashboard
          </h1>

          {/* Inline Message */}
          {message && (
            <p className="text-center mb-4 font-medium text-blue-600">
              {message}
            </p>
          )}

          {/* Availability Status */}
          <p className="mb-6 text-lg text-center">
            Status:
            <span
              className={
                status === "Available"
                  ? " text-green-600 font-bold"
                  : " text-red-600 font-bold"
              }
            >
              {" "}{status}
            </span>
          </p>

          {/* Profile Fields */}
          {["name", "phone", "garageName"].map((field) => (
            <input
              key={field}
              name={field}
              value={profile[field]}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-3 border rounded-lg mb-4"
            />
          ))}

          {/* Vehicle Types */}
          <input
            name="vehicleTypes"
            value={profile.vehicleTypes}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-3 border rounded-lg mb-6"
          />

          {/* Toggle Availability */}
          <button
            onClick={toggleAvailability}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full mb-4"
          >
            Toggle Availability
          </button>

          {/* Edit / Save Button */}
          {isEditing ? (
            <button
              onClick={saveProfile}
              className="bg-green-600 text-white px-6 py-3 rounded-lg w-full mb-4"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg w-full mb-4"
            >
              Edit Profile
            </button>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-3 rounded-lg w-full"
          >
            Logout
          </button>

        </div>
      </div>
    </>
  );
}

export default MechanicDashboard;