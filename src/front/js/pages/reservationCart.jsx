import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import moment from "moment";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Swal from 'sweetalert2';

export const ReservationCart = () => {
    const { store, actions } = useContext(Context);
    const { reservations } = store;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                await actions.getUserReservations();
            } catch (error) {
                console.error("Error al obtener reservas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    useEffect(() => {
        actions.getUserReservations();
    }, []);

    // PAGOS:
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
                    title: "Pago exitoso",
                    showConfirmButton: false,
                    timer: 1500
                });
                actions.getUserReservations();
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Hubo un problema con el pago"
                });
            }
        } catch (error) {
            console.error("Error procesando el pago:", error);
        }
    };

    if (loading) {
        return <div className="container text-center mt-4"><p><i className="fas fa-spinner fa-spin"></i> Cargando reservas...</p></div>;
    }

    // Filtrar solo las reservas pendientes
    const pendingReservations = reservations.filter(reservation => !reservation.is_paid);

    return (
        <div className="FontDesign container mt-5">
            <h2 className="text-center mb-3 fw-bold fs-4">My Reservations</h2>

            <button
                onClick={() => actions.handleDeleteAllReservations()}
                style={{ backgroundColor: "#d33", color: "white", padding: "10px", borderRadius: "5px", border: "none", cursor: "pointer" }}
            >
                Eliminar Todas las Reservas
            </button>

            <PayPalScriptProvider options={{ "client-id": process.env.PAYPAL_CLIENT_ID, "locale": "en_US" }}>

                {pendingReservations.length > 0 ? (
                    pendingReservations.map((reservation, index) => (
                        <div key={index} className="card shadow-lg mb-4 rounded h-auto">
                            <div className="card-body d-flex flex-column justify-content-between h-100">
                                <div>
                                    <h5 className="card-title fs-5"><strong>Reservation #{index + 1}</strong></h5>
                                    <p className="mb-2 fs-7"><strong>Reservation Date:</strong> {moment(reservation.reservation_date).format("YYYY-MM-DD HH:mm:ss")}</p>
                                    <p className="mb-2 fs-7"><strong>Stay Package:</strong> {reservation.stay_package.hotel_package_name}</p>
                                    <p className="mb-2 fs-7"><strong>Payment Amount:</strong> ${reservation.stay_package.price}</p>
                                    <p className="mb-3 fs-7">
                                        <strong>Payment Status:</strong>
                                        <span className="badge bg-warning ms-1">Pending Payment</span>

                                    </p>
                                </div>

                                <div className="d-flex justify-content-end">

                                    <button className="btn btn-danger position-absolute top-0 end-0 m-2 me-3 mt-2"
                                        onClick={() => actions.handleDeleteReservation(reservation.id_reservation)}>
                                        <i className="fas fa-trash-alt"></i> <small>DELETE</small>
                                    </button>

                                    <div className="d-flex justify-content-between align-items-center">
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
                    ))
                ) : (
                    <p className="text-center">No tienes reservas pendientes.</p>
                )}
            </PayPalScriptProvider >
        </div >
    );
};