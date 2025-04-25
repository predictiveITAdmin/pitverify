import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './AppLayout';
import axios from 'axios';
import useAuthStore from './store/authStore';

function App() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { setAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    axios.get('http://localhost:3001/auth/me', { withCredentials: true })
      .then(res => {
        if (res.data?.name) {
          setAuthenticated(true);
          setUser(res.data);
        }
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  if (checkingAuth) {
    return <div className="text-center mt-20 text-lg text-gray-600">Checking login status...</div>;
  }

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
