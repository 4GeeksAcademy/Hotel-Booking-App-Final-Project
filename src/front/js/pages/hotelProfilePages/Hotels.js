import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import HotelSidebar from './HotelSidebar';

const Hotels = () => {
  const [hotels, setHotels] = useState([
    { name: 'Hotel ABC', location: 'Madrid', country: 'Spain', description: 'A lovely hotel in Madrid.' },
    // More hotels can go here...
  ]);

  const navigate = useNavigate();

  // Function to handle navigation to Add Hotel page
  const goToAddHotel = () => {
    navigate('/hotel-profile/add-hotel');
  };

  return (
    <div className="d-flex">
      <HotelSidebar />
      <div className="flex-grow-1">
        <Header title="Hoteles" />
        <div className="p-4">
          <div className="d-flex justify-content-between mb-3">
            <h4>Lista de Hoteles</h4>
            <button
              className="btn btn-success"
              onClick={goToAddHotel}
            >
              Añadir un Hotel
            </button>
          </div>
          <div className="list-group">
            {hotels.map((hotel, index) => (
              <div className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                <div>
                  <h5>{hotel.name}</h5>
                  <p className="mb-0 text-muted">Ubicación: {hotel.location}</p>
                  <p className="mb-0 text-muted">País: {hotel.country}</p>
                </div>
                <div>
                  <button className="btn btn-primary me-2">Editar Detalles</button>
                  <button className="btn btn-danger">Desactivar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
