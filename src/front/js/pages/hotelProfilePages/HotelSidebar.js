import React from "react";
import { NavLink } from "react-router-dom";
import "./hotelProfile.css"; 
import "./HotelSidebar";  



const HotelSidebar = () => {
  return (
    <div className="hotel-sidebar bg-teal">
      <h4 className="sidebar-title text-white p-3">User Profile</h4>
      <ul className="list-unstyled ps-3">
        <li>
          <NavLink
            to="/hotel-profile/personal-info"
            className="sidebar-link"
            activeClassName="active"
          >
            <i className="fa fa-user me-2"></i> Personal Information
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hotel-profile/hotels"
            className="sidebar-link"
            activeClassName="active"
          >
            <i className="fa fa-hotel me-2"></i> Hotels
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hotel-profile/packages"
            className="sidebar-link"
            activeClassName="active"
          >
            <i className="fa fa-box me-2"></i> Packages
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default HotelSidebar;
