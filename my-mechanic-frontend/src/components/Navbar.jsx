import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50 px-10 py-5 flex justify-between items-center">

      <Link
        to="/"
        className="text-2xl font-bold text-slate-800"
      >
        My Mechanic
      </Link>

      <div className="flex gap-8 items-center text-slate-700 font-medium">

        <Link
          to="/"
          className="hover:text-amber-600 transition"
        >
          Home
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className="hover:text-amber-600 transition"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="hover:text-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/mechanic-login"
            className="hover:text-amber-600 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;