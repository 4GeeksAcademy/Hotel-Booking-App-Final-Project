import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';

const FavoriteHotels = () => {
  const { store, actions } = useContext(Context);
  const [hotels, setHotels] = useState([]);
  const [hotelToDelete, setHotelToDelete] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      await actions.getFavoriteHotels();
    };
    fetchFavorites();
  }, []);

  useEffect(() => {
    setHotels(store.favoriteHotels);
  }, [store.favoriteHotels]);

  const confirmDelete = async (hotelId) => {
    const success = await actions.removeFavoriteHotel(hotelId);
    if (success) {
      setHotelToDelete(null);
    }
  };

  return (
    <div className="content container mt-4">
      <h2 className="text-center mb-4">Favorite Hotels</h2>
      <div className="list-group">
        <div className="list-group">
          {hotels?.length > 0 ? (
            hotels.map((hotel) => (

              <div key={hotel.id_hotel} className="list-group-item d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 className="mb-1">{hotel.name}</h5>
                  <p className="mb-1"><i className="bi bi-geo-alt-fill me-2"></i>{hotel.location}</p>
                  <p className="mb-1"><i className="bi bi-globe me-2"></i>{hotel.country}</p>
                  <p className="text-muted">{hotel.description}</p>
                </div>
                <button className="btn btn-danger" onClick={() => setHotelToDelete(hotel)}>Remove</button>
              </div>
            ))
          ) : (
            <p>No favorite hotels found.</p>
          )}
        </div>

      </div>
      {hotelToDelete && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Remove {hotelToDelete.name}?</h5>
                <button type="button" className="btn-close" onClick={() => setHotelToDelete(null)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to remove <strong>{hotelToDelete.name}</strong> from your favorites?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setHotelToDelete(null)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={() => confirmDelete(hotelToDelete.id_hotel)}>Remove</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteHotels;
