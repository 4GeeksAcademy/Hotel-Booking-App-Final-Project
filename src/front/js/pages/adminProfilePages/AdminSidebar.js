import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHotel, faUsers } from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = () => {
  return (
    <div
      className="sidebar col-3 p-3"
      style={{
        backgroundColor: '#40788c',
        minHeight: '100vh',
        color: '#ffffff',
        width: '250px',
      }}
    >
      <ul className="list-unstyled">
        {/* Admin Personal Info Link */}
        <li className="mb-4">
          <Link
            to="/admin/personal-info"
            className="d-flex align-items-center text-decoration-none"
            style={{ color: '#ffffff' }}
          >
            <FontAwesomeIcon icon={faUser} className="fa-icon mr-2" style={{ fontSize: '1.2rem' }} />
            Personal Information
          </Link>
        </li>

        {/* Admin Existing Hotels Link */}
        <li className="mb-4">
          <Link
            to="/admin/existing-hotels"
            className="d-flex align-items-center text-decoration-none"
            style={{ color: '#ffffff' }}
          >
            <FontAwesomeIcon icon={faHotel} className="fa-icon mr-2" style={{ fontSize: '1.2rem' }} />
            Existing Hotels
          </Link>
        </li>

        {/* Admin Existing Users Link */}
        <li className="mb-4">
          <Link
            to="/admin/existing-users"
            className="d-flex align-items-center text-decoration-none"
            style={{ color: '#ffffff' }}
          >
            <FontAwesomeIcon icon={faUsers} className="fa-icon mr-2" style={{ fontSize: '1.2rem' }} />
            Existing Users
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
