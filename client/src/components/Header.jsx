import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import { useAuth } from "../utils/AuthContext";
import logo from "../assets/logo.png";


/**
 * Header component styled with custom color palette and animated mobile menu.
 * Backend devs: Currently uses localStorage to simulate auth state – replace with real auth context/state.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isLoggedIn - Whether the user is currently logged in
 */
function Header() {
  const { user } = useAuth();

  // Backend devs: Replace this with real user name from auth state or user context
  const storedName = localStorage.getItem("userName");
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
  const displayName = user?.name || storedName || "Guest";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    // Close the mobile menu on route change (logo click or external link)
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  const isActive = (path) => location.pathname === path;


  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F8F8F8] text-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
        <img src={logo} alt="Gesture Garage logo" className="h-8 w-8 rounded-full object-cover" />
  <span className="text-2xl font-bold text-[#1A3D61] tracking-tight">Gesture Garage</span>
</Link>


        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 font-medium">
          <Link
            to="/garage"
            className={`transition ${isActive("/garage") ? "text-[#FFCC00] font-semibold underline" : "text-[#1A3D61] hover:text-[#FFCC00]"
              }`}
          >
            My Garage
          </Link>

          <Link
            to="/guides"
            className={`transition ${isActive("/guides") ? "text-[#FFCC00] font-semibold underline" : "text-[#1A3D61] hover:text-[#FFCC00]"
              }`}
          >
            Guides
          </Link>

          <Link
            to="/help"
            state={{ reset: true }}
            className={`transition ${isActive("/help") ? "text-[#FFCC00] font-semibold underline" : "text-[#1A3D61] hover:text-[#FFCC00]"
              }`}
          >
            Help
          </Link>

          {isLoggedIn ? (
            <UserDropdown displayName={displayName} />
          ) : (
            <Link
              to="/auth"
              state={{ mode: 'login' }}
              className={`transition ${isActive("/auth") ? "text-[#66CC66] font-semibold underline" : "text-[#1A3D61] hover:text-[#66CC66]"}`}
            >
              Login / Register
            </Link>
          )}


        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="relative z-50 md:hidden w-8 h-8 flex items-center justify-center"
          aria-label="Toggle Menu"
        >
          {/* Top Line */}
          <motion.span
            animate={isMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="absolute w-6 h-0.5 bg-[#1A3D61] rounded origin-center"
          />

          {/* Middle Line */}
          <motion.span
            animate={isMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute w-6 h-0.5 bg-[#1A3D61] rounded"
          />

          {/* Bottom Line */}
          <motion.span
            animate={isMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
            transition={{ duration: 0.3 }}
            className="absolute w-6 h-0.5 bg-[#1A3D61] rounded origin-center"
          />
        </button>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, easing: "ease-in-out" }}
            className="md:hidden bg-[#F8F8F8] border-t border-gray-300 px-4 pb-4 font-medium overflow-hidden"
          >
            <div className="flex flex-col space-y-3">
              <Link
                to="/garage"
                onClick={closeMenu}
                className={`transition ${isActive("/garage") ? "text-[#FFCC00] font-semibold underline" : "text-[#1A3D61] hover:text-[#FFCC00]"
                  }`}
              >
                My Garage
              </Link>

              <Link
                to="/guides"
                onClick={closeMenu}
                className={`transition ${isActive("/guides") ? "text-[#FFCC00] font-semibold underline" : "text-[#1A3D61] hover:text-[#FFCC00]"
                  }`}
              >
                Guides
              </Link>

              <Link
                to="/help"
                onClick={closeMenu}
                state={{ reset: true }}
                className={`transition ${isActive("/help") ? "text-[#FFCC00] font-semibold underline" : "text-[#1A3D61] hover:text-[#FFCC00]"
                  }`}
              >
                Help
              </Link>

              {isLoggedIn ? (
                <>

                  <Link
                    to="/settings"
                    onClick={closeMenu}
                    className={`transition text-[#1A3D61] hover:text-[#FFCC00]`}
                  >
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      closeMenu();
                      localStorage.clear();
                      window.location.href = "/auth";
                    }}
                    className="text-left text-[#1A3D61] hover:text-red-500 transition cursor-pointer"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={closeMenu}
                  state={{ mode: 'login' }}
                  className={`transition ${isActive("/auth") ? "text-[#66CC66] font-semibold underline" : "text-[#1A3D61] hover:text-[#66CC66]"}`}
                >
                  Login / Register
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;