import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStore,
  faHeart,
  faInfoCircle,
  faShoppingCart,
  faBoxOpen,
  faCog,
  faSignOutAlt,
  faDashboard,
  faTimes,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";
import CartDrawer from "./CartDrawer";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const dropdownRef = useRef(null);
  const headerRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const navItems = [
    { to: "/shop", icon: faStore, label: "Shop Collection" },
    { to: "/favorites", icon: faHeart, label: "Favorites" },
    { to: "/about", icon: faInfoCircle, label: "Our Story" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset menus on route change
  useEffect(() => {
    setIsDropdownOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 transition-all duration-300 w-full ${
          isScrolled
            ? "glass-panel shadow-lg py-2.5 bg-white/80"
            : "bg-[#FCFAF7] border-b border-chocolate-100 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
                <span className="text-2xl font-bold text-gold-gradient tracking-tight font-poppins">
                  Chocolate Bravo
                </span>
                <span className="text-xs bg-[#4A2717] text-[#FCFAF7] px-2 py-0.5 rounded-full font-semibold hidden sm:inline-block">
                  PREMIUM
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Link pills */}
            <nav className="hidden md:flex space-x-1 lg:space-x-2">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[#3D1E11] text-[#FCFAF7] shadow-sm"
                        : "text-[#2B170E]/80 hover:text-[#3D1E11] hover:bg-[#3D1E11]/5"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Search and User Section */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-48 lg:w-64">
                <SearchBar />
              </div>

              {/* Cart Button */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2.5 text-[#3D1E11] hover:bg-[#3D1E11]/5 rounded-full transition-all duration-300"
                aria-label="Open cart"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="text-lg" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 bg-gold-gradient text-[#2B170E] text-[10px] font-black rounded-full w-5.5 h-5.5 flex items-center justify-center border-2 border-[#FCFAF7]"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* User Dropdown */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-chocolate-200 bg-white hover:bg-[#FCFAF7] transition-all text-[#3D1E11] font-bold text-sm"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                  >
                    <div className="w-6 h-6 rounded-full bg-gold-gradient flex items-center justify-center text-xs text-[#2B170E]">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <span className="max-w-[100px] truncate">{user.name}</span>
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-chocolate-100 py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-2.5 text-xs text-gray-400 font-bold tracking-wider border-b border-gray-50 uppercase">
                          Welcome, {user.name}
                        </div>
                        {user.isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-[#3D1E11] hover:bg-chocolate-50 hover:text-[#aa704e] transition-colors"
                          >
                            <FontAwesomeIcon icon={faDashboard} className="w-4 h-4 mr-3 text-chocolate-600" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/my-orders"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-[#3D1E11] hover:bg-chocolate-50 hover:text-[#aa704e] transition-colors"
                        >
                          <FontAwesomeIcon icon={faBoxOpen} className="w-4 h-4 mr-3 text-chocolate-600" />
                          My Orders
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-[#3D1E11] hover:bg-chocolate-50 hover:text-[#aa704e] transition-colors"
                        >
                          <FontAwesomeIcon icon={faCog} className="w-4 h-4 mr-3 text-chocolate-600" />
                          Settings
                        </Link>
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login">
                  <Button className="bg-[#3D1E11] hover:bg-[#4A2717] text-[#FCFAF7] rounded-full px-5 py-2 font-bold text-sm shadow-md transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Actions and menu button */}
            <div className="flex items-center space-x-2 md:hidden">
              {/* Cart for Mobile */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 text-[#3D1E11] hover:bg-[#3D1E11]/5 rounded-full"
                aria-label="Open cart"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="text-lg" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 bg-gold-gradient text-[#2B170E] text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#FCFAF7]"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={toggleMenu}
                className="p-2 text-[#3D1E11] hover:bg-[#3D1E11]/5 rounded-full"
                aria-label="Toggle menu"
              >
                <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-white border-t border-chocolate-100 overflow-hidden shadow-lg w-full"
            >
              <div className="px-4 py-5 space-y-4">
                <SearchBar />

                <nav className="flex flex-col space-y-1">
                  {navItems.map(({ to, icon, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                        location.pathname === to
                          ? "text-chocolate-700 bg-chocolate-50"
                          : "text-[#2B170E] hover:bg-gray-50"
                      }`}
                    >
                      <FontAwesomeIcon icon={icon} className="w-4 h-4 text-chocolate-600" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </nav>

                {/* Mobile User details */}
                {user ? (
                  <div className="pt-4 border-t border-chocolate-100 space-y-2">
                    <div className="px-4 py-1 text-xs font-bold text-gray-400 tracking-wider uppercase">
                      My Account
                    </div>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-bold text-[#3D1E11] hover:bg-gray-50"
                      >
                        <FontAwesomeIcon icon={faDashboard} className="w-4 h-4 text-chocolate-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <Link
                      to="/my-orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-bold text-[#3D1E11] hover:bg-gray-50"
                    >
                      <FontAwesomeIcon icon={faBoxOpen} className="w-4 h-4 text-chocolate-600" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-bold text-[#3D1E11] hover:bg-gray-50"
                    >
                      <FontAwesomeIcon icon={faCog} className="w-4 h-4 text-chocolate-600" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 text-left"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block pt-2">
                    <Button className="w-full bg-[#3D1E11] text-[#FCFAF7] py-3 rounded-xl font-bold">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Slide-over Shopping Cart Drawer */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
};

export default Header;