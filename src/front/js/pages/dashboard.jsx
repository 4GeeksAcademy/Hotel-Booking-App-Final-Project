import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";

export const Dashboard = () => {
    const { actions, store } = useContext(Context);
    const [priorityHotels, setPriorityHotels] = useState([]);
    const [basicHotels, setBasicHotels] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [myImage, setMyImage] = useState(null);

    // ********************************** SUBIR CON CLOUDINARY***************************************
    const uploadImage = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) {
                console.error("No file selected");
                return;
            }

            const formData = new FormData();
            formData.append('image', file);

            // Asegúrate de que tu URL de backend esté correcta
            const response = await fetch(`${process.env.BACKEND_URL}/api/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error uploading image:", errorData.error);
                return;
            }

            const data = await response.json();
            console.log("Uploaded image:", data);

            // Actualiza el estado con la URL segura de la imagen
            setMyImage(data.image_url); // Guarda la URL en el estado

        } catch (error) {
            console.error("Error in uploadImage:", error);
        }
    };
    // ********************************** CIERRE DEL SUBIR CON CLOUDINARY***************************************

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const fetchedPriorityHotels = await actions.getPriorityHotels();
                setPriorityHotels(fetchedPriorityHotels || []);

                const fetchedBasicHotels = await actions.getBasicHotels();
                setBasicHotels(fetchedBasicHotels || []);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        fetchHotels();
    }, []);

    const handleReserve = (hotelName) => {
        if (!localStorage.getItem("user_session")) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        } else {
            setSelectedHotel(hotelName);
            setShowModal(true);
        }
    };

    const confirmReservation = () => {
        console.log(`Reservation confirmed for: ${selectedHotel}`);
        setShowModal(false);
    };

    const cancelReservation = () => {
        setShowModal(false);
        setSelectedHotel(null);
    };

    return (
        <div className="container py-5">
            {showAlert && (
                <div className="alert alert-primary position-absolute end-0 top-0 mt-5" role="alert" style={{ zIndex: 500 }}>
                    Please log in to make a reservation.
                </div>
            )}

            <h2 className="text-center mb-5" style={{ fontWeight: "bold" }}>Welcome</h2>

            {/* Hoteles prioritarios */}
            <div className="row mb-5">
                <h3>Priority Hotels</h3>
                {priorityHotels.length > 0 ? (
                    priorityHotels.map((hotel, index) => (
                        <div key={index} className="col-12 col-md-4">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <img
                                        src={hotel.image_url ? hotel.image_url : 'https://via.placeholder.com/200x200.png?text=No+Image'}
                                        alt={hotel.name}
                                        className="card-img-top"
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <h5 className="card-title">{hotel.name}</h5>
                                    <p className="card-text">{hotel.description}</p>
                                    <p className="card-text">{hotel.location}, {hotel.country}</p>
                                    <div className="d-flex justify-content-between mt-auto">
                                        <button className="btn btn-primary" onClick={() => handleReserve(hotel.name)}>
                                            Reserve
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No priority hotels available.</p>
                )}
            </div>

            {/* Hoteles con paquete o plan básicos */}
            <div className="row">
                <h3>Basic Hotels</h3>
                {basicHotels.length > 0 ? (
                    basicHotels.map((hotel, index) => (
                        <div key={index} className="col-12 col-md-4">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <img
                                        src={hotel.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                                        alt={hotel.name}
                                        className="card-img-top"
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <h5 className="card-title">{hotel.name}</h5>
                                    <p className="card-text">{hotel.description}</p>
                                    <p className="card-text">{hotel.location}, {hotel.country}</p>
                                    <div className="d-flex justify-content-between mt-auto">
                                        <button className="btn btn-primary" onClick={() => handleReserve(hotel.name)}>
                                            Reserve
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No basic hotels available.</p>
                )}
            </div>

            {/* CLOUDINARY */}
            <input type="file" onChange={uploadImage} />
            {myImage && <img src={myImage} alt="Uploaded" className="mt-3" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}

            {/* Modal de confirmación */}
            {showModal && (
                <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Reservation</h5>
                                <button type="button" className="btn-close" onClick={cancelReservation}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to reserve {selectedHotel}?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelReservation}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={confirmReservation}>
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