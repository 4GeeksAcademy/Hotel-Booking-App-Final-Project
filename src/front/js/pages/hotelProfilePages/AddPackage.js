import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import HotelSidebar from './HotelSidebar';

const AddPackage = () => {
    const navigate = useNavigate();
    const [packageData, setPackageData] = useState({
        packageName: '',
        hotelName: '',
        country: '',
        location: '',
        price: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPackageData({
            ...packageData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add the logic for submitting the form here, e.g., send a POST request
        console.log(packageData);
        // After successful submission, navigate back to the packages page
        navigate('/hotel-profile/packages');
    };

    return (
        <div className="d-flex">
            <HotelSidebar />
            <div className="flex-grow-1">
                <Header title="Añadir Paquete" />
                <div className="p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">

                            <h5>Añadir Paquete</h5>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="packageName" className="form-label">Nombre del Paquete</label>
                            <input
                                type="text"
                                className="form-control"
                                id="packageName"
                                name="packageName"
                                value={packageData.packageName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="hotelName" className="form-label">Nombre del Hotel</label>
                            <input
                                type="text"
                                className="form-control"
                                id="hotelName"
                                name="hotelName"
                                value={packageData.hotelName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="country" className="form-label">País</label>
                            <input
                                type="text"
                                className="form-control"
                                id="country"
                                name="country"
                                value={packageData.country}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="location" className="form-label">Ubicación</label>
                            <input
                                type="text"
                                className="form-control"
                                id="location"
                                name="location"
                                value={packageData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Precio</label>
                            <input
                                type="number"
                                className="form-control"
                                id="price"
                                name="price"
                                value={packageData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="startDate" className="form-label">Fecha de Inicio</label>
                            <input
                                type="date"
                                className="form-control"
                                id="startDate"
                                name="startDate"
                                value={packageData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="endDate" className="form-label">Fecha de Fin</label>
                            <input
                                type="date"
                                className="form-control"
                                id="endDate"
                                name="endDate"
                                value={packageData.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Descripción</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                value={packageData.description}
                                onChange={handleChange}
                                rows="3"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={() => navigate('/hotel-profile/packages')}
                            >
                                Volver
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger me-2"
                                onClick={() => navigate('/hotel-profile/packages')}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-success">Añadir Paquete</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPackage;
