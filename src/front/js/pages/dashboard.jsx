import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";

export const Dashboard = ({ userId }) => {
    const { actions, store } = useContext(Context);
    const [hotels, setHotels] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const fetchedHotels = await actions.getHotels(userId);
                if (fetchedHotels.length > 0) {
                    // Dividir los hoteles según su tipo de paquete
                    const prioritarios = fetchedHotels.filter(hotel => hotel.package_id === 1); // Suponiendo que '1' es el ID del paquete prioritario
                    const basicos = fetchedHotels.filter(hotel => hotel.package_id === 2); // Suponiendo que '2' es el ID del paquete básico

                    // Ordenar los hoteles prioritarios al principio
                    const orderedHotels = [...prioritarios, ...basicos];
                    setHotels(orderedHotels);
                } else {
                    console.error('No hotels found.');
                }
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };
        fetchHotels();
    }, [userId, actions]);

    // Función para manejar la acción de reservar
    const handleReserve = (hotelName) => {
        if (!localStorage.getItem("user_session")) {
            // Si no hay sesión de usuario, mostrar la alerta
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } else {
            // Si está logueado, mostrar modal de confirmación. Este después se cambia
            setSelectedHotel(hotelName);
            setShowModal(true);
        }
    };

    const handleViewDetails = (hotelName) => {
        console.log(`Ver detalles del hotel: ${hotelName}`);
        // Aquí para redirigir a una página de detalles del hotel o abrir un modal con más información
    };

    // Confirmar la reserva
    const confirmReservation = () => {
        console.log(`Reserva confirmada para el hotel: ${selectedHotel}`);
        setShowModal(false);
        // Aquí podríamos agregar la lógica de reserva real
    };

    // Cancelar la reserva
    const cancelReservation = () => {
        setShowModal(false);
        setSelectedHotel(null);
    };

    return (
        <div className="container py-5">
            {showAlert && (
                <div
                    className="alert alert-primary position-absolute end-0 top-0 mt-5"
                    role="alert"
                    style={{ zIndex: 500 }}
                >
                    Please log in to make a reservation.
                </div>
            )}

            <div className="d-flex align-items-center justify-content-center" style={{ gap: "10px" }}>
                <h2 style={{ fontWeight: "bold" }}>Welcome</h2>
            </div>

            <div className="row">
                {hotels.length > 0 ? (
                    hotels.map((hotel, index) => (
                        <div key={index} className="col-12 col-md-4">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{hotel.name}</h5>
                                    <p className="card-text">{hotel.description}</p>
                                    <p className="card-text">{hotel.location}, {hotel.country}</p>
                                    <div className="d-flex justify-content-between mt-auto">
                                        {/* Botón Reservar */}
                                        <button
                                            className="btndashboard-signup"
                                            onClick={() => handleReserve(hotel.name)}
                                        >
                                            Reservar
                                        </button>
                                        <button
                                            className="btnlogin-signup"
                                            onClick={() => handleViewDetails(hotel.name)}
                                        >
                                            See details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>There are no hotels available at the moment.</p>
                )}
            </div>

            {/* Modal de confirmación por el momento, después se cambia por otra cosa */}
            {showModal && (
                <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Reservation</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={cancelReservation}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to reserve {selectedHotel}?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={cancelReservation}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={confirmReservation}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};