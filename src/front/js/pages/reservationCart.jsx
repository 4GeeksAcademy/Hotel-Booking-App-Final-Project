import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

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

    if (loading) {
        return <div className="container text-center mt-4"><p>Cargando reservas...</p></div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Mis Reservas</h2>
            {reservations && reservations.length > 0 ? (
                reservations.map((reservation, index) => (
                    <ReservationCard key={index} reservation={reservation} />
                ))
            ) : (
                <p>No tienes reservas activas.</p>
            )}
        </div>
    );
};
