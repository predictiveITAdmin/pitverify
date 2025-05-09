import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';
import { MdCheckCircle, MdCancel } from 'react-icons/md';


const PublicEmployeeView = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/employees/public/${id}`);
        setEmployee(res.data);
      } catch (err) {
        console.error('Error fetching employee:', err);
        setError('Unable to find employee details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full bg-gradient-to-br">
        <div className="text-gray-600 text-lg animate-pulse">Loading Employee Details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-full mt-10 bg-gradient-to-br">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gradient-to-br">
      <div className="max-w-4xl bg-white rounded-2xl shadow-2xl space-y-8">
            <div
      className={`flex flex-col items-center justify-center py-4 shadow-md w-full mx-auto 
        ${employee.accountEnabled ? 'bg-green-600' : 'bg-red-600'}`}
    >
      <div className="flex items-center gap-3 text-white text-xl font-semibold">
        {employee.accountEnabled ? (
          <>
            <MdCheckCircle className="text-3xl" />
            Account Active
          </>
        ) : (
          <>
            <MdCancel className="text-3xl" />
            Account Inactive
          </>
        )}
      </div>
    </div>
    <div className="max-w-4xl bg-white p-6 rounded-2xl shadow-2xl space-y-8">
        {/* Header */}
        <div className="text-right">
          <h1 className="text-l text-gray-500 mt-1">{employee.companyName || 'PredictiveIT'}</h1>
          <h3 className="text-xl font-bold text-indigo-500">{employee.displayName}</h3>
          <p className="text-lg text-gray-500">{employee.jobTitle || 'Job Title N/A'}</p>
          <p className="text-gray-400">{employee.department || 'Department N/A'}</p>

          {/* Verified Badge */}
          
        </div>

        {/* Details */}
          <InfoBlock label="Username (UPN)" value={employee.userPrincipalName} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Basic Info */}
          <InfoBlock label="Employee ID" value={employee.employeeId} />
          <InfoBlock label="Email" value={employee.mail} />
          <InfoBlock label="Mobile Phone" value={employee.mobilePhone} />
          <InfoBlock label="Office Location" value={employee.officeLocation} />
          <InfoBlock label="Account Status" value={employee.accountEnabled ? 'Active' : 'Disabled'} color={employee.accountEnabled ? 'text-green-600' : 'text-red-500'} />
          <InfoBlock label="Preferred Language" value={employee.preferredLanguage} />
          <InfoBlock label="First Name" value={employee.givenName} />
          <InfoBlock label="Last Name" value={employee.surname} />
        </div>

        {employee.accountEnabled && (
            <div className="flex justify-center mt-4">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full shadow">
                <FaCheckCircle />
                Account Verified by PredictiveIT
              </div>
            </div>
          )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            Employee Verification Portal • {new Date().getFullYear()}
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

/** Reusable Component for Info Blocks */
const InfoBlock = ({ label, value, color = 'text-gray-800' }) => (
  <div>
    <h2 className="text-gray-500 text-xs mb-1 uppercase tracking-wide">{label}</h2>
    <p className={`font-semibold break-words ${color}`}>
      {value || 'N/A'}
    </p>
  </div>
);

export default PublicEmployeeView;
