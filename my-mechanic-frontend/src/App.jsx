import Footer from "./components/Footer";
import heroImg from "./assets/hero.png";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [mechanics, setMechanics] = useState([]);
  const [vehicleType, setVehicleType] = useState("");
  const [searched, setSearched] = useState(false);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setError("Location access denied");
      }
    );
  }, []);

  // Fetch nearby mechanics
  const fetchMechanics = async () => {
    if (!vehicleType) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/mechanics/nearby?latitude=${location.latitude}&longitude=${location.longitude}&vehicleType=${vehicleType}`
      );

      setMechanics(response.data);
      setSearched(true);

      // Reset selection after search
      setVehicleType("");
    } catch (error) {
      console.error(error);
    }
  };

  // Reset search
  const resetSearch = () => {
    setSearched(false);
    setMechanics([]);
    setVehicleType("");
  };

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <div
        className="min-h-screen bg-cover bg-center flex flex-col"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="bg-black/65 min-h-screen flex flex-col items-center justify-center px-6 pt-20">

          <h1 className="text-5xl font-bold text-white text-center mb-4">
            Find Nearby Mechanics
          </h1>

          <p className="text-gray-200 text-lg mb-10 text-center">
            Instant roadside help for bikes and cars
          </p>

          {/* SEARCH PANEL */}
          {!searched && (
            <div className="flex flex-col items-center justify-center">

              {/* Vehicle Buttons */}
              <div className="flex gap-6 mb-8">
                {["car", "bike"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setVehicleType(type)}
                    className={`px-8 py-3 rounded-xl font-semibold border transition-all duration-300 ${
                      vehicleType === type
                        ? "bg-[#A93226] text-white border-[#A93226]"
                        : "bg-white text-black border-white hover:bg-[#A93226] hover:text-white hover:border-[#A93226]"
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Search Button */}
              <button
                onClick={fetchMechanics}
                className="bg-[#A93226] hover:bg-[#8B1E14] text-white px-10 py-4 rounded-xl font-bold transition"
              >
                Find Nearby Mechanic
              </button>
            </div>
          )}

          {/* RESULTS */}
          {searched && (
            <div className="w-full max-w-6xl">

              <div className="text-center mb-8">
                <button
                  onClick={resetSearch}
                  className="bg-[#2C2C2C] hover:bg-[#111111] text-white px-6 py-3 rounded-lg transition"
                >
                  New Search
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mechanics.length > 0 ? (
                  mechanics.map((mechanic) => (
                    <div
                      key={mechanic._id}
                      className="bg-white border-l-4 border-[#A93226] p-6 rounded-2xl shadow-lg"
                    >
                      <h2 className="text-2xl font-bold mb-3 text-[#A93226]">
                        {mechanic.garageName}
                      </h2>

                      <p><strong>Mechanic:</strong> {mechanic.name}</p>
                      <p><strong>Phone:</strong> {mechanic.phone}</p>
                      <p><strong>Vehicle:</strong> {mechanic.vehicleTypes.join(", ")}</p>

                      <p
                        className={`mt-3 font-bold ${
                          mechanic.isAvailable
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {mechanic.isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-white text-center text-xl">
                    No mechanics found
                  </p>
                )}
              </div>
            </div>
          )}

          {!location && (
            <p className="text-white mt-6">
              {error || "Fetching location..."}
            </p>
          )}
        </div>
      </div>

      {/* ABOUT SECTION */}
      <section className="bg-[#111111] py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-4xl font-bold text-white mb-6">
            Why Choose My Mechanic?
          </h2>

          <p className="text-lg text-gray-300 mb-14 max-w-3xl mx-auto">
            My Mechanic connects stranded vehicle owners with nearby verified
            mechanics instantly. Whether you're stuck with a puncture, engine issue,
            or roadside emergency, help is just a few clicks away.
          </p>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-[#A93226]">
              <h3 className="text-2xl font-semibold mb-4 text-[#A93226]">
                Instant Location Access
              </h3>
              <p className="text-black">
                Automatically detects your location to find nearby mechanics.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-[#A93226]">
              <h3 className="text-2xl font-semibold mb-4 text-[#A93226]">
                Verified Mechanics
              </h3>
              <p className="text-black">
                Connect with trusted registered mechanics for fast assistance.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-[#A93226]">
              <h3 className="text-2xl font-semibold mb-4 text-[#A93226]">
                Fast Roadside Help
              </h3>
              <p className="text-black">
                Get direct contact details instantly without endless searching.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default App;