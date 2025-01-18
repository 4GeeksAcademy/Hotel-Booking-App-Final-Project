import React from 'react';
import '../../../styles/userProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faHotel, faTrash } from '@fortawesome/free-solid-svg-icons';

const StayHistory = () => {
  return (
    <div className="history-container">
      <h2>Historial de estadías</h2>
      <input type="text" placeholder="Buscar estadía..." className="form-control search-bar" />
      <div className="package-list">
        {[1, 2, 3].map((item) => (
          <div key={item} className="package-item">
            <div className="package-image"></div>
            <div className="package-details">
              <h5>Nombre del Paquete</h5>
              <div className="package-meta">
                <div className="meta-item">
                  <FontAwesomeIcon icon={faCalendarAlt} /> Fecha de estadía
                </div>
                <div className="meta-item">
                  <FontAwesomeIcon icon={faTag} /> Precio
                </div>
                <div className="meta-item">
                  <FontAwesomeIcon icon={faHotel} /> Hotel
                </div>
                <FontAwesomeIcon icon={faTrash} className="delete-icon" />
              </div>
              <div className="package-description">
                <p>Descripción del paquete</p>
                <a href="#">Ir al paquete</a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-info">Guardar Cambios</button>
    </div>
  );
};

export default StayHistory;
