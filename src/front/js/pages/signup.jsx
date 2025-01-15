import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const SignUp = () => {
    const { actions } = useContext(Context); // Obtener acciones del contexto
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [UserType, setUserType] = useState("");
    const [toastMessage, setToastMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Llamada a la acción de registro del Flux Store
        const message = await actions.signUp(name, lastName, email, phoneNumber, password);

        if (message === "Usuario registrado correctamente") {
            setToastMessage({ text: "Usuario registrado correctamente.", type: "success" });
        } else if (message === "Este correo ya está registrado. Por favor, usa otro email.") {
            setToastMessage({ text: message, type: "danger" });
        } else {
            setToastMessage({ text: message, type: "danger" });
        }

        // Oculta el toast después de 3 segundos
        setTimeout(() => setToastMessage(null), 3000);
    };

    return (
        <div className="container py-5">
            <div className="col-12 col-md-8 col-lg-6 mx-auto">
                <h2 className="lobster-regular text-center mb-4">Sign Up</h2>
                <form onSubmit={handleSubmit} className="eb-garamond">
                    {/* Pregunta 1 - Registro */}
                    <h5>Name</h5>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Maicol"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Pregunta 2 - Registro */}
                    <h5>Last Name</h5>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Fernández"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>


                    <div className="input-group mb-3">
                        <span className="input-group-text">Email</span>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="e.g. maicol@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>


                    <div className="input-group mb-3">
                        <span className="input-group-text">Phone</span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. 67894580"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>


                    <div className="input-group mb-3">
                        <span className="input-group-text">Password</span>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="e.g. 3456kj20"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>


                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-secondary">Sign Up</button>
                        <Link to="/" className="btn btn-outline-secondary">Go Back</Link>
                    </div>
                </form>
            </div>


            {toastMessage && (
                <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                    <div
                        className={`toast show align-items-center text-bg-${toastMessage.type} border-0`}
                        role="alert"
                    >
                        <div className="d-flex">
                            <div className="toast-body">
                                {toastMessage.text}
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white me-2 m-auto"
                                onClick={() => setToastMessage(null)}
                            ></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};