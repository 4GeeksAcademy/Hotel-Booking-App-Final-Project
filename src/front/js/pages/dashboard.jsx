import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export const Dashboard = () => {
    const navigate = useNavigate()
    const { actions, store } = useContext(Context);
    const [priorityHotels, setPriorityHotels] = useState([]);
    const [basicHotels, setBasicHotels] = useState([]);
    const [favoriteHotels, setFavoriteHotels] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true); // ✅ Track when favorites are loading
    const [showAlert, setShowAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);

    const isHotelUser = store.currentUser?.user_type === "hotel";
    const isClientUser = store.currentUser?.user_type === "cliente";

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const fetchedPriorityHotels = await actions.getPriorityHotels();
                setPriorityHotels(fetchedPriorityHotels || []);

                const fetchedBasicHotels = await actions.getBasicHotels();
                setBasicHotels(fetchedBasicHotels || []);

                if (isClientUser) {
                    const fetchedFavorites = await actions.getFavoriteHotels();
                    setFavoriteHotels(fetchedFavorites || []);
                }
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        fetchHotels();
    }, [isClientUser]);

    useEffect(() => {
        console.log(" Updating state with fetched favorites:", store.favoriteHotels);
        setFavoriteHotels(store.favoriteHotels || []);
    }, [store.favoriteHotels]); // Runs when `store.favoriteHotels` changes

    const isHotelFavorited = (hotelId) => {
        return favoriteHotels.some((fav) => fav.id_hotel === hotelId);
    };


    // ALERTA QUE INTEGRÉ PARA QUE SEA CON SWEETALERT2
    const showLoginAlert = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Login Required',
            text: 'Please log in to add favorites or make a reservation.',
            confirmButtonText: 'OK'
        });
    };


    const toggleFavorite = async (hotel) => {
        if (!store.currentUser) {
            // COMENTÉ PORQUE ERA DE LA OTRA ALERT SENCILLA
            showLoginAlert();
            // setShowAlert(true);
            // setTimeout(() => setShowAlert(false), 3000);
            return;
        }

        const isFavorite = favoriteHotels.some((fav) => fav.id_hotel === hotel.id_hotel);

        if (isFavorite) {
            console.log(` Removing favorite hotel: ${hotel.id_hotel}`);
            await actions.removeFavoriteHotel(hotel.id_hotel);
            setFavoriteHotels(favoriteHotels.filter((fav) => fav.id_hotel !== hotel.id_hotel));
        } else {
            console.log(` Adding hotel to favorites:`, hotel);
            await actions.addFavoriteHotel(hotel);
            setFavoriteHotels([...favoriteHotels, hotel]);
        }
    };

    const handleReserve = (hotelName) => {
        const userSession = localStorage.getItem("user_session");
        if (!userSession) {
            // COMENTÉ PORQUE ERA DE LA OTRA ALERT SENCILLA
            showLoginAlert();
            // setShowAlert(true);
            // setTimeout(() => setShowAlert(false), 3000);
        } else {
            setSelectedHotel(hotelName);
            // setShowModal(true);
        }
    };

    return (
        <div className="FontDesign container py-5">
            {/* {showAlert && (
                <div className="alert alert-primary position-fixed top-0 end-0 mt-3 me-3 z-index-1050" role="alert">
                    Please log in to add favorites or make a reservation.
                </div>
            )} */}

            {/* Mensaje de bienvenida dinámico */}
            <h2 className="FontDesign text-center mb-3 fw-bold fs-4">
                Welcome, {store.currentUser ? store.currentUser.name : "Guest"}
            </h2>
            <p className="text-center text-muted fs-6 mb-5">
                {isHotelUser
                    ? "Grow your business by publishing your hotels with Serenia"
                    : "Book with the best, with Serenia"}
            </p>

            {/* Hoteles prioritarios */}
            <div className="text-center">
                <h3 className="custom-underline mb-4 fw-bold fs-5">Our Most Recommended Hotels</h3>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
                {priorityHotels.length > 0 ? (
                    priorityHotels.map((hotel, index) => (
                        <div key={index} className="col">
                            <div className="card hotel-card shadow-lg" style={{ width: "100%", height: "100%" }}>
                                <img
                                    src={hotel.image_url ? hotel.image_url : "https://via.placeholder.com/200x200.png?text=No+Image"}
                                    alt={hotel.name}
                                    className="card-img-top hotel-img"
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{hotel.name}</h5>
                                    <FontAwesomeIcon
                                        icon={isHotelFavorited(hotel.id_hotel) ? solidStar : regularStar}
                                        className="position-absolute top-0 end-0 m-2 text-warning fs-4"
                                        onClick={() => toggleFavorite(hotel)}
                                        style={{ cursor: "pointer" }}
                                    />
                                    <p className="card-text">{hotel.description}</p>
                                    <p className="card-text">{hotel.location}, {hotel.country}</p>
                                    {/* {!isHotelUser && (
                                                // <button
                                                //     className="btn custom-btn ms-3 align-self-start mt-n4"
                                                //     onClick={() => handleReserve(hotel.name)}
                                                // >
                                                //     Reserve
                                                // </button>
                                            )} */}
                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <button className="btn custom-btn ms-3 align-self-start mt-3" onClick={() => {
                                            store.clicked_hotel = hotel.name;
                                            navigate("/search");
                                        }}>
                                            View Packages
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

            {/* Hoteles básicos */}
            <h3 className="text-center mb-4 fw-bold fs-5">Explore Other Available Hotels</h3>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5">
                {basicHotels.length > 0 ? (
                    basicHotels.map((hotel, index) => (
                        <div key={index} className="col">
                            <div className="card shadow-lg h-100 hotel-img">
                                <img
                                    src={hotel.image_url ? hotel.image_url : "https://via.placeholder.com/200x200.png?text=No+Image"}
                                    alt={hotel.name}
                                    className="card-img-top"
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{hotel.name}</h5>
                                    <p className="card-text">{hotel.description}</p>
                                    <p className="card-text">{hotel.location}, {hotel.country}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <button className="btn btn-light custom-btn" onClick={() => {
                                            store.clicked_hotel = hotel.name;
                                            navigate("/search");
                                        }}>
                                            View Packages
                                        </button>
                                        <FontAwesomeIcon
                                            icon={isHotelFavorited(hotel.id_hotel) ? solidStar : regularStar}
                                            className="position-absolute top-0 end-0 m-2 text-warning fs-4"
                                            onClick={() => toggleFavorite(hotel)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No basic hotels available.</p>
                )}
            </div>
        </div >
    );
}