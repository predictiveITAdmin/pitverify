import React from 'react'
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo-predictiveIT.svg';

const Header = () => {
  return (
    <header className="bg-gray-100 text-gray-900 p-4 shadow">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <NavLink to="/" className="flex items-center space-x-2">
          <img src={logo} alt="PredictiveIT Logo" className="h-10" />
        </NavLink>
        <div className="space-x-4">
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
        </div>
      </nav>
    </header>
  )
}

export default Header