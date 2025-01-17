// // src/front/js/pages/profilePages/UserProfile.js
import React from 'react';
import Sidebar from '../../component/Sidebar'; 
import { Outlet } from 'react-router-dom';  // ✅ Correct import for nested routes
import '../../../styles/userProfile.css';

const UserProfile = () => {
  return (
    <div className="user-profile d-flex">
      <Sidebar />
      <div className="content flex-grow-1 p-4">
        <Outlet />  {/* ✅ Correct way to render nested routes */}
      </div>
    </div>
  );
};

export default UserProfile;
