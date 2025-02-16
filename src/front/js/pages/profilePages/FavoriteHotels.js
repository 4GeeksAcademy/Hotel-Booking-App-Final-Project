import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import '../../../styles/userProfile.css';
import { Navigate } from "react-router-dom";
import Swal from 'sweetalert2';

const FavoriteHotels = () => {
  const { store, actions } = useContext(Context);
  const [hotels, setHotels] = useState([]);

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
      Swal.fire({
        icon: 'success',
        title: 'Removed!',
        text: 'The hotel has been removed from your favorites.',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to remove the hotel. Please try again.',
      });
    }
  };

  const confirmRemoveFavorite = (hotel) => {
    Swal.fire({
      title: `Remove ${hotel.name}?`,
      text: "Are you sure you want to remove this hotel from your favorites?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveFavorite(hotel.id_hotel);
      }
    });
  };

  if (!store.currentUser || store.currentUser.user_type != "cliente") {
      return <Navigate to={"/login"} />
    }

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
              <button className="custom-btn-red" onClick={() => confirmRemoveFavorite(hotel)}>
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="empty-message">
            {store.favoriteHotels === undefined ? (
              "Loading favorites..."
            ) : (
              <>
                <i className="fas fa-info-circle me-2 text-warning"></i>
                You haven't favorited any hotels yet.
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default FavoriteHotels;