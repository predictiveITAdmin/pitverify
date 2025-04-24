import { BrowserRouter as Router } from 'react-router-dom'
import AppLayout from './AppLayout'
import { useState } from 'react';
function App() {
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const handleLogin = () => setIsAuthenticated(true);
  return (
    <>
    <Router>
      <AppLayout isAuthenticated={isAuthenticated} onLogin={handleLogin} />
    </Router>
    </>
  )
}

export default App
