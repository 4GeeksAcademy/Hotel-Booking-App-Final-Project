import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Context } from "../../store/appContext";

const AddHotel = () => {
  const navigate = useNavigate();

  // State to hold the form input values
  const [hotelName, setHotelName] = useState('');
  const [hotelLocation, setHotelLocation] = useState('');
  const [hotelCountry, setHotelCountry] = useState('');
  const [hotelDescription, setHotelDescription] = useState('');
  const { actions } = useContext(Context); 

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const newHotel = {
        name: hotelName,
        location: hotelLocation,
        country: hotelCountry,
        description: hotelDescription,
    };

    console.log("Submitting hotel data:", newHotel); // Debugging log to ensure data is prepared

    const success = await actions.addHotel(newHotel); // Call the addHotel action
    if (success) {
        navigate('/hotel-profile/hotels'); // Redirect on success
    } else {
        alert("Failed to add the hotel. Please try again.");
    }



    // call an API to add the hotel or update state

    const handleSubmit = async (event) => {
      event.preventDefault();
    
      const newHotel = {
        name: hotelName,
        location: hotelLocation,
        country: hotelCountry,
        description: hotelDescription,
      };
    
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/hotels`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('user_session')}`,
          },
          body: JSON.stringify(newHotel),
        });        
    
        if (response.ok) {
          console.log('New Hotel Added:', newHotel);
          navigate('/hotel-profile/hotels'); // Redirect after success
        } else {
          console.error('Failed to add hotel:', response.statusText);
        }
        
      } catch (error) {
        console.error('Error adding hotel:', error);
      }
    };
    
  

    // Navigate to the Hotels page after submission
    navigate('/hotel-profile/hotels');
  };

  return (
    <div className="container">
      <h2>Add a Hotel</h2>
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
            onClick={() => navigate(-1)} // Go back to the previous page
          >
            Go Back
          </button>
          <button
            type="button"
            className="btn btn-danger me-2"
            onClick={() => navigate('/hotel-profile/hotels')} // Cancel and go back to the Hotels list
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-success">Add Hotel</button>
        </div>
      </form>
    </div>
  );
};

export default AddHotel;
