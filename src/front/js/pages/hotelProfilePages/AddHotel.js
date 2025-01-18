import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddHotel = () => {
  const navigate = useNavigate();

  // State to hold the form input values
  const [hotelName, setHotelName] = useState('');
  const [hotelLocation, setHotelLocation] = useState('');
  const [hotelCountry, setHotelCountry] = useState('');
  const [hotelDescription, setHotelDescription] = useState('');

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Assuming you are adding the hotel to a list in the state
    const newHotel = {
      name: hotelName,
      location: hotelLocation,
      country: hotelCountry,
      description: hotelDescription,
    };

    // Ideally, here you would call an API to add the hotel or update state

    console.log("New Hotel Added:", newHotel); // Replace with API call or state update logic

    // Navigate to the Hotels page after submission
    navigate('/hotel-profile/hotels');
  };

  return (
    <div className="container">
      <h2>Añadir un Hotel</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="hotelName" className="form-label">Hotel Name</label>
          <input
            type="text"
            id="hotelName"
            className="form-control"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="hotelLocation" className="form-label">Hotel Location</label>
          <input
            type="text"
            id="hotelLocation"
            className="form-control"
            value={hotelLocation}
            onChange={(e) => setHotelLocation(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="hotelCountry" className="form-label">Country</label>
          <input
            type="text"
            id="hotelCountry"
            className="form-control"
            value={hotelCountry}
            onChange={(e) => setHotelCountry(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="hotelDescription" className="form-label">Hotel Description</label>
          <textarea
            id="hotelDescription"
            className="form-control"
            value={hotelDescription}
            onChange={(e) => setHotelDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => navigate('/hotel-profile/hotels')}
          >
            Volver
          </button>
          <button
            type="button"
            className="btn btn-danger me-2"
            onClick={() => navigate('/hotel-profile/hotels')}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-success">Añadir Hotel</button>
        </div>
      </form>
    </div>
  );
};
export default AddHotel;
