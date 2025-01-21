import React from 'react';
import '../../../styles/userProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faHotel, faTrash } from '@fortawesome/free-solid-svg-icons';

const StayHistory = () => {
  return (
    <div className="history-container">
      <h2>Stay History</h2>
      <input type="text" placeholder="Buscar estadía..." className="form-control search-bar" />
      <div className="package-list">
        {[1, 2, 3].map((item) => (
          <div key={item} className="package-item">
            <div className="package-image"></div>
            <div className="package-details">
              <h5>Package Name</h5>
              <div className="package-meta">
                <div className="meta-item">
                  <FontAwesomeIcon icon={faCalendarAlt} /> Stay Date
                </div>
                <div className="meta-item">
                  <FontAwesomeIcon icon={faTag} /> Price
                </div>
                <div className="meta-item">
                  <FontAwesomeIcon icon={faHotel} /> Hotel
                </div>
                <FontAwesomeIcon icon={faTrash} className="delete-icon" />
              </div>
              <div className="package-description">
                <p>Package Description</p>
                <a href="#">Go to package</a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-info">Save Changes</button>
    </div>
  );
};

export default StayHistory;
