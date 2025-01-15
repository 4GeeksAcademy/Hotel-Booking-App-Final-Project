// src/front/js/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AccountCircle, Home, KingBed } from '@mui/icons-material'; // Import Material Icons

const Sidebar = () => {
  return (
    <div className="sidebar col-3 bg-light p-4">
      <ul className="list-unstyled">
        <li className="mb-4">
          <Link to="/user-profile/personal-info" className="d-flex align-items-center text-dark text-decoration-none">
            <AccountCircle className="mr-2" fontSize="small" />
            Información Personal
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/user-profile/favorite-hotels" className="d-flex align-items-center text-dark text-decoration-none">
            <Home className="mr-2" fontSize="small" />
            Hoteles Favoritos
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/user-profile/stay-history" className="d-flex align-items-center text-dark text-decoration-none">
            <KingBed className="mr-2" fontSize="small" />
            Historial de Estadías
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;