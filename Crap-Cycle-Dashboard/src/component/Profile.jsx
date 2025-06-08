// src/Profile.js
import React from 'react';

const Profile = () => {
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    position: 'Software Engineer',
    description: 'Passionate developer with a love for creating innovative solutions.',
    profilePicture: 'https://via.placeholder.com/150',
    website: 'https://johndoe.com'
  };

  return (
    <div className="max-w-sm mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <img src={user.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4" />
      <h1 className="text-2xl font-semibold text-center mb-2">{user.name}</h1>
      <p className="text-center text-gray-600 mb-2">
        Email: <a href={`mailto:${user.email}`} className="text-blue-500">{user.email}</a>
      </p>
      <p className="text-center text-gray-600 mb-2">Position: {user.position}</p>
      <p className="text-center text-gray-600 mb-2">{user.description}</p>
      <p className="text-center">
        Website: <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500">{user.website}</a>
      </p>
    </div>
  );
};

export default Profile;
