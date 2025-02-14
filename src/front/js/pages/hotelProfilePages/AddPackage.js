import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import HotelSidebar from "./HotelSidebar";
import { Context } from "../../store/appContext";
import "./hotelProfile.css";

const AddPackage = () => {
    const { actions, store } = useContext(Context);
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [packageData, setPackageData] = useState({
        packageName: "",
        hotelId: "",
        country: "",
        location: "",
        price: "",
        startDate: "",
        endDate: "",
        description: ""
    });

    useEffect(() => {
        const fetchHotels = async () => {
            const userHotels = await actions.getUserHotels();
            if (userHotels) {
                setHotels(userHotels);
            }
        };

        fetchHotels();
    }, []);

    const handleHotelChange = (e) => {
        const selected = hotels.find(hotel => hotel.id_hotel === parseInt(e.target.value));

        if (!selected) {
            console.error("Selected hotel is undefined!");
            return;
        }

        setSelectedHotel(selected);

        setPackageData(prevData => ({
            ...prevData,
            hotelId: selected.id_hotel,
            country: selected.country,
            location: selected.location
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPackageData({
            ...packageData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.addPackage(packageData);
        if (success) {
            navigate("/hotel-profile/packages");
        } else {
            alert("Failed to add package. Try again.");
        }
    };

    return (
        <div className="container FontDesign d-flex">
            <HotelSidebar />
            <div className="flex-grow-1">
                <Header title="Add Package" />
                <div className="p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <h5 className="mt-3 mb-5"><strong>Add Package</strong></h5>
                        </div>

                        {/* Package Name */}
                        <div className="mb-4">
                            <label className="form-label">Package Name</label>
                            <input
                                type="text"
                                className="form-control rounded-pill border-2 border-dark"
                                name="packageName"
                                value={packageData.packageName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Hotel Selection */}
                        <div className="mb-4">
                            <label className="form-label">Hotel Name</label>
                            <select
                                className="form-control rounded-pill border-2 border-dark"
                                onChange={handleHotelChange}
                                required
                            >
                                <option value="">Select a Hotel</option>
                                {hotels.map(hotel => (
                                    <option key={hotel.id_hotel} value={hotel.id_hotel}>
                                        {hotel.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Country and Location */}
                        <div className="mb-4">
                            <label className="form-label">Country</label>
                            <input
                                type="text"
                                className="form-control rounded-pill border-2 border-dark"
                                value={packageData.country}
                                disabled
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                className="form-control rounded-pill border-2 border-dark"
                                value={packageData.location}
                                disabled
                            />
                        </div>

                        {/* Price, Dates, and Description */}
                        <div className="mb-4">
                            <label className="form-label">Price</label>
                            <input
                                type="number"
                                className="form-control rounded-pill border-2 border-dark"
                                name="price"
                                value={packageData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control rounded-pill border-2 border-dark"
                                name="startDate"
                                value={packageData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control rounded-pill border-2 border-dark"
                                name="endDate"
                                value={packageData.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Description</label>
                            <textarea
                                className="resizeInput form-control rounded-pill border-2 border-dark mb-4"
                                name="description"
                                value={packageData.description}
                                onChange={handleChange}
                                rows="3"
                                required
                            />
                        </div>

                        {/* Buttons */}
                        <div className="mb-4 d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn custom-btn-grey"
                                onClick={() => navigate("/hotel-profile/packages")}
                            >
                                Go Back
                            </button>
                            <button
                                type="submit"
                                className="btn custom-btn-yellow"
                            >
                                Add Package
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPackage;