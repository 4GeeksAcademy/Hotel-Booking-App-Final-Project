import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import moment from "moment";

export const StayHistory = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [paidReservations, setPaidReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                await actions.getUserReservations();
                // Filter only the paid reservations
                const paidStays = store.reservations.filter(reservation => reservation.is_paid);
                setPaidReservations(paidStays);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    if (loading) {
        return <div className="container text-center mt-4"><p><i className="fas fa-spinner fa-spin"></i> Loading stay history...</p></div>;
    }

    return (
        <div className="FontDesign container mt-5">
            <h2 className="text-center mb-3 fw-bold">Stay History</h2>

            {paidReservations.length > 0 ? (
                paidReservations.map((reservation, index) => (
                    <div key={index} className="card shadow-lg mb-4 rounded">
                        <div className="card-body">
                            <h5 className="card-title"><strong>Stay #{index + 1}</strong></h5>
                            <p className="mb-2 fs-6 mt-4"><strong>Reservation Date:</strong> {moment(reservation.reservation_date).format("YYYY-MM-DD HH:mm:ss")}</p>
                            <p className="mb-2"><strong>Package Name:</strong> {reservation.stay_package.hotel_package_name}</p>
                            <p className="mb-2"><strong>Amount Paid:</strong> ${reservation.stay_package.price}</p>
                            
                            <div className="text-center">
                                {reservation.phone_number ? (
                                    <a href={`https://wa.me/${reservation.phone_number}`} target="_blank" rel="noopener noreferrer" className="btn btn-success">
                                        <i className="fab fa-whatsapp"></i> Contact via WhatsApp
                                    </a>
                                ) : (
                                    <span className="badge bg-secondary">No contact available</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center">You have no past stays.</p>
            )}
        </div>
    );
};



export default StayHistory;
