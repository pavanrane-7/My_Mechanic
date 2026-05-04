import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import heroImg from "../assets/hero.png";

function MechanicLogin() {
  const navigate = useNavigate();

  // Toggle login / register
  const [isRegister, setIsRegister] = useState(false);

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    garageName: "",
    latitude: "",
    longitude: "",
    vehicleTypes: "",
  });

  // Handle register input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/mechanics/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  // ---------------- REGISTER ----------------
  const handleRegister = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/mechanics/register",
        {
          ...formData,
          email,
          password,
          vehicleTypes: formData.vehicleTypes
            .split(",")
            .map((v) => v.trim()),
        }
      );

      const response = await axios.post(
        "http://localhost:5000/api/mechanics/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");

    } catch {
      alert("Registration failed");
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="min-h-screen bg-black/75 flex items-center justify-center px-4">

          {/* Main Login/Register Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl w-[480px] max-h-[85vh] overflow-y-auto p-10 mt-20">

            {/* Dynamic heading */}
            <h2 className="text-4xl font-bold text-white text-center mb-2">
              {isRegister ? "Join My Mechanic" : "Welcome Back"}
            </h2>

            <p className="text-gray-300 text-center mb-8">
              {isRegister
                ? "Create your mechanic account"
                : "Login to your dashboard"}
            </p>

            {/* Registration-only fields */}
            {isRegister && (
              <>
                <input
                  name="name"
                  placeholder="Full Name"
                  className="w-full p-4 rounded-xl mb-4 bg-white/90"
                  onChange={handleChange}
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  className="w-full p-4 rounded-xl mb-4 bg-white/90"
                  onChange={handleChange}
                />

                <input
                  name="garageName"
                  placeholder="Garage Name"
                  className="w-full p-4 rounded-xl mb-4 bg-white/90"
                  onChange={handleChange}
                />

                {/* Latitude */}
                <input
                  name="latitude"
                  placeholder="Latitude"
                  className="w-full p-4 rounded-xl mb-4 bg-white/90"
                  onChange={handleChange}
                />

                {/* Longitude */}
                <input
                  name="longitude"
                  placeholder="Longitude"
                  className="w-full p-4 rounded-xl mb-4 bg-white/90"
                  onChange={handleChange}
                />

                <input
                  name="vehicleTypes"
                  placeholder="car,bike"
                  className="w-full p-4 rounded-xl mb-4 bg-white/90"
                  onChange={handleChange}
                />
              </>
            )}

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 rounded-xl mb-4 bg-white/90"
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-xl mb-6 bg-white/90"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Submit button */}
            <button
              onClick={isRegister ? handleRegister : handleLogin}
              className="w-full bg-[#A93226] hover:bg-[#8B1E14] text-white py-4 rounded-xl font-bold transition"
            >
              {isRegister ? "Create Account" : "Login"}
            </button>

            {/* Toggle login/register */}
            <p className="text-center mt-6 text-gray-300">
              {isRegister
                ? "Already have an account?"
                : "New mechanic?"}

              <button
                onClick={() => setIsRegister(!isRegister)}
                className="ml-2 text-[#A93226] font-semibold"
              >
                {isRegister ? "Login" : "Register"}
              </button>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}

export default MechanicLogin;