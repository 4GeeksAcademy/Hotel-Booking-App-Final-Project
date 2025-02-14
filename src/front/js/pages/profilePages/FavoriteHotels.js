import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import '../../../styles/userProfile.css';
import { Navigate } from "react-router-dom";

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
    if (Array.isArray(store.favoriteHotels)) {
      setHotels(store.favoriteHotels);
    } else {
      setHotels([]);
    }
  }, [store.favoriteHotels]);

  const handleRemoveFavorite = async (hotelId) => {
    const success = await actions.removeFavoriteHotel(hotelId);
    if (success) {
      setHotels((prev) => prev.filter((hotel) => hotel.id_hotel !== hotelId));
      setHotelToDelete(null);
    }
  };

  return (
    <div className="content-container">
      <h2 className="section-title">Favorite Hotels</h2>
      <div className="hotel-list">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div key={hotel.id_hotel} className="hotel-item">
              <div>
                <h5 className="hotel-name">{hotel.name}</h5>
                <p className="hotel-info">
                  <i className="bi bi-geo-alt-fill"></i>
                  {hotel.location}
                </p>
                <p className="hotel-info">
                  <i className="bi bi-globe"></i>
                  {hotel.country}
                </p>
                <p className="hotel-description">{hotel.description}</p>
              </div>
              <button className="custom-btn-red" onClick={() => setHotelToDelete(hotel)}>
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="empty-message">
            {store.favoriteHotels === undefined
              ? "Loading favorites..."
              : "You haven't favorited any hotels yet."}
          </p>
        )}
      </div>

      {hotelToDelete && (
        <div className="modal-overlay">
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
                <button type="button" className="custom-btn-grey" onClick={() => setHotelToDelete(null)}>
                  Cancel
                </button>
                <button type="button" className="custom-btn-red" onClick={() => handleRemoveFavorite(hotelToDelete.id_hotel)}>
                  Remove
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