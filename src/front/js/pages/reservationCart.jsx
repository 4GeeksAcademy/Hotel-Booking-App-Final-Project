import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import moment from "moment";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Swal from 'sweetalert2';
import { Navigate } from "react-router-dom";

export const ReservationCart = () => {
    const { store, actions } = useContext(Context);
    const { reservations } = store;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                await actions.getUserReservations();
            } catch (error) {
                console.error("Error getting reservations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const handlePaymentSuccess = async (orderID, paymentID, reservationId) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/pay-reservation/${reservationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID, paymentID })
            });

            if (response.ok) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Payment successful",
                    showConfirmButton: false,
                    timer: 1500
                });
                actions.getUserReservations();
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "There was a problem with the payment"
                });
            }
        } catch (error) {
            console.error("Error processing payment:", error);
        }
    };

    if (loading) {
        return <div className="container text-center mt-4"><p><i className="fas fa-spinner fa-spin"></i> Loading reservations...</p></div>;
    }
    if (!store.currentUser) {
        return <Navigate to={"/login"} />
    }
    // Filtrar solo las reservas pendientes
    const pendingReservations = reservations.filter(reservation => !reservation.is_paid);

    return (
        <div className="FontDesign container mt-5">
            <h2 className="text-center mb-4 fw-bold fs-4">My Reservations</h2>

            <PayPalScriptProvider options={{ "client-id": process.env.PAYPAL_CLIENT_ID, "locale": "en_US" }}>

                {pendingReservations.length > 0 ? (
                    pendingReservations.map((reservation, index) => (
                        <div key={index} className="reservation-card card shadow-lg mb-4 rounded h-auto bg-light">

                            <div className="row g-0">
                                <div className="col-12 col-md-4">
                                    <img
                                        src={reservation.stay_package.hotel.image_url}
                                        alt={reservation.stay_package.hotel.name}
                                        className="img-fluid rounded-start imagen-hotel-reservas"
                                    />
                                </div>

                                <div className="col-12 col-md-8">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between mb-3">
                                            <h5 className="card-title fs-5 fs-md-5 text-dark"><strong>Reservation #{index + 1}</strong></h5>
                                            <div className={`fs-6 rounded p-1 ${reservation.is_paid ? 'bg-success' : 'bg-warning'}`}>
                                                {reservation.is_paid ? 'Paid' : 'Pending Payment'}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <p className="fs-7"><strong>Reservation Date:</strong> {moment(reservation.reservation_date).format("YYYY-MM-DD HH:mm:ss")}</p>
                                            <p className="fs-7"><strong>Stay Package:</strong> {reservation.stay_package.hotel_package_name}</p>
                                            <p className="fs-7"><strong>Payment Amount:</strong> ${reservation.stay_package.price}</p>
                                        </div>

                                        <div className="d-flex flex-column w-50 justify-content-between align-items-center mt-4" style={{ minWidth: "200px" }}>

                                            <button className="btn custom-btn-red btn-lg mb-2 w-100 py-3" onClick={() => actions.handleDeleteReservation(reservation.id_reservation)}>
                                                <i className="fas fa-trash-alt me-2"></i>DELETE
                                            </button>

                                            <div className="w-100 mt-1">
                                                <PayPalButtons
                                                    createOrder={(data, actions) => {
                                                        return actions.order.create({
                                                            purchase_units: [{ amount: { value: reservation.stay_package.price } }]
                                                        });
                                                    }}
                                                    onApprove={(data, actions) => {
                                                        return actions.order.capture().then((details) => {
                                                            handlePaymentSuccess(data.orderID, data.paymentID, reservation.id_reservation);
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <p className="text-center mt-4 p-3 bg-light border rounded shadow-sm">
                        <i className="fas fa-info-circle me-2 text-warning"></i>
                        You have no pending reservations. Enjoy your day!
                    </p>
                )}

            </PayPalScriptProvider>

            {pendingReservations.length > 0 && (
                <div className="d-flex justify-content-end">
                    <button
                        onClick={() => actions.handleDeleteAllReservations()}
                        className="btn custom-btn-red btn-sm w-auto mt-4 mb-5 me-3"
                    >
                        <i className="fas fa-trash-alt me-2"></i>Delete All Reservations
                    </button>
                </div>
            )}

        </div>
    );
};