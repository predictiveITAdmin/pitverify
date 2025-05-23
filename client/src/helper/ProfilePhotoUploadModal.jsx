// components/ProfilePhotoUploadModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload } from 'react-icons/fi';

const ProfilePhotoUploadModal = ({ userId, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setError('');

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image.');
      return;
    }

    try {
      setIsUploading(true);
      const blob = await selectedFile.arrayBuffer();

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/profile-picture/upload?userId=${userId}`,
        blob,
        {
          headers: { 'Content-Type': selectedFile.type },
          responseType: 'text',
        }
      );

      const blobUrl = URL.createObjectURL(new Blob([blob], { type: selectedFile.type }));
      onUploadSuccess(blobUrl);
      onClose();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Update Profile Picture</h2>

        <div className="mb-6 text-center">
          <label
            htmlFor="fileUpload"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 transition-all duration-200 cursor-pointer"
          >
            <FiUpload className="w-4 h-4 text-green-500" />
            {previewUrl ? 'Change Image' : 'Select Image'}
          </label>

          <input
            id="fileUpload"
            type="file"
            accept="image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />

          {previewUrl && (
            <div className="mt-4 flex flex-col items-center">
              <div className="p-1 bg-white rounded-full shadow-md border border-gray-200">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-48 h-48 rounded-full object-cover"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 italic">Image preview</p>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUploadModal;
