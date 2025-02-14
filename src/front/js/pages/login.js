import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import "../../styles/login.css"
import Swal from 'sweetalert2';





export const LoginAccount = () => {
    const { store, actions } = useContext(Context);
    let navigate = useNavigate()
    let response = {}



    useEffect(() => {
        store.currentUser ? navigate("/") : false
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
        //console.log(response)
        if(store.currentUser){
            Swal.fire({
                    icon: 'success',
                    title: 'Logged in!',
                    text: 'Successfully logged into the system',
                    timer: 2000,
                    showConfirmButton: false,
                });
            setTimeout(() => {navigate("/")}, 2000)
        } else{
            Swal.fire({
                    icon: 'warning',
                    title: 'Incorrect Credentials',
                    text: response,
                    confirmButtonText: 'OK'
                });
        }
    }

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
        //console.log(credentialResponse);
        const email_data = await actions.getGoogleInformation(credentialResponse)
        const login = await actions.loginGoogleAccount(email_data)
        if(store.currentUser){
            Swal.fire({
                    icon: 'success',
                    title: 'Logged in!',
                    text: 'Successfully logged into the system',
                    timer: 2000,
                    showConfirmButton: false,
                });
            setTimeout(() => {navigate("/")}, 2000)
        } else{
            Swal.fire({
                    icon: 'warning',
                    title: 'Incorrect Credentials',
                    text: login,
                    confirmButtonText: 'OK'
                });
        }
    }

    return (
        <>
            <GoogleOAuthProvider clientId="168580669100-kncvlspb1adg5clh58ne7if2sbo1ocrm.apps.googleusercontent.com">
                <div className='col-xs-auto container-fluid mt-0'>
                    <div className="row d-flex justify-content-center mt-5 mb-0 pb-0">

                        <div id="welcomePageTitleLogin" className="d-flex justify-content-center col-xs-12 col-md-auto">
                            <div >Welcome to&nbsp;</div> <div className="colorTitle">Serenia</div>
                        </div>



                    </div>
                    <div id="loginMessage" className="col-sm-auto d-flex justify-content-center mt-0 p-0 mb-0">
                        <p>Please, log in</p>
                    </div>
                </div>


                <div className='col-xs-auto container-fluid w-100 border-secondary mt-0' id="customMarginLogin">
                    <form onSubmit={loginUserHandling}>
                        <div className=" row mt-1 mb-4 d-flex justify-content-center">
                            <input type="text" className="loginInputData col-sm-auto form-control" placeholder="Enter your username" id="loginInputUser" name="username"
                                value={data.username} onChange={inpuntHandling} required/>
                            <div class="invalid-feedback"></div>
                        </div>

                        <div className=" row mt-4 mb-4 d-flex justify-content-center">
                            <input type="password" className="loginInputData form-control" placeholder="Enter your password" id="loginInputPass" name="password"
                                value={data.password} onChange={inpuntHandling} required
                            />
                            <div class="invalid-feedback"></div>
                        </div>

                        {/* Botones de login y de perdida de contraseña */}
                        <div className="col-xs-auto d-flex justify-content-center mt-5">
                            <button id="botonLogin" className='col-xs-auto ps-4 pe-4' type="submit">
                                <div className='text-light fw-bold' >Login</div>
                            </button>
                        </div>
                        <div className="col-12 d-flex justify-content-center">
                            <button id="botonForgotPassword" className='mt-3 ps-4 pe-4' type="submit" onClick={() => navigate("reset")}>
                                <div className='text-light fw-bold'>Forgot your password?</div>
                            </button>
                        </div>
                    </form>
                    <div className="d-flex justify-content-center">
                        <hr className="loginDivider"/>
                    </div>
                    
                    <div className="d-flex justify-content-center">
                        <div className="w-25  d-flex justify-content-center">
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    handleGoogleLogin(credentialResponse)
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                size="large"
                                shape="pill"
                                text="signin_with"
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