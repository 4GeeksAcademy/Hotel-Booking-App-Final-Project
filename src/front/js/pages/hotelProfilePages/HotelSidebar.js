
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./hotelProfile.css";

const HotelSidebar = () => {
  const location = useLocation();

  if (location.pathname === "/hotel-profile/add-package") {
    return null;
  }

  return (
    <div className="hotel-sidebar FontDesign vh-100">
      <h4 className="sidebar-title">User Profile</h4>
      <ul className="list-unstyled ps-3 flex-grow-1">
        <li>
          <NavLink to="/hotel-profile/personal-info" className="sidebar-link">
            <i className="fa fa-user me-2"></i> Personal Information
          </NavLink>
        </li>
        <li>
          <NavLink to="/hotel-profile/hotels" className="sidebar-link">
            <i className="fa fa-hotel me-2"></i> Hotels
          </NavLink>
        </li>
        <li>
          <NavLink to="/hotel-profile/packages" className="sidebar-link">
            <i className="fa fa-box me-2"></i> Packages
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default HotelSidebar;