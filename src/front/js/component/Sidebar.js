// src/front/js/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHome, faBed } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="sidebar col-3 bg-light p-4">
      <ul className="list-unstyled">
        <li className="mb-4">
          <Link to="/profile/personal-info" className="d-flex align-items-center text-dark text-decoration-none">
            <FontAwesomeIcon icon={faUser} className="fa-icon mr-2" />
            Información Personal
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/profile/favorite-hotels" className="d-flex align-items-center text-dark text-decoration-none">
            <FontAwesomeIcon icon={faHome} className="fa-icon mr-2" />
            Hoteles Favoritos
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/profile/stay-history" className="d-flex align-items-center text-dark text-decoration-none">
            <FontAwesomeIcon icon={faBed} className="fa-icon mr-2" />
            Historial de Estadías
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
