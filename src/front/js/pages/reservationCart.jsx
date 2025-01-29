import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

export const ReservationCart = () => {
    const { store, actions } = useContext(Context);
    const { reservations } = store;

    useEffect(() => {
        actions.getUserReservations(); // Cargar las reservas
    }, []); // Asegúrate de que esto solo se ejecute una vez

    // Verifica si reservations está definido antes de usarlo
    if (reservations === undefined) {
        return <div>Cargando...</div>;
    }

    console.log('Reservas:', reservations); // Verifica que reservas estén llegando

    return (
        <div className="container">
            <h2>Mis Reservas</h2>
            {reservations.length === 0 ? (
                <p>No tienes reservas activas.</p>
            ) : (
                reservations.map((reservation, index) => (
                    <ReservationCard key={index} reservation={reservation} />
                ))
            )}
        </div>
    );
};
