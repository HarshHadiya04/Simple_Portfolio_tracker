import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">StockTracker</h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
              Home
            </Link>
            <Link to={user ? "/stocks" : "/login"} className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
              Add New Stock
            </Link>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
                  Login
                </Link>
                <Link to="/signup" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="text-gray-600 dark:text-gray-300 hover:text-red-500"
              >
                Logout
              </button>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-800 dark:text-gray-200 focus:outline-none"
              aria-label="Mobile Menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-2 py-3">
              <Link to="/" className="block text-gray-600 dark:text-gray-300 hover:text-blue-500">
                Home
              </Link>
              <Link to={user ? "/stocks" : "/login"} className="block text-gray-600 dark:text-gray-300 hover:text-blue-500">
                Add New Stock
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="block text-gray-600 dark:text-gray-300 hover:text-blue-500">
                    Login
                  </Link>
                  <Link to="/signup" className="block text-gray-600 dark:text-gray-300 hover:text-blue-500">
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={logout}
                  className="block text-gray-600 dark:text-gray-300 hover:text-red-500"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
