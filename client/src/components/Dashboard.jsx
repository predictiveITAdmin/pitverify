import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [departments, setDepartments] = useState({});
  const [newHires, setNewHires] = useState([]);
  const [time, setTime] = useState(new Date());

  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getFirstName = (fullName) => fullName?.split(' ')[0] || 'there';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, deptRes, hiresRes] = await Promise.all([
          axios.get('http://localhost:3001/stats/summary', { withCredentials: true }),
          axios.get('http://localhost:3001/stats/departments', { withCredentials: true }),
          axios.get('http://localhost:3001/stats/new-hires', { withCredentials: true }),
        ]);

        setStats(summaryRes.data);
        setDepartments(deptRes.data);
        setNewHires(hiresRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };

    fetchDashboardData();

    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
        <h1 className="text-2xl font-semibold">{getGreeting()}, {getFirstName(user?.name)}</h1>
        <p className="text-sm mt-1">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Users */}
        <div
          onClick={() => navigate('/employees')}
          className="cursor-pointer bg-white p-6 rounded-lg shadow hover:scale-105 hover:shadow-lg transition transform duration-200 text-center"
        >
          <h2 className="text-3xl font-bold text-indigo-600">{stats.total}</h2>
          <p className="text-gray-600 mt-1">Total Users</p>
        </div>

        {/* Active Users */}
        <div
          onClick={() => navigate('/employees?status=Enabled')}
          className="cursor-pointer bg-white p-6 rounded-lg shadow hover:scale-105 hover:shadow-lg transition transform duration-200 text-center"
        >
          <h2 className="text-3xl font-bold text-green-600">{stats.active}</h2>
          <p className="text-gray-600 mt-1">Active Users</p>
        </div>

        {/* Inactive Users */}
        <div
          onClick={() => navigate('/employees?status=Disabled')}
          className="cursor-pointer bg-white p-6 rounded-lg shadow hover:scale-105 hover:shadow-lg transition transform duration-200 text-center"
        >
          <h2 className="text-3xl font-bold text-red-500">{stats.inactive}</h2>
          <p className="text-gray-600 mt-1">Inactive Users</p>
        </div>
      </div>

      {/* Department Breakdown */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Department Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(departments).map(([dept, count]) => (
            <div
              key={dept}
              onClick={() => navigate(`/employees?department=${encodeURIComponent(dept)}`)}
              className="cursor-pointer bg-white p-4 rounded-lg shadow hover:scale-105 hover:shadow-lg transition transform duration-200 text-center"
            >
              <p className="font-semibold text-gray-700">{dept}</p> {/* Modernized color */}
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* New Hires */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">New Hires (Last 30 Days)</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newHires.length > 0 ? (
                newHires.map((hire) => (
                  <tr key={hire.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{hire.displayName || 'Unnamed'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(hire.createdDateTime).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                    No new hires in the last 30 days
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
