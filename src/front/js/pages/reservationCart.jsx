import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import moment from "moment";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Swal from 'sweetalert2'

export const ReservationCart = () => {
    const { store, actions } = useContext(Context);
    const { reservations } = store;
    const [loading, setLoading] = useState(true);
    // Reemplazarlo después
    //const paypalClientID = "";

    // Cargar las reservas cuando el componente se monta
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                // Llamada a la función del Flux para obtener las reservas
                await actions.getUserReservations();
            } catch (error) {
                console.error("Error al obtener reservas:", error);
            } finally {
                setLoading(false); // Dejar de cargar después de obtener las reservas
            }
        };

        fetchReservations();
    }, []); // Este efecto solo se ejecuta una vez al montar el componente

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
                actions.getUserReservations(); // Actualizar reservas después del pago
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
        // Mientras se cargan las reservas
        return <div className="container text-center mt-4"><p>Cargando reservas...</p></div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Mis Reservas</h2>
            <PayPalScriptProvider options={{ "client-id": process.env.PAYPAL_CLIENT_ID }}>

                {reservations && reservations.length > 0 ? (
                    // Si hay reservas, las mapeamos para mostrarlas
                    reservations.map((reservation, index) => (
                        <div key={index} className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Reserva #{index + 1}
                                </h5>
                                <p><strong>Fecha de Reserva:</strong> {moment(reservation.reservation_date).format("YYYY-MM-DD HH:mm:ss")}</p>
                                <p><strong>Paquete de Estancia:</strong> {reservation.stay_package.hotel_package_name}</p>
                                <p><strong>Monto de Pago:</strong> ${reservation.stay_package.price}</p>
                                <p><strong>Estado del Pago:</strong> {reservation.is_paid ? "Pagado" : "Pendiente"}</p>

                                {!reservation.is_paid ? (
                                    <PayPalButtons
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [{
                                                    amount: { value: reservation.stay_package.price }
                                                }]
                                            });
                                        }}
                                        onApprove={(data, actions) => {
                                            return actions.order.capture().then((details) => {
                                                handlePaymentSuccess(data.orderID, data.paymentID, reservation.id_reservation);
                                            });
                                        }}
                                    />
                                ) :
                                    <a href={`https://wa.me/${reservation.phone_number}`} target="_blank">Contactar por Whatsapp</a>
                                }

                            </div>
                        </div>
                    ))
                ) : (
                    // Si no hay reservas
                    <p>No tienes reservas activas.</p>
                )}
            </PayPalScriptProvider>
        </div >
    );
};
