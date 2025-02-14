import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { Context } from "../../store/appContext";
import "./hotelProfile.css";

const AddHotel = () => {
  const navigate = useNavigate();

  const [hotelName, setHotelName] = useState('');
  const [hotelLocation, setHotelLocation] = useState('');
  const [hotelCountry, setHotelCountry] = useState('');
  const [hotelDescription, setHotelDescription] = useState('');
  const { actions } = useContext(Context);
  const [myImage, setMyImage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newHotel = {
      name: hotelName,
      location: hotelLocation,
      country: hotelCountry,
      description: hotelDescription,
      image_url: myImage
    };

    // Swal.fire({
    //   title: "Adding Hotel...",
    //   text: "Please wait while we save the hotel details.",
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    const success = await actions.addHotel(newHotel);
    if (success) {
      Swal.fire("Success!", "Hotel has been added successfully!", "success").then(() => {
        navigate('/hotel-profile/hotels');
      });
    } else {
      Swal.fire("Error!", "Failed to add the hotel. Please try again.", "error");
    }
  };

  const uploadImage = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) {
        Swal.fire("Warning", "No file selected", "warning");
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${process.env.BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire("Error!", errorData.error, "error");
        return;
      }

      const data = await response.json();
      setMyImage(data.image_url);
      Swal.fire("Success!", "Image uploaded successfully!", "success");
    } catch (error) {
      Swal.fire("Error!", "Error uploading image.", "error");
    }
  };

  return (
    <div className="container FontDesign">
      <h2 className='mt-5 mb-5'>Add a Hotel</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="hotelName" className="form-label">Hotel Name</label>
          <input type="text" id="hotelName" className="form-control rounded-pill border-2 border-dark" value={hotelName} onChange={(e) => setHotelName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="hotelLocation" className="form-label">Hotel Location</label>
          <input type="text" id="hotelLocation" className="form-control rounded-pill border-2 border-dark" value={hotelLocation} onChange={(e) => setHotelLocation(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="hotelCountry" className="form-label">Country</label>
          <input type="text" id="hotelCountry" className="form-control rounded-pill border-2 border-dark" value={hotelCountry} onChange={(e) => setHotelCountry(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="hotelDescription" className="form-label">Hotel Description</label>
          <textarea id="hotelDescription" className="form-control rounded-pill border-2 border-dark resizeInput" value={hotelDescription} onChange={(e) => setHotelDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="hotelImage" className="form-label">Hotel Image</label>
          <input id="hotelImage" type='file' className="form-control rounded-pill border-2 border-dark" onChange={uploadImage} required />
          {myImage && <img src={myImage} alt="Hotel Preview" className="img-preview mt-3" />}
        </div>
        <div className='mb-5 mt-5'>
          <button type="button" className="custom-btn-red me-2" onClick={() => navigate('/hotel-profile/hotels')}>Cancel</button>
          <button type="submit" className="custom-btn">Add Hotel</button>
        </div>
      </form>
    </div>
  );
};

export default AddHotel;
