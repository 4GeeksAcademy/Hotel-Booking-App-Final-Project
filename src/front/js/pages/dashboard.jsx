import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const Dashboard = () => {
    const { actions, store } = useContext(Context);

    useEffect(() => {
        // Fetch hotels cuando el componente se monte
        actions.getHotels();
    }, [actions]);

    return (
        <div className="container py-5">
            <h2>Hotel Dashboard</h2>
            <div className="row">
                {/* Mapea el arreglo de hoteles y muestra cada hotel */}
                {store.hotels.length > 0 ? (
                    store.hotels.map((hotel, index) => (
                        <div key={index} className="col-12 col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{hotel.name}</h5>
                                    <p className="card-text">{hotel.description}</p>
                                    <p className="card-text">{hotel.location}, {hotel.country}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay hoteles disponibles por el momento.</p>
                )}
            </div>
        </div>
    );
};
