import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddHotel = () => {
  const navigate = useNavigate();

  // State to hold the form input values
  const [hotelName, setHotelName] = useState('');
  const [hotelLocation, setHotelLocation] = useState('');
  const [hotelCountry, setHotelCountry] = useState('');
  const [hotelDescription, setHotelDescription] = useState('');
  const [packageName, setPackageName] = useState('priority'); // Default to 'priority'
  const [myImage, setMyImage] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const newHotel = {
      name: hotelName,
      location: hotelLocation,
      country: hotelCountry,
      description: hotelDescription,
      image_url: myImage,
      package_name: packageName, // Include the selected package name
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
        const data = await response.json();
        console.log('New Hotel Added:', data);
        navigate('/hotel-profile/hotels'); // Redirect after success
      } else {
        console.error('Failed to add hotel:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
    }
  };

  // Function to handle image upload with Cloudinary
  const uploadImage = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) {
        console.error("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${process.env.BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error uploading image:", errorData.error);
        return;
      }

      const data = await response.json();
      console.log("Uploaded image:", data);
      setMyImage(data.image_url); // Save the image URL to state
    } catch (error) {
      console.error("Error in uploadImage:", error);
    }
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

        <div className="mb-3">
          <label htmlFor="packageName" className="form-label">Package Type</label>
          <select
            id="packageName"
            className="form-control"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            required
          >
            <option value="priority">Priority</option>
            <option value="basic">Basic</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="hotelImage" className="form-label">Hotel Image</label>
          <input
            id="hotelImage"
            type="file"
            className="form-control"
            onChange={uploadImage}
            required
          />
          {myImage && <img src={myImage} alt="Hotel" className="img-thumbnail mt-3" />}
        </div>

        <div>
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <button
            type="button"
            className="btn btn-danger me-2"
            onClick={() => navigate('/hotel-profile/hotels')}
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
