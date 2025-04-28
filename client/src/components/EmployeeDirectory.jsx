import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaFilter } from 'react-icons/fa';

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [departments, setDepartments] = useState([]);

  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 10;
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/employees`, {
          withCredentials: true
        });
        setEmployees(res.data);
        setFiltered(res.data);

        const deptSet = new Set(res.data.map(user => user.department || 'Unknown'));
        setDepartments(['All', ...Array.from(deptSet)]);

        // Set filters based on URL
        const status = searchParams.get('status');
        const department = searchParams.get('department');

        if (status === 'Enabled' || status === 'Disabled') {
          setStatusFilter(status);
        }
        if (department) {
          setDepartmentFilter(department);
        }

      } catch (err) {
        console.error('Failed to fetch employees', err);
      }
    };

    fetchEmployees();
  }, []);

  // Apply filters + search + sort
  useEffect(() => {
    let result = [...employees];

    // Status filter
    if (statusFilter !== 'All') {
      const isActive = statusFilter === 'Enabled';
      result = result.filter(emp => emp.accountEnabled === isActive);
    }

    // Department filter
    if (departmentFilter !== 'All') {
      result = result.filter(emp => (emp.department || 'Unknown') === departmentFilter);
    }

    // Search by name
    if (search.trim()) {
      result = result.filter(emp =>
        emp.displayName?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [statusFilter, departmentFilter, search, sortConfig, employees]);

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="inline ml-1 text-gray-400" />;
    return sortConfig.direction === 'asc' ? (
      <FaSortUp className="inline ml-1 text-blue-500" />
    ) : (
      <FaSortDown className="inline ml-1 text-blue-500" />
    );
  };

  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);
  const startIdx = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filtered.slice(startIdx, startIdx + USERS_PER_PAGE);

  const handleUserClick = (userID) => {
      window.location.href = `/verify/${userID}`;
    };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">All Users</h1>

      {/* Filters + Search */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md transition-all">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaSearch className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search users by name..."
            className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 shadow-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-10 border-l mx-6"></div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 justify-end">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaFilter className="w-4 h-4" />
            </span>
            <select
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>

          <div>
            <select
              className="pl-4 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Banner */}
      {(statusFilter !== 'All' || departmentFilter !== 'All') && (
        <div className="text-gray-500 mb-4">
          Showing {statusFilter !== 'All' && <span>{statusFilter} users</span>}
          {statusFilter !== 'All' && departmentFilter !== 'All' && ' in '}
          {departmentFilter !== 'All' && <span>{departmentFilter} department</span>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th onClick={() => handleSort('displayName')} className="px-6 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer">
                Name {getSortIcon('displayName')}
              </th>
              <th onClick={() => handleSort('id')} className="px-6 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer">
                User ID {getSortIcon('id')}
              </th>
              <th onClick={() => handleSort('department')} className="px-6 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer">
                Department {getSortIcon('department')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.map(emp => (
              <tr key={emp.id} onClick={() => handleUserClick(emp.id)}>
                <td className="px-6 py-4 text-sm text-gray-900">{emp.displayName || 'Unnamed'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{emp.id || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{emp.department || 'Unknown'}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`font-semibold ${emp.accountEnabled ? 'text-green-600' : 'text-red-500'}`}>
                    {emp.accountEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
              </tr>
            ))}
            {!paginatedUsers.length && (
              <tr>
                <td colSpan="4" className="text-center px-6 py-4 text-sm text-gray-500">
                  No users match current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeDirectory;
