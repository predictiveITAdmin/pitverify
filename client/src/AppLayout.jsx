import Footer from './components/Footer'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Login from './components/Login';
import EmployeeDirectory from './components/EmployeeDirectory';
import QRGenerator from './components/QRGenerator';
import SecureRoute from './utils/SecureRoute';
import Dashboard from './components/Dashboard';
import PublicEmployeeView from './components/PublicEmployeeView';


function AppLayout() {
  return (
    <>
     <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-6 max-w-6xl mx-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/qr"
            element={
              <SecureRoute>
                <QRGenerator />
              </SecureRoute>
            }
          />
          <Route
            path="/"
            element={
              <SecureRoute>
                <Dashboard />
              </SecureRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <SecureRoute>
                <EmployeeDirectory />
              </SecureRoute>
            }
          />
          <Route path="/verify/:id" element={<PublicEmployeeView />} />
          <Route path="*" element={<h1 className="text-center text-2xl text-red-500 mt-12">404 - Page Not Found</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
    </>
  )
}

export default AppLayout
