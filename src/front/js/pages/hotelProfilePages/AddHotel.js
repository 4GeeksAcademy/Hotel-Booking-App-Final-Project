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
  const [myImage, setMyImage] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();


    const newHotel = {
      name: hotelName,
      location: hotelLocation,
      country: hotelCountry,
      description: hotelDescription,
      image_url: myImage
    };

    console.log("Submitting hotel data:", newHotel); // Debugging log to ensure data is prepared

    const success = await actions.addHotel(newHotel); // Call the addHotel action
    if (success) {
        navigate('/hotel-profile/hotels'); // Redirect on success
    } else {
        alert("Failed to add the hotel. Please try again.");
    }



    // call an API to add the hotel or update state

    console.log("New Hotel Added:", newHotel);

    // Navigate to the Hotels page after submission
    navigate('/hotel-profile/hotels');
  };

  // ********************************** SUBIR CON CLOUDINARY***************************************
  const uploadImage = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) {
        console.error("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      // Asegúrate de que tu URL de backend esté correcta
      const response = await fetch(`${process.env.BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error uploading image:", errorData.error);
        return;
      }

      const data = await response.json();
      console.log("Uploaded image:", data);

      // Actualiza el estado con la URL segura de la imagen
      setMyImage(data.image_url); // Guarda la URL en el estado

    } catch (error) {
      console.error("Error in uploadImage:", error);
    }
  };
  // ********************************** CIERRE DEL SUBIR CON CLOUDINARY***************************************

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

        <div className="mb-3">
          <label htmlFor="hotelImage" className="form-label">Hotel Image</label>
          <input
            id="hotelImage"
            type='file'
            className="form-control"
            onChange={uploadImage}
            required
          />
          <img src={myImage} />
        </div>

        <div>
          
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
