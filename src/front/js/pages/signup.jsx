import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const SignUp = () => {
    const { actions } = useContext(Context);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!acceptTerms) {
            setToastMessage({ text: "You must accept the Terms and Conditions.", type: "danger" });
            setTimeout(() => setToastMessage(null), 3000);
            return;
        }

        if (password !== confirmPassword) {
            setToastMessage({ text: "The passwords do not match.", type: "danger" });
            setTimeout(() => setToastMessage(null), 3000);
            return;
        }

        const message = await actions.signUp(name, lastName, email, userName, password, userType);

        if (message === "User registered successfully") {
            setToastMessage({ text: "User registered successfully.", type: "success" });
            setTimeout(() => navigate("/login"), 3000);
        }

        setTimeout(() => setToastMessage(null), 1000);
    };

    return (
        <div className="FontDesign container py-5">
            <div className="col-12 col-md-8 col-lg-6 mx-auto">
                <h2 className="text-center font-weight-bold">Welcome to <span style={{ color: "#30728A" }}>Serenia</span></h2>
                <h5 className="text-center text-secondary"><strong>Sign Up</strong></h5>
                <form onSubmit={handleSubmit} className="eb-garamond">
                    <h5 className="fs-6 mt-4">Name</h5>
                    <input type="text" className="form-control rounded-pill" value={name} onChange={(e) => setName(e.target.value)} required />

                    <h5 className="fs-6 mt-4">Last Name</h5>
                    <input type="text" className="form-control rounded-pill" value={lastName} onChange={(e) => setLastName(e.target.value)} required />

                    <h5 className="fs-6 mt-4">Email</h5>
                    <input type="email" className="form-control rounded-pill" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <h5 className="fs-6 mt-4">Username</h5>
                    <input type="text" className="form-control rounded-pill" value={userName} onChange={(e) => setUserName(e.target.value)} required />

                    <h5 className="fs-6 mt-4">Password</h5>
                    <input type="password" className="form-control rounded-pill" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <h5 className="fs-6 mt-4">Confirm Password</h5>
                    <input type="password" className="form-control rounded-pill" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

                    <h5 className="fs-6 mt-4">Purpose of registration</h5>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="userTypeOptions" value="cliente" checked={userType === "cliente"} onChange={(e) => setUserType(e.target.value)} required />
                        <label className="form-check-label">Client: Book packages.</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="userTypeOptions" value="hotel" checked={userType === "hotel"} onChange={(e) => setUserType(e.target.value)} required />
                        <label className="form-check-label">Hotel: Publish and manage packages.</label>
                    </div>

                    <div className="form-check mt-3">
                        <input className="form-check-input" type="checkbox" id="termsCheckbox" checked={acceptTerms} onChange={() => setAcceptTerms(!acceptTerms)} />
                        <label className="form-check-label" htmlFor="termsCheckbox">
                            I accept the <Link to="/terms">Terms and Conditions</Link>
                        </label>
                    </div>

                    <div className="d-flex flex-column align-items-center justify-content-center mt-5">
                        <button type="submit" className="btn w-75 btn-secondary rounded-pill mt-3" style={{ backgroundColor: "#30728A", borderColor: "#30728A", fontWeight: "bold" }}>
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>

            {toastMessage && (
                <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                    <div className={`toast show align-items-center text-bg-${toastMessage.type} border-0`} role="alert">
                        <div className="d-flex">
                            <div className="toast-body">
                                {toastMessage.text}
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastMessage(null)}></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};