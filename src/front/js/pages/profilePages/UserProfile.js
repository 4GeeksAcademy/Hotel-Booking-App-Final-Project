// src/front/js/pages/profilePages/UserProfile.js
import React from 'react';
import Sidebar from '../../component/Sidebar'; 
import { Route, Routes } from 'react-router-dom';
import PersonalInfo from './PersonalInfo';
import FavoriteHotels from './FavoriteHotels';
import StayHistory from './StayHistory';
import '../../../styles/userProfile.css';


const UserProfile = () => {
  return (
    <div className="user-profile d-flex">
      <Sidebar />
      <div className="content flex-grow-1 p-4">
        <Routes>
          <Route path="personal-info" element={<PersonalInfo />} />
          <Route path="favorite-hotels" element={<FavoriteHotels />} />
          <Route path="stay-history" element={<StayHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserProfile;
