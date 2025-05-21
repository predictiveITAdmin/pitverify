import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MdCheckCircle, MdCancel } from 'react-icons/md';


const PublicEmployeeView = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageNotFound, setImageNotFound] = useState(false);

  useEffect(() => {
  const loadData = async () => {
    try {
      // Fetch employee details first
      const employeeRes = await axios.get(`${import.meta.env.VITE_API_URL}/employees/public/${id}`);
      setEmployee(employeeRes.data);

      // Attempt to get image SAS URL
      const imageRes = await axios.get(`${import.meta.env.VITE_API_URL}/profile-picture/${id}`);
      const { url } = imageRes.data;

      // Attempt to fetch the actual image blob
      const imgRes = await fetch(url);
      if (!imgRes.ok) {
        if (imgRes.status === 404) {
          console.warn("Image not found, will fallback to initials.");
          setImageNotFound(true);
        } else {
          throw new Error(`Image fetch failed with status ${imgRes.status}`);
        }
        return;
      }

      const blob = await imgRes.blob();
      const objectUrl = URL.createObjectURL(blob);
      setImgUrl(objectUrl);

    } catch (err) {
      console.error("Error during data fetch:", err);
      setError("Unable to load employee data or image.");
      setImageNotFound(true); // fallback in case blob URL fails entirely
    } finally {
      setLoading(false);
    }
  };

  loadData();
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
      <div className="max-w-4xl bg-white rounded-2xl">
            <div
      className={`flex flex-col items-center justify-center rounded-t-2xl py-4 w-full mx-auto 
        ${employee.accountEnabled ? 'bg-green-600' : 'bg-red-600'}`}
    >
      <div className="flex items-center gap-3 text-white text-xl  font-semibold">
        {employee.accountEnabled ? (
          <>
            <MdCheckCircle className="text-3xl rounded-2xl" />
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
    <div className="max-w-4xl bg-white p-6 rounded-2xl shadow-2xl space-y-4">
      <div className="w-full flex flex-col md:flex-row items-center justify-start gap-6 p-6 bg-white rounded-lg">
        {/* Profile Picture or Initials */}
        <div className="flex-shrink-1">
          {imageNotFound ? (
            <div className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center tracking-[0.06em] bg-blue-700 text-gray-100 rounded-full text-4xl font-semibold">
              {employee?.displayName
                ?.split(" ")
                .map(word => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          ) : (
             <>
              <img
                src={imgUrl}
                alt={employee?.displayName || "Employee"}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border border-gray-300 object-cover cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
              
              {/* Modal Overlay */}
              {isModalOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-outjustify-center bg-gray-950/75 bg-opacity-60"
                  onClick={() => setIsModalOpen(false)}
                >
                  <div
                    className="relative transform transition-all duration-300 ease-out scale-100 opacity-100 animate-zoomIn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={imgUrl}
                      alt="Full Size"
                      className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
                    />
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-2 right-2 cursor-pointer bg-white rounded-full p-1 text-gray-800 hover:bg-gray-200"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Employee Details */}
        <div className="text-center md:text-left">
          <h1 className="text-sm text-gray-500">{employee?.companyName || 'predictiveIT'}</h1>
          <h3 className="text-xl font-bold text-indigo-600">{employee?.displayName}</h3>
          <p className="text-md text-gray-600">{employee?.jobTitle || 'Job Title N/A'}</p>
          <p className="text-sm text-gray-400">{employee?.department || 'Department N/A'}</p>
        </div>
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
