import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import HotelSidebar from './HotelSidebar';
import { Context } from '../../store/appContext';

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

    const goToAddHotel = () => {
        navigate('/hotel-profile/add-hotel');
    };

    const editHotel = (hotelId) => {
        navigate(`/hotel-profile/edit-hotel/${hotelId}`);
    };

    const deactivateHotel = async (hotelId) => {
        const success = await actions.deactivateHotel(hotelId);
        if (success) {
            alert("Hotel deactivated successfully!");
        } else {
            alert("Failed to deactivate the hotel. Please try again.");
        }
    };

    return (
        <div className="d-flex">
            <HotelSidebar />
            <div className="flex-grow-1">
                <Header title="Hoteles" />
                <div className="p-4">
                    <div className="d-flex justify-content-between mb-3">
                        <h4>Hotels List</h4>
                        <button className="btn btn-success" onClick={goToAddHotel}>
                            Add Hotel
                        </button>
                    </div>
                    <div className="list-group">
                        {hotels.length > 0 ? (
                            hotels.map((hotel) => (
                                <div
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    key={hotel.id_hotel}
                                >
                                    <div>
                                        <h5>{hotel.name}</h5>
                                        <p className="mb-0 text-muted">Ubicación: {hotel.location}</p>
                                        <p className="mb-0 text-muted">País: {hotel.country}</p>
                                    </div>
                                    <div>
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={() => editHotel(hotel.id_hotel)}
                                        >
                                            Edit details
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deactivateHotel(hotel.id_hotel)}
                                        >
                                            Deactivate
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hotels available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hotels;
