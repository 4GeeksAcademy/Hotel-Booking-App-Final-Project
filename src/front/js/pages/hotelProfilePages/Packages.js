import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import HotelSidebar from './HotelSidebar';

const Packages = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex">
      <HotelSidebar />
      <div className="flex-grow-1">
        <Header title="Paquetes de Hoteles" />
        <div className="p-4">
          <div className="d-flex justify-content-between mb-3">
            <h4>Packages list</h4>
            <button
              className="btn btn-success"
              onClick={() => navigate('/hotel-profile/add-package')}
            >
              Add Package
            </button>

          </div>
          <div className="list-group">
            <div className="list-group-item">
              <h5>Paquete Básico</h5>
              <p className="mb-0 text-muted">Incluye: Habitación + Desayuno</p>
              <button className="btn btn-primary mt-2">Editar</button>
            </div>
            <div className="list-group-item">
              <h5>Paquete Completo</h5>
              <p className="mb-0 text-muted">Incluye: Habitación + Desayuno + Tour</p>
              <button className="btn btn-primary mt-2">Editar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
