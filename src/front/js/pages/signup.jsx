import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Swal from 'sweetalert2';

export const SignUp = () => {
    const { store, actions } = useContext(Context);
    const [name, setName] = useState(store.signupData.name ? store.signupData.name : "");
    const [lastName, setLastName] = useState(store.signupData.lastName ? store.signupData.lastName : "");
    const [email, setEmail] = useState(store.signupData.email ? store.signupData.email : "");
    const [userName, setUserName] = useState(store.signupData.userName ? store.signupData.userName : "");
    const [confirmPassword, setConfirmPassword] = useState(store.signupData.confirmPassword ? store.signupData.confirmPassword : "");
    const [password, setPassword] = useState(store.signupData.password ? store.signupData.password : "");
    const [userType, setUserType] = useState(store.signupData.userType ? store.signupData.userType : "");
    const [acceptTerms, setAcceptTerms] = useState(store.signupData.acceptTerms ? store.signupData.acceptTerms : "");
    const [phoneNumber, setPhoneNumber] = useState(store.signupData.phoneNumber || "");
    const navigate = useNavigate();

    useEffect(() => {
        // Guarda los datos en sessionStorage cuando cambien
        actions.setSignUpData("name", name);
        actions.setSignUpData("lastName", lastName);
        actions.setSignUpData("email", email);
        actions.setSignUpData("userName", userName);
        actions.setSignUpData("password", password);
        actions.setSignUpData("confirmPassword", confirmPassword);
        actions.setSignUpData("userType", userType);
        actions.setSignUpData("acceptTerms", acceptTerms);
        actions.setSignUpData("phoneNumber", phoneNumber);
    }, [name, lastName, email, userName, password, confirmPassword, userType, acceptTerms, phoneNumber]);

    useEffect(() => {
        setName(store.signupData.name && store.signupData.name)
        setLastName(store.signupData.lastName && store.signupData.lastName)
        setEmail(store.signupData.email && store.signupData.email)
        setUserName(store.signupData.userName && store.signupData.userName)
        setPassword(store.signupData.password && store.signupData.password)
        setConfirmPassword(store.signupData.confirmPassword && store.signupData.confirmPassword)
        setUserType(store.signupData.userType && store.signupData.userType)
        setAcceptTerms(store.signupData.acceptTerms && store.signupData.acceptTerms)
        setPhoneNumber(store.signupData.phoneNumber && store.signupData.phoneNumber)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!phoneNumber) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Phone number is required.'
            });
            return;
        }

        if (!acceptTerms) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You must accept the Terms and Conditions.'
            });
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'The passwords do not match.'
            });
            return;
        }

        const message = await actions.signUp(name, lastName, email, userName, password, userType, "+" + phoneNumber);

        if (message === "User registered successfully") {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'User registered successfully.',
                timer: 2000,
                showConfirmButton: false,
                willClose: () => {
                    actions.setSignUpData("", "", true);
                    setTimeout(() => navigate("/login"), 2000);
                }

            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
            });
        }
    };
    console.log(phoneNumber);

    return (
        <div className="FontDesign container py-5">
            <div className="col-12 col-md-8 col-lg-6 mx-auto">
                <div className="d-flex justify-content-center col-xs-12 col-md-auto">
                    <span id="welcomePageTitleLogin">Welcome to&nbsp;</span>
                    <span className="colorTitle">Serenia</span>
                </div>
                <div id="loginMessage" className="col-sm-auto d-flex justify-content-center mt-0 p-0 mb-0">
                    <p>Sign Up</p>
                </div>
                <form onSubmit={handleSubmit} className="FontDesign">
                    <h5 className="fs-6 mt-4">Name</h5>
                    <input type="text" className="form-control rounded-pill border-2 border-dark" value={name} onChange={(e) => setName(e.target.value)} required />

                    <h5 className="fs-6 mt-4">Last Name</h5>
                    <input type="text" className="form-control rounded-pill border-2 border-dark" value={lastName} onChange={(e) => setLastName(e.target.value)} required />

                    <h5 className="fs-6 mt-4">Email</h5>
                    <input type="email" className="form-control rounded-pill border-2 border-dark" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <h5 className="fs-6 mt-4">Username</h5>
                    <input type="text" className="form-control rounded-pill border-2 border-dark" value={userName} onChange={(e) => setUserName(e.target.value)} required />

                    <h5 className="fs-6 mt-4">Password</h5>
                    <input type="password" className="form-control rounded-pill border-2 border-dark" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <h5 className="fs-6 mt-4">Confirm Password</h5>
                    <input type="password" className="form-control rounded-pill border-2 border-dark" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

                    <h5 className="fs-6 mt-4 border-2 border-dark">Phone Number</h5>
                    <PhoneInput
                        country={"us"}
                        value={phoneNumber}
                        inputClass="form-control rounded-pill border-2 border-dark" // Aseguramos bordes aquí
                        buttonClass="border-2 border-dark"
                        onChange={phone => setPhoneNumber(phone)}
                        required
                    />

                    <h5 className="fs-6 mt-4">Purpose of registration</h5>
                    <div className="form-check">
                        <input className="form-check-input border-2 border-dark" type="radio" name="userTypeOptions" value="cliente" checked={userType === "cliente"} onChange={(e) => setUserType(e.target.value)} required />
                        <label className="form-check-label">Client: Book packages.</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input border-2 border-dark" type="radio" name="userTypeOptions" value="hotel" checked={userType === "hotel"} onChange={(e) => setUserType(e.target.value)} required />
                        <label className="form-check-label">Hotel: Publish and manage packages.</label>
                    </div>

                    <div className="form-check mt-3">
                        <input className="form-check-input border-2 border-dark" type="checkbox" id="termsCheckbox" checked={acceptTerms} onChange={() => setAcceptTerms(!acceptTerms)} />
                        <label className="form-check-label" htmlFor="termsCheckbox">
                            I accept the <Link to="/terms">Terms and Conditions</Link>
                        </label>
                    </div>

                    <div className="d-flex flex-column align-items-center justify-content-center mt-5">
                        <button type="submit" className="custom-btn">
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
