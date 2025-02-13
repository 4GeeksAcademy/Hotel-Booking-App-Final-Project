import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import "../../styles/login.css"
import Swal from "sweetalert2";

export const LoginAccount = () => {
    const { store, actions } = useContext(Context);
    let navigate = useNavigate()
    let response = {}

    useEffect(() => {
        store.currentUser ? navigate("/") : console.log("user error")
    }, [])

    //console.log(store.user)
    const [data, setData] = useState({
        username: "",
        password: "",
    });

    //Verifying user data
    const loginUserHandling = async (e) => {
        e.preventDefault()
        let response = await actions.loginAccount(data.username, data.password)
        if (response && store.currentUser) {
            navigate("/");
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid credentials, please try again!',
            });
        }
    };
    // store.currentUser ? navigate("/") : alert(response.msg)

    //getting the user values
    const inpuntHandling = e => {
        e.preventDefault()
        const { name, value } = e.target;
        setData(prevInfo => (
            {
                ...prevInfo, [name]: value
            }));
        //console.log(data);
    }
    const handleGoogleLogin = async (credentialResponse) => {
        try {
            console.log(credentialResponse);
            const email_data = await actions.getGoogleInformation(credentialResponse)
            const login = await actions.loginGoogleAccount(email_data)
            if (store.currentUser) {
                navigate("/");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'User not registered',
                    text: 'Please sign up first.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'There was an error logging in with Google.',
            });
        }
    };
    // store.currentUser ? navigate("/") : alert("User is not registered")
    return (
        <>
            <GoogleOAuthProvider clientId="168580669100-kncvlspb1adg5clh58ne7if2sbo1ocrm.apps.googleusercontent.com">
                <div className='col-xs-auto container-fluid mt-0 FontDesign'>
                    <div className="row d-flex justify-content-center mt-5 mb-0 pb-0">

                        <div className="d-flex justify-content-center col-xs-12 col-md-auto">
                            <span id="welcomePageTitleLogin">Welcome to&nbsp;</span>
                            <span className="colorTitle">Serenia</span>
                        </div>

                    </div>
                    <div id="loginMessage" className="col-sm-auto d-flex justify-content-center mt-0 p-0 mb-0">
                        <p>Please, log in</p>
                    </div>
                </div>


                <div className='FontDesign col-xs-auto container-fluid w-100 border-secondary mt-0' id="customMarginLogin">
                    <form onSubmit={loginUserHandling}>
                        <div className=" row mt-1 mb-4 d-flex justify-content-center">
                            <input type="text" className="InputData min-width-custom w-50 col-sm-auto form-control" placeholder="Username" id="loginInputUser" name="username"
                                value={data.username} onChange={inpuntHandling} />
                            <div class="invalid-feedback"></div>
                        </div>

                        <div className=" row mt-4 mb-4 d-flex justify-content-center">
                            <input type="password" className="InputData min-width-custom w-50 form-control" placeholder="Password" id="loginInputPass" name="password"
                                value={data.password} onChange={inpuntHandling}
                            />
                            <div class="invalid-feedback"></div>
                        </div>

                        {/* Botones de login y de perdida de contraseña */}
                        <div className="d-flex flex-column align-items-center justify-content-center mt-5">
                            <button id="botonLogin" className='custom-btn' type="submit">
                                Login
                            </button>
                        </div>

                        <div className="col-12 d-flex justify-content-center">
                            <button id="botonForgotPassword" className="custom-btn-grey mt-3" type="submit" onClick={() => navigate("reset")}>
                                <div className='text-light fw-bold'>Forgot your password?</div>
                            </button>
                        </div>
                    </form>

                    <div className="d-flex justify-content-center">
                        <div className="w-25 mt-5 d-flex justify-content-center">
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    handleGoogleLogin(credentialResponse)
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                        </div>
                    </div>

                    {/* Terminos y condiciones asi como boton de registro */}
                    <div className="col-sm-auto d-flex justify-content-center text-center mt-4">
                        <p className="">Don't have an account?
                            <Link to="/signup" className="ms-2 text-primary">Sign-up! </Link>
                        </p>

                    </div>

                    <div className="col-sm-auto d-flex justify-content-center text-center mt-1">
                        <p className="">By signing in, you agree with our
                            <Link to="/terms" className="ms-2 text-primary">Terms & Conditions </Link>
                        </p>

                    </div>
                </div>
            </GoogleOAuthProvider>
        </>)
}