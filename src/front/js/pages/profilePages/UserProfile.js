import React, { useContext, useEffect, useState } from "react";
import Sidebar from '../../component/Sidebar';
import { Navigate } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import { Context } from "../../store/appContext";
import '../../../styles/userProfile.css';

const UserProfile = () => {
  const { store, actions } = useContext(Context);
  if (!store.currentUser || store.currentUser.user_type != "cliente") {
      return <Navigate to={"/login"} />
    }

  return (
    <div className="user-profile">
      {/* <div className="user-profile-header">
        User Profile
      </div> */}
      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar />
        <div className="content flex-grow-1 p-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;