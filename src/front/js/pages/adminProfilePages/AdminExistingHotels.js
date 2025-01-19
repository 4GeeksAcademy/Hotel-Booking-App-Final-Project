import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../store/appContext";  // Going up three levels


export const AdminExistingHotels = () => {
    const { actions, store } = useContext(Context);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        // Fetch hotels when the component mounts (for admin)
        actions.getHotels();
    }, []);  // Empty dependency array ensures it only runs once when the component mounts

    return (
        <div className="container py-5">
            {showAlert && (
                <div
                    className="alert alert-primary position-absolute end-0 top-0 mt-5"
                    role="alert"
                    style={{ zIndex: 500 }}
                >
                    Please log in to manage hotels.
                </div>
            )}

            <div className="d-flex align-items-center justify-content-center" style={{ gap: "10px" }}>
                <h2 style={{ fontWeight: "bold" }}>Admin - Manage Hotels</h2>
            </div>

            <div className="row">
                {store.hotels.length > 0 ? (
                    store.hotels.map((hotel, index) => (
                        <div key={index} className="col-12 col-md-4">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{hotel.name}</h5>
                                    <p className="card-text">{hotel.description}</p>
                                    <p className="card-text">{hotel.location}, {hotel.country}</p>
                                    <div className="d-flex justify-content-between mt-auto">
                                        {/* Button to Edit */}
                                        <button className="btn btn-warning" onClick={() => console.log("Edit Hotel", hotel)}>
                                            Edit
                                        </button>
                                        {/* Button to Delete */}
                                        <button className="btn btn-danger" onClick={() => console.log("Delete Hotel", hotel)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hotels available for management.</p>
                )}
            </div>
        </div>
    );
};


export default AdminExistingHotels;
