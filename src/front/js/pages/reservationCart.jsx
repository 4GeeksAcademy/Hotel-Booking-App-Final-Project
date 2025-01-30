import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const ReservationCart = () => {
    const { store, actions } = useContext(Context);
    const { reservations } = store;
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        // Mientras se cargan las reservas
        return <div className="container text-center mt-4"><p>Cargando reservas...</p></div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Mis Reservas</h2>

            {reservations && reservations.length > 0 ? (
                // Si hay reservas, las mapeamos para mostrarlas
                reservations.map((reservation, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Reserva #{reservation.id_reservation}</h5>
                            <p><strong>Fecha de Reserva:</strong> {new Date(reservation.reservation_date).toLocaleString()}</p>
                            <p><strong>Paquete de Estancia:</strong> {reservation.stay_package.name}</p>
                            <p><strong>Monto de Pago:</strong> ${reservation.reservation_payment}</p>

                            {/* Botón de pago */}
                            <button className="btn btn-primary">
                                Realizar Pago
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                // Si no hay reservas
                <p>No tienes reservas activas.</p>
            )}
        </div>
    );
};