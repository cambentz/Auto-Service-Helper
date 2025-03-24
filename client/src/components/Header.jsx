import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "motion/react";

/**
 * Header component styled with custom color palette and animated mobile menu.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isLoggedIn - Whether the user is currently logged in
 */
function Header({ isLoggedIn = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className="sticky top-0 z-50 bg-[#F8F8F8] text-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-[#1A3D61] tracking-tight">
          Gesture Garage
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 font-medium">
          <Link to="/garage" className="text-[#1A3D61] hover:text-[#FFCC00] transition">My Garage</Link>
          <Link to="/guides" className="text-[#1A3D61] hover:text-[#FFCC00] transition">Guides</Link>
          <Link to="/settings" className="text-[#1A3D61] hover:text-[#FFCC00] transition">Settings</Link>
          <Link to="/help" className="text-[#1A3D61] hover:text-[#FFCC00] transition">Help</Link>
          {isLoggedIn ? (
            <Link to="/profile" className="text-[#1A3D61] hover:text-[#66CC66] transition">Profile</Link>
          ) : (
            <Link to="/login" className="text-[#1A3D61] hover:text-[#66CC66] transition">Login / Register</Link>
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
              <Link to="/garage" className="text-[#1A3D61] hover:text-[#FFCC00]">My Garage</Link>
              <Link to="/guides" className="text-[#1A3D61] hover:text-[#FFCC00]">Guides</Link>
              <Link to="/settings" className="text-[#1A3D61] hover:text-[#FFCC00]">Settings</Link>
              <Link to="/help" className="text-[#1A3D61] hover:text-[#FFCC00]">Help</Link>
              {isLoggedIn ? (
                <Link to="/profile" className="text-[#1A3D61] hover:text-[#66CC66]">Profile</Link>
              ) : (
                <Link to="/login" className="text-[#1A3D61] hover:text-[#66CC66]">Login / Register</Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
};

export default Header;