import React from 'react';
import Header from './Header';  
import HotelSidebar from './HotelSidebar';  

const Hotels = () => {
  return (
    <div className="d-flex">
      <HotelSidebar />
      <div className="flex-grow-1">
        <Header title="Hoteles" />
        <div className="p-4">
          <div className="d-flex justify-content-between mb-3">
            <h4>Lista de Hoteles</h4>
            <button className="btn btn-success">Añadir un Hotel</button>
          </div>
          <div className="list-group">
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>Hotel ABC</h5>
                <p className="mb-0 text-muted">Ubicación: Madrid</p>
              </div>
              <div>
                <button className="btn btn-primary me-2">Editar Detalles</button>
                <button className="btn btn-danger">Desactivar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
