import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../store/appContext";  
import AdminSidebar from "./AdminSidebar";  
import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation

export const AdminExistingHotels = () => {
    const { actions, store } = useContext(Context);
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();  // Initialize the useNavigate hook

    useEffect(() => {
        actions.getHotels();  // Fetch hotels on component mount
    }, [actions]);

   
    const handleDelete = (id_hotel) => {
        console.log("Deleting hotel with ID:", id_hotel); // Add this to check if the ID is being passed correctly
    
        if (!id_hotel) {
            console.error('Hotel ID is undefined');
            return;
        }
    
        const token = localStorage.getItem("access_token"); // Assuming token is stored in localStorage
        fetch(`/api/hotels/${id_hotel}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            actions.getHotels();  // Refresh the list of hotels after deleting
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        })
        .catch(error => {
            console.error('Error deleting hotel:', error);
        });
    };
    

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h2">Existing Hotels</h1>
                    </div>

                    {/* Hotels Table Section */}
                    <div className="card mb-4">
                        <div className="card-header">Hotel List</div>
                        <div className="card-body">
                            {showAlert && (
                                <div className="alert alert-success" role="alert">
                                    Hotel deleted successfully!
                                </div>
                            )}
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Hotel Name</th>
                                        <th scope="col">Location</th>
                                        <th scope="col">Country</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store.hotels.length > 0 ? (
                                        store.hotels.map((hotel, index) => (
                                            <tr key={index}>
                                                <td>{hotel.name}</td>
                                                <td>{hotel.location}</td>
                                                <td>{hotel.country}</td>
                                                <td>
                                                    
                                                    <button
                                                        className="btn btn-danger ms-2"
                                                        onClick={() => handleDelete(hotel.id)}  // Pass hotel ID to delete
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No hotels available for management.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminExistingHotels;
