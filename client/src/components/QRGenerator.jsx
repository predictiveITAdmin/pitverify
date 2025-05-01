import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const QRGenerator = () => {
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showToast, setShowToast] = useState(false);
  const qrRefs = useRef({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/employees`, { withCredentials: true });
        setEmployees(res.data);
        const deptSet = new Set(res.data.map(user => user.department || 'Unknown'));
        setDepartments(['All', ...Array.from(deptSet)]);
        setFilteredEmployees(res.data);
      } catch (err) {
        console.error('Failed to fetch employees', err);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    let filtered = employees;

    if (search.trim()) {
      filtered = filtered.filter(emp =>
        emp.displayName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedDepartment && selectedDepartment !== 'All') {
      filtered = filtered.filter(emp => (emp.department || 'Unknown') === selectedDepartment);
    }

    setFilteredEmployees(filtered);
  }, [search, selectedDepartment, employees]);

  const handleEmployeeToggle = (emp) => {
    if (selectedEmployees.find(e => e.id === emp.id)) {
      setSelectedEmployees(selectedEmployees.filter(e => e.id !== emp.id));
    } else {
      setSelectedEmployees([...selectedEmployees, emp]);
    }
  };

  const clearSelection = () => {
    setSearch('');
    setSelectedDepartment('');
    setSelectedEmployees([]);
    setFilteredEmployees(employees); // Reset the full list
  };

  const copyLink = (empId) => {
    const url = `${import.meta.env.VITE_FRONTEND_URL}/verify/${empId}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      })
      .catch(err => console.error('Failed to copy:', err));
  };

  const downloadQR = (empId, empName) => {
    const node = qrRefs.current[empId];
    if (!node) return;

    toPng(node)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${empName || 'qr-code'}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Error downloading QR:', err));
  };

  const downloadAllQRs = async () => {
    const zip = new JSZip();
    const promises = selectedEmployees.map(emp => {
      const node = qrRefs.current[emp.id];
      if (!node) return Promise.resolve();

      return toPng(node).then((dataUrl) => {
        const imgData = dataUrl.split(',')[1];
        zip.file(`${emp.displayName || emp.id}.png`, imgData, { base64: true });
      });
    });

    await Promise.all(promises);
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'employee-qrcodes.zip');
  };

  return (
    <div className="min-h-full flex flex-col p-6">
      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto  w-full">

        {/* Left - Form and Employee List */}
        <div className="w-full md:w-1/3 border border-gray-300 bg-white p-6 rounded-2xl shadow-md flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-indigo-700 text-center">QR Generator</h1>

          {/* Search */}
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedDepartment('');
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 placeholder-gray-400"
          />

          {/* Department */}
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setSearch('');
            }}
          >
            <option value="">Select Department</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Clear */}
          <button
            onClick={clearSelection}
            className="w-full py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-full"
          >
            Clear
          </button>

          {/* Employee List */}
          <div className="flex-1 overflow-y-auto max-h-[40vh] space-y-3 pr-2 mt-2">
             <div className="flex justify-between items-center mb-2">
              <h2 className="text-gray-700 font-semibold">
                Employees
              </h2>
              <span className="text-sm text-indigo-600 font-medium">
                {selectedEmployees.length} selected
              </span>
            </div>
            {filteredEmployees.map(emp => (
              <div key={emp.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedEmployees.some(e => e.id === emp.id)}
                  onChange={() => handleEmployeeToggle(emp)}
                  className="accent-indigo-600"
                />
                <span className="text-gray-700 text-sm">{emp.displayName}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setSelectedEmployees(filteredEmployees);
            }}
            className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-full"
          >
            Select All
          </button>

        </div>

        {/* Right - QR Grid */}
        <div className="w-full md:w-2/3 bg-white border border-gray-300 p-6 rounded-2xl shadow-md flex flex-col items-center">
          {selectedEmployees.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 overflow-y-auto max-h-[70vh] p-2 w-full">
                {selectedEmployees.map(emp => (
                  <div key={emp.id} className="flex flex-col items-center space-y-2">
                    <div
                      ref={(el) => (qrRefs.current[emp.id] = el)}
                      className="bg-white p-4 border border-gray-300 rounded-xl shadow-sm"
                    >
                      <QRCodeSVG value={`${import.meta.env.VITE_FRONTEND_URL}/verify/${emp.id}`} size={150} />
                    </div>
                    <p className="text-sm text-gray-700 font-semibold text-center">{emp.displayName}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadQR(emp.id, emp.displayName)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-full shadow transition"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => copyLink(emp.id)}
                        className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white text-xs rounded-full shadow transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Download All */}
              <button
                onClick={downloadAllQRs}
                className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow transition"
              >
                Download All QR Codes
              </button>
            </>
          ) : (
            <div className="text-gray-400 mt-20">Select employees to generate QR codes</div>
          )}
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out animate-slidein">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
