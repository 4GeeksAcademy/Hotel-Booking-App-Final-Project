import React, { useState } from 'react';

const FavoriteHotels = () => {
  const [hotels, setHotels] = useState([
    {
      id: 1,
      name: 'Hotel Name 1',
      location: 'Location 1',
      country: 'Country 1',
      phone: '123-456-7890',
      description: 'Hotel description goes here.',
    },
    {
      id: 2,
      name: 'Hotel Name 2',
      location: 'Location 2',
      country: 'Country 2',
      phone: '987-654-3210',
      description: 'Hotel description goes here.',
    },
    {
      id: 3,
      name: 'Hotel Name 3',
      location: 'Location 3',
      country: 'Country 3',
      phone: '456-789-1234',
      description: 'Hotel description goes here.',
    },
  ]);

  const [hotelToDelete, setHotelToDelete] = useState(null);

  const confirmDelete = (hotelId) => {
    setHotels(hotels.filter((hotel) => hotel.id !== hotelId));
    setHotelToDelete(null);
  };

  return (
    <div className="content container mt-4">
      <h2 className="text-center mb-4">Favorite Hotels</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          aria-label="Search"
        />
      </div>

      {/* Hotels List */}
      <div className="list-group">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="list-group-item d-flex justify-content-between align-items-start mb-2"
          >
            <div className="d-flex">
              {/* Hotel Image */}
              <div
                className="rounded bg-secondary me-3"
                style={{ width: '100px', height: '100px' }}
              ></div>
              {/* Hotel Details */}
              <div>
                <h5 className="mb-1">{hotel.name}</h5>
                <p className="mb-1">
                  <i className="bi bi-geo-alt-fill me-2"></i>{hotel.location}
                </p>
                <p className="mb-1">
                  <i className="bi bi-globe me-2"></i>{hotel.country}
                </p>
                <p className="mb-1">
                  <i className="bi bi-telephone-fill me-2"></i>{hotel.phone}
                </p>
                <p className="text-muted">{hotel.description}</p>
              </div>
            </div>
            {/* Actions */}
            <div className="d-flex flex-column justify-content-between">
              <button
                className="btn btn-link p-0 m-0"
                onClick={() => setHotelToDelete(hotel)}
                aria-label="Delete hotel"
                style={{ fontSize: '1.5rem', color: 'red' }} // Optional: Ensure the X icon is red
              >
                <i className="bi bi-x-lg"></i> {/* X icon with larger size */}
              </button>

              <a href="#" className="btn btn-link btn-sm">
                View Packages
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {hotelToDelete && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete {hotelToDelete.name}?</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setHotelToDelete(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete{' '}
                  <strong>{hotelToDelete.name}</strong> from your favorites?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setHotelToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => confirmDelete(hotelToDelete.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteHotels;
