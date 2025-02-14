import React from 'react';
import Sidebar from '../../component/Sidebar';
import { Outlet } from 'react-router-dom';
import '../../../styles/userProfile.css';

const UserProfile = () => {
  return (
    <div className="user-profile">
      {/* <div className="user-profile-header">
        User Profile
      </div> */}
      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar />
        <div className="content flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;