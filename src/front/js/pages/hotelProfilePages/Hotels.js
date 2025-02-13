import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import HotelSidebar from './HotelSidebar';
import { Context } from '../../store/appContext';
import "./hotelProfile.css";



const Hotels = () => {
    const { store, actions } = useContext(Context);
    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            await actions.getUserHotels();
        };

        if (store.hotels.length === 0) {
            fetchHotels();
        }
    }, []);

    useEffect(() => {
        setHotels(store.userHotels);
    }, [store.userHotels]);

    const deactivateHotel = async (hotelId) => {
        const success = await actions.deactivateHotel(hotelId);
        if (success) {
            setHotels((prevHotels) =>
                prevHotels.map((hotel) =>
                    hotel.id_hotel === hotelId ? { ...hotel, is_active: false } : hotel
                )
            );
            alert("Hotel deactivated successfully!");
        } else {
            alert("Failed to deactivate the hotel. Please try again.");
        }
    };

    const reactivateHotel = async (hotelId) => {
        const success = await actions.reactivateHotel(hotelId);
        if (success) {
            setHotels((prevHotels) =>
                prevHotels.map((hotel) =>
                    hotel.id_hotel === hotelId ? { ...hotel, is_active: true } : hotel
                )
            );
            alert("Hotel reactivated successfully!");
        } else {
            alert("Failed to reactivate the hotel. Please try again.");
        }
    };

    const goToAddHotel = () => {
        navigate('/hotel-profile/add-hotel');
    };

    return (
        <div className="hotel-container">
            <HotelSidebar />
            <div className="hotel-content">
                <Header title="Hoteles" />
                <div className="content-wrapper">
                    <div className="hotel-header">
                        <h4>Hotels List</h4>
                        <button className="custom-btn-green" onClick={goToAddHotel}>
                            Add Hotel
                        </button>
                    </div>
                    <div className="hotel-list">
                        {hotels.length > 0 ? (
                            hotels.map((hotel) => (
                                <div className="hotel-item" key={hotel.id_hotel}>
                                    <div>
                                        <h5>{hotel.name}</h5>
                                        <p className="hotel-info">Location: {hotel.location}</p>
                                        <p className="hotel-info">Country: {hotel.country}</p>
                                    </div>
                                    <div>
                                        {hotel.is_active ? (
                                            <button className="custom-btn-red" onClick={() => deactivateHotel(hotel.id_hotel)}>
                                                Deactivate
                                            </button>
                                        ) : (
                                            <button className="custom-btn-green" onClick={() => reactivateHotel(hotel.id_hotel)}>
                                                Reactivate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-message">No hotels available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hotels;