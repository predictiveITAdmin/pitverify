import React, { useState, useEffect } from 'react';
import { FiEdit, FiUpload } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import ProfilePhotoUploadModal from './ProfilePhotoUploadModal';

const ProfilePhotoUploader = ({ userId, currentImage, onUploadSuccess, employee }) => {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allowPhotoEdit, setAllowPhotoEdit] = useState(false);

  useEffect(() => {
    if (user?.id && userId) {
      setAllowPhotoEdit(user.id === userId);
    }
  }, [user, userId]);

  return (
    <>
      <div className="relative w-full h-full md:w-96 md:h-96">
            <img
              src={currentImage}
              alt="Profile"
              className="w-full h-full rounded-2xl border border-gray-300 object-cover"
            />
            {allowPhotoEdit && (
              <div
                className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 
                  bg-gray-600 text-white p-2 rounded-full shadow-2xl hover:bg-gray-200 hover:text-gray-900 
                  transform hover:scale-105 transition-all ease-in duration-200 cursor-pointer flex items-center justify-center"
                onClick={() => setIsModalOpen(true)}
                title="Edit Profile Picture"
              >
                <FiEdit className="w-5 h-5 mr-1" />
                <span className="text-sm">Edit Photo</span>
              </div>
            )}

      </div>

      {isModalOpen && (
        <ProfilePhotoUploadModal
          userId={userId}
          onClose={() => setIsModalOpen(false)}
          onUploadSuccess={onUploadSuccess}
        />
      )}
    </>
  );
};

export default ProfilePhotoUploader;
