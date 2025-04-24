import { useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Login from './components/Login';
import EmployeeDirectory from './components/EmployeeDirectory';
import QRGenerator from './components/QRGenerator';
import SecureRoute from './utils/SecureRoute';



function AppLayout({ isAuthenticated, onLogin }) {
  return (
    <>
     <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-6 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Login onLogin={onLogin} />} />
          <Route
            path="/qr"
            element={
              <SecureRoute isAuthenticated={isAuthenticated}>
                <QRGenerator />
              </SecureRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <SecureRoute isAuthenticated={isAuthenticated}>
                <EmployeeDirectory />
              </SecureRoute>
            }
          />
          <Route path="*" element={<h1 className="text-center text-2xl text-red-500 mt-12">404 - Page Not Found</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
    </>
  )
}

export default AppLayout
