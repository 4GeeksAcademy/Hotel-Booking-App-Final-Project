import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import HotelSidebar from './HotelSidebar';

const Hotels = () => {
  const [hotels, setHotels] = useState([
    { id: 1, name: 'Hotel ABC', location: 'Madrid', country: 'Spain', description: 'A lovely hotel in Madrid.' },
 
  ]);

  const navigate = useNavigate();

  // Function to handle navigation to Add Hotel page
  const goToAddHotel = () => {
    navigate('/hotel-profile/add-hotel');
  };

  // Function to handle editing hotel details
  const editHotel = (hotelId) => {
    navigate(`/hotel-profile/edit-hotel/${hotelId}`);
  };

  // Function to handle deactivating hotel
  const deactivateHotel = (hotelId) => {

    alert(`Deactivating hotel with ID: ${hotelId}`);
  };

  return (
    <div className="d-flex">
      <HotelSidebar />
      <div className="flex-grow-1">
        <Header title="Hoteles" />
        <div className="p-4">
          <div className="d-flex justify-content-between mb-3">
            <h4>Hotels List</h4>
            <button className="btn btn-success" onClick={goToAddHotel}>
              Add Hotel
            </button>
          </div>
          <div className="list-group">
            {hotels.length > 0 ? (
              hotels.map((hotel) => (
                <div className="list-group-item d-flex justify-content-between align-items-center" key={hotel.id}>
                  <div>
                    <h5>{hotel.name}</h5>
                    <p className="mb-0 text-muted">Ubicación: {hotel.location}</p>
                    <p className="mb-0 text-muted">País: {hotel.country}</p>
                  </div>
                  <div>
                    <button className="btn btn-primary me-2" onClick={() => editHotel(hotel.id)}>
                      Edit details
                    </button>
                    <button className="btn btn-danger" onClick={() => deactivateHotel(hotel.id)}>
                      Deactivate
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hotels available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
