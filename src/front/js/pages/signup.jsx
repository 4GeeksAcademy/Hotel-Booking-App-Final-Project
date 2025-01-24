import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";


export const SignUp = () => {
    const { actions } = useContext(Context); // Obtener acciones del contexto
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState(""); // Cambié a "userType" para coincidir con el backend
    const [toastMessage, setToastMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de contraseñas
        if (password !== confirmPassword) {
            setToastMessage({ text: "The passwords do not match.", type: "danger" });
            setTimeout(() => setToastMessage(null), 3000);
            return;
        }

        // Llamada a la acción de registro del Flux Store con el tipo de usuario
        const message = await actions.signUp(name, lastName, email, userName, password, userType);

        if (message === "User registered successfully") {
            // Mostrar el mensaje de éxito
            setToastMessage({ text: "User registered successfully.", type: "success" });

            // Redirigir al login
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        };

        // Oculta el toast después de 3 segundos
        setTimeout(() => setToastMessage(null), 1000);
    };

    return (
        <div className="FontDesign container py-5">
            <div className="col-12 col-md-8 col-lg-6 mx-auto">

                {/* Titulo de la Vista */}
                <div className="d-flex align-items-center justify-content-center" style={{ gap: "10px" }}>
                    <h2 style={{ fontWeight: "bold" }}>Welcome to</h2>
                    <h2 style={{ color: "#30728A", fontWeight: "bold" }}>Serenia</h2>
                </div>

                <h5 className="d-flex align-items-center justify-content-center text-secondary"><strong>Sign Up</strong></h5>

                <form onSubmit={handleSubmit} className="eb-garamond">
                    {/* Pregunta 1 - Registro */}
                    <h5 className="fs-6 mt-4">Name</h5>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="e.g. Maicol"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Pregunta 2 - Registro */}
                    <h5 className="fs-6 mt-4">Last Name</h5>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="e.g. Fernández"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Pregunta 3 - Registro */}
                    <h5 className="fs-6 mt-4">Email</h5>
                    <div className="input-group mb-3">
                        <input
                            type="email"
                            className="form-control rounded-pill"
                            placeholder="e.g. maicol@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Pregunta 4 - Registro */}
                    <h5 className="fs-6 mt-4">Username</h5>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="e.g. Maicol123"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Pregunta 5 - Registro */}
                    <h5 className="fs-6 mt-4">Password</h5>
                    <div className="input-group mb-3">
                        <input
                            type="password"
                            className="form-control rounded-pill"
                            placeholder="e.g. 3456kj20"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Confirmar Contraseña */}
                    <h5 className="fs-6 mt-4">Confirm Password</h5>
                    <div className="input-group mb-3">
                        <input
                            type="password"
                            className="form-control rounded-pill"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Pregunta 6 - Registro */}
                    <h5 className="fs-6 mt-4">Purpose of registration</h5>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="userTypeOptions"
                            id="clientOption"
                            value="cliente"
                            checked={userType === "cliente"}
                            onChange={(e) => setUserType(e.target.value)}
                            required
                        />
                        <label className="form-check-label" htmlFor="clientOption">
                            Client: Book packages.
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="userTypeOptions"
                            id="hotelOption"
                            value="hotel"
                            checked={userType === "hotel"}
                            onChange={(e) => setUserType(e.target.value)}
                            required
                        />
                        <label className="form-check-label" htmlFor="hotelOption">
                            Hotel: Publish and manage packages.
                        </label>
                    </div>

                    <div className="d-flex flex-column align-items-center justify-content-center mt-5">
                        <button
                            type="submit"
                            className="btn w-75 btn-secondary d-flex align-items-center justify-content-center rounded-pill mt-3"
                            style={{ backgroundColor: "#30728A", borderColor: "#30728A", fontWeight: "bold" }}
                        >
                            Sign Up
                        </button>
                    </div>


                </form>
            </div >

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
        </div >
    );
};