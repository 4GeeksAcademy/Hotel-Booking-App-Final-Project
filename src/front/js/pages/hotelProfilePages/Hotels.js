import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import HotelSidebar from './HotelSidebar';
import { Context } from '../../store/appContext';
import "./hotelProfile.css";
import Swal from 'sweetalert2';
import { Navigate } from "react-router-dom";

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
        // SweetAlert2 para confirmar acción
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to deactivate this hotel?",
            icon: 'warning',
            showCancelButton: true, // Habilitar botón de cancelar
            confirmButtonText: 'Yes, deactivate it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true, // Cambiar orden de los botones
        });

        if (result.isConfirmed) {
            // El usuario confirmó la acción
            const success = await actions.deactivateHotel(hotelId);
            if (success) {
                setHotels((prevHotels) =>
                    prevHotels.map((hotel) =>
                        hotel.id_hotel === hotelId ? { ...hotel, is_active: false } : hotel
                    )
                );

                // Alerta de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Deactivated!',
                    text: 'The hotel has been successfully deactivated.',
                    confirmButtonText: 'OK',
                });
            } else {
                // Alerta de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to deactivate the hotel. Please try again.',
                    confirmButtonText: 'Retry',
                });
            }
        } else {
            // El usuario canceló la acción
            Swal.fire({
                icon: 'info',
                title: 'Cancelled',
                text: 'The hotel was not deactivated.',
                confirmButtonText: 'OK',
            });
        }
    };

    const reactivateHotel = async (hotelId) => {
        // SweetAlert2 para confirmar acción
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to reactivate this hotel? This action will make it available again.",
            icon: 'warning',
            showCancelButton: true, // Habilitar botón de cancelar
            confirmButtonText: 'Yes, reactivate it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true, // Cambiar el orden de los botones
        });

        if (result.isConfirmed) {
            // El usuario confirmó la acción
            const success = await actions.reactivateHotel(hotelId);
            if (success) {
                setHotels((prevHotels) =>
                    prevHotels.map((hotel) =>
                        hotel.id_hotel === hotelId ? { ...hotel, is_active: true } : hotel
                    )
                );

                // Alerta de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Reactivated!',
                    text: 'The hotel has been successfully reactivated.',
                    confirmButtonText: 'OK',
                });
            } else {
                // Alerta de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to reactivate the hotel. Please try again.',
                    confirmButtonText: 'Retry',
                });
            }
        } else {
            // El usuario canceló la acción
            Swal.fire({
                icon: 'info',
                title: 'Cancelled',
                text: 'The hotel was not reactivated.',
                confirmButtonText: 'OK',
            });
        }
    };

    const goToAddHotel = () => {
        navigate('/hotel-profile/add-hotel');
    };

    if (!store.currentUser || store.currentUser.user_type != "hotel") {
        return <Navigate to={"/login"} />
      }

    return (
        <div className="FontDesign hotel-container">
            <HotelSidebar />
            <div className="hotel-content">
                <Header title="Hoteles" />
                <div className="content-wrapper">
                    <div className="hotel-header">
                        <h4 id='TitleHotelInfo'>Hotels List</h4>
                        <button className="custom-btn-yellow" onClick={goToAddHotel}>
                            Add Hotel
                        </button>
                    </div>
                    <div className="hotel-list">
                        {hotels.length > 0 ? (
                            hotels.map((hotel) => (
                                <div className="hotel-item text-start" key={hotel.id_hotel}>
                                    <div>
                                        <h5 className='text-dark'>{hotel.name}</h5>
                                        <p className="FontDesign text-dark">Location: {hotel.location}</p>
                                        <p className="FontDesign text-dark">Country: {hotel.country}</p>
                                    </div>
                                    <div>
                                        {hotel.is_active ? (
                                            <button className="custom-btn-red" onClick={() => deactivateHotel(hotel.id_hotel)}>
                                                Deactivate
                                            </button>
                                        ) : (
                                            <button className="custom-btn-grey" onClick={() => reactivateHotel(hotel.id_hotel)}>
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