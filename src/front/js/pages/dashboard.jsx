import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { actions, store } = useContext(Context);
    const [priorityHotels, setPriorityHotels] = useState([]);
    const [basicHotels, setBasicHotels] = useState([]);
    const [favoriteHotels, setFavoriteHotels] = useState([]);
    const [expandedHotels, setExpandedHotels] = useState({}); // Manejo individual para "Show More / Show Less"

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
        setFavoriteHotels(store.favoriteHotels || []);
    }, [store.favoriteHotels]);

    const isHotelFavorited = (hotelId) => {
        return favoriteHotels.some((fav) => fav.id_hotel === hotelId);
    };

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
            showLoginAlert();
            return;
        }

        const isFavorite = favoriteHotels.some((fav) => fav.id_hotel === hotel.id_hotel);

        if (isFavorite) {
            await actions.removeFavoriteHotel(hotel.id_hotel);
            setFavoriteHotels(favoriteHotels.filter((fav) => fav.id_hotel !== hotel.id_hotel));
        } else {
            await actions.addFavoriteHotel(hotel);
            setFavoriteHotels([...favoriteHotels, hotel]);
        }
    };

    const toggleExpandHotel = (hotelId) => {
        setExpandedHotels((prevState) => ({
            ...prevState,
            [hotelId]: !prevState[hotelId],
        }));
    };

    return (
        <div className="FontDesign container py-5">
            <h2 className="FontDesign text-center mb-3 fw-bold fs-4">
                Welcome, {store.currentUser ? store.currentUser.name : "Guest"}
            </h2>
            <p className="text-center text-muted fs-6 mb-5">
                {isHotelUser
                    ? "Grow your business by publishing your hotels with Serenia"
                    : "Book with the best, with Serenia"}
            </p>

            {/* Hoteles prioritarios */}
            <h3 className="text-center mb-4 fw-bold fs-5">Our Most Recommended Hotels</h3>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
                {priorityHotels.map((hotel) => (
                    <div key={hotel.id_hotel} className="col">
                        <div className="card hotel-card shadow-lg" style={{ width: "100%", height: "100%" }}>
                            <img
                                src={hotel.image_url || "https://via.placeholder.com/200x200.png?text=No+Image"}
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
                ))}
            </div>

            {/* Hoteles básicos */}
            <h3 className="text-center mb-4 fw-bold fs-5">Explore Other Available Hotels</h3>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5">
                {basicHotels.map((hotel) => (
                    <div key={hotel.id_hotel} className="col">
                        <div className="card shadow-lg h-100 hotel-img">
                            <img
                                src={hotel.image_url || "https://via.placeholder.com/200x200.png?text=No+Image"}
                                alt={hotel.name}
                                className="card-img-top"
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{hotel.name}</h5>
                                <p className={`card-text ${expandedHotels[hotel.id_hotel] ? "d-block" : "text-truncate"}`}>
                                    {hotel.description}
                                </p>
                                <p className="card-text">{hotel.location}, {hotel.country}</p>
                                <div className="d-flex justify-content-between align-items-center mt-auto">
                                    <button className="btn btn-light custom-btn me-3" onClick={() => {
                                        store.clicked_hotel = hotel.name;
                                        navigate("/search");
                                    }}>
                                        View Packages
                                    </button>
                                    <button
                                        className="custom-btn-grey mt-2"
                                        onClick={() => toggleExpandHotel(hotel.id_hotel)}
                                    >
                                        {expandedHotels[hotel.id_hotel] ? "Show Less" : "Show More"}
                                    </button>
                                </div>
                                <FontAwesomeIcon
                                    icon={isHotelFavorited(hotel.id_hotel) ? solidStar : regularStar}
                                    className="position-absolute top-0 end-0 m-2 text-warning fs-4"
                                    onClick={() => toggleFavorite(hotel)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
