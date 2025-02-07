import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

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

    const toggleFavorite = async (hotel) => {
        if (!store.currentUser) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
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
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        } else {
            setSelectedHotel(hotelName);
            setShowModal(true);
        }
    };

    return (
        <div className="FontDesign container py-5">
            {showAlert && (
                <div className="alert alert-primary position-fixed top-0 end-0 mt-3 me-3 z-index-1050" role="alert">
                    Please log in to add favorites or make a reservation.
                </div>
            )}

            {/* Mensaje de bienvenida dinámico */}
            <h2 className="text-center mb-3 dashboard-title">
                Welcome, {store.currentUser ? store.currentUser.name : "Guest"}
            </h2>
            <p className="text-center text-muted fs-5 mb-5">
                {isHotelUser
                    ? "Grow your business by publishing your hotels with Serenia"
                    : "Book with the best, with Serenia"}
            </p>

            {/* Hoteles prioritarios como carrusel */}
            <div id="priorityHotelsCarousel" className="carousel slide mb-5 dashboard-carousel" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {priorityHotels.length > 0 ? (
                        priorityHotels.map((hotel, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                <div className="card h-100 dashboard-card">
                                    <img
                                        src={hotel.image_url ? hotel.image_url : "https://via.placeholder.com/200x200.png?text=No+Image"}
                                        alt={hotel.name}
                                        className="d-block w-100 carousel-img"
                                    />
                                    <div className="carousel-caption d-none d-md-block text-start">
                                        <h5>{hotel.name}</h5>
                                        <p>{hotel.description}</p>
                                        <div className="d-flex align-items-center">
                                            <p className="mt-2">
                                                {hotel.location}, {hotel.country}
                                            </p>
                                            {!isHotelUser && (
                                                <button
                                                    className="btn custom-btn ms-3 align-self-start mt-n4"
                                                    onClick={() => handleReserve(hotel.name)}
                                                >
                                                    Reserve
                                                </button>
                                            )}
                                            <button className="btn custom-btn ms-3 align-self-start mt-n4" onClick={() => {
                                                store.clicked_hotel = hotel.name
                                                navigate("/search")
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
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#priorityHotelsCarousel"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#priorityHotelsCarousel"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* Hoteles básicos */}
            <div className="row">
                <h3 className="fs-5">Other Hotels</h3>
                {basicHotels.length > 0 ? (
                    basicHotels.map((hotel, index) => (
                        <div key={index} className="col-12 col-md-4">
                            <div className="card h-100 dashboard-card">
                                <div className="card-body d-flex flex-column">
                                    <img
                                        src={hotel.image_url ? hotel.image_url : "https://via.placeholder.com/200x200.png?text=No+Image"}
                                        alt={hotel.name}
                                        className="card-img-top"
                                    />
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="card-title">{hotel.name}</h5>
                                        <FontAwesomeIcon
                                            icon={isHotelFavorited(hotel.id_hotel) ? solidStar : regularStar}
                                            className="text-warning fs-4 ms-2"
                                            onClick={() => toggleFavorite(hotel)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </div>
                                    <p className="card-text">{hotel.description}</p>
                                    <p className="card-text">
                                        {hotel.location}, {hotel.country}
                                    </p>
                                    <div className="d-flex justify-content-between mt-auto">
                                        {!isHotelUser && (
                                            <button className="btn custom-btn" onClick={() => handleReserve(hotel.name)}>
                                                Reserve
                                            </button>
                                        )}
                                         <button className="btn custom-btn ms-3 align-self-start mt-n4" onClick={() => {
                                                store.clicked_hotel = hotel.name
                                                console.log(store.clicked_hotel)
                                                navigate("/search")
                                            }}>
                                                View Packages
                                                
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
        </div>
    );
};
