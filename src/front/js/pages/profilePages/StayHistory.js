
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import moment from "moment";
import '../../../styles/userProfile.css';

export const StayHistory = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [paidReservations, setPaidReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                await actions.getUserReservations();
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
        return <div className="loading-container"><p><i className="fas fa-spinner fa-spin"></i> Loading stay history...</p></div>;
    }

    return (
        <div className="stay-history-container">
            <h2 className="section-title">Stay History</h2>

            {paidReservations.length > 0 ? (
                paidReservations.map((reservation, index) => (
                    <div key={index} className="stay-card">
                        <div className="stay-card-body">
                            <h5 className="stay-card-title">Stay #{index + 1}</h5>
                            <p className="stay-info"><strong>Reservation Date:</strong> {moment(reservation.reservation_date).format("YYYY-MM-DD HH:mm:ss")}</p>
                            <p className="stay-info"><strong>Package Name:</strong> {reservation.stay_package.hotel_package_name}</p>
                            <p className="stay-info"><strong>Amount Paid:</strong> ${reservation.stay_package.price}</p>
                            <div className="stay-contact">
                                {reservation.phone_number ? (
                                    <a href={`https://wa.me/${reservation.phone_number}`} target="_blank" rel="noopener noreferrer" className="custom-btn-green">
                                        <i className="fab fa-whatsapp"></i> Contact via WhatsApp
                                    </a>
                                ) : (
                                    <span className="no-contact">No contact available</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="empty-message"><i className="fas fa-info-circle me-2 text-warning"></i>You have no past stays.</p>
            )}
        </div>
    );
};

export default StayHistory;