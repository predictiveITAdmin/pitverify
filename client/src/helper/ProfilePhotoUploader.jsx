import React, { useState } from 'react';
import axios from 'axios';

const ProfilePhotoUploader = ({ userId, currentImage, onUploadSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    console.log(selectedFile);
    try {
      setIsUploading(true);
      const blob = await selectedFile.arrayBuffer();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/profile-picture/upload?userId=${userId}`,
        blob,
        {
          headers: {
            'Content-Type': selectedFile.type
          },
          responseType: 'text',
        }
      );

      console.log(`res: ${res}`)
      console.log(`Blob: ${blob}`)
      const blobUrl = URL.createObjectURL(new Blob([blob], { type: selectedFile.type }));
      onUploadSuccess(blobUrl);
      console.log(`Blob URL : ${blobUrl}`)
      setIsModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <img
        src={currentImage}
        alt="Profile"
        className="w-96 h-96 md:w-96 md:h-96 rounded-full border border-gray-300 object-cover cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      />

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Update Profile Picture</h2>

            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-3" />

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-52 h-52 rounded-full object-cover mx-auto mb-4"
              />
            )}

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePhotoUploader;
