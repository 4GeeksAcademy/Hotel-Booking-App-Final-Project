import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHome, faBed } from '@fortawesome/free-solid-svg-icons';
import "../../styles/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar col-3 p-4">
      <ul className="list-unstyled">
        <li className="mb-4">
          <Link to="/profile/personal-info" className="d-flex align-items-center text-decoration-none sidebar-link">
            <FontAwesomeIcon icon={faUser} className="fa-icon mr-2" />
            Personal Information
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/profile/favorite-hotels" className="d-flex align-items-center text-decoration-none sidebar-link">
            <FontAwesomeIcon icon={faHome} className="fa-icon mr-2" />
            Favorite Hotels
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/profile/stay-history" className="d-flex align-items-center text-decoration-none sidebar-link">
            <FontAwesomeIcon icon={faBed} className="fa-icon mr-2" />
            Stay History
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
