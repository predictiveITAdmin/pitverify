import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-predictiveIT.svg';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      await axios.get('http://localhost:3001/auth/logout', { withCredentials: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
      logout();
      navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-100 text-gray-900 p-4 shadow">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <NavLink to="/" className="flex items-center space-x-2">
          <img src={logo} alt="PredictiveIT Logo" className="h-10" />
        </NavLink>

        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `px-3 py-2 rounded hover:text-sky-500 ${isActive ? 'text-indigo-500' : ''}`
              }
            >
              All Employees
            </NavLink>
            <NavLink
              to="/qr"
              className={({ isActive }) =>
                `px-3 py-2 rounded hover:text-sky-500 ${isActive ? 'text-indigo-500' : ''}`
              }
            >
              Get QR
            </NavLink>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <FaUserCircle className="w-7 h-7 text-gray-700" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
                  <div className="px-4 py-2 text-sm text-gray-800 border-b">{user?.name}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left cursor-pointer px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
