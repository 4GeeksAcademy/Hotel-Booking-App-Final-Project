import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/login.css"




export const LoginAccount = () => {
    const { store, actions } = useContext(Context);
    let navigate = useNavigate()
    let response = {}


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
        store.currentUser ? navigate("/") : alert(response.msg)
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

    return (
        <>
            <div className='col-xs-auto container-fluid mt-0' >
                <div className="col-sm-auto d-flex justify-content-center mt-5 mb-0 pb-0">
                    <p id="welcomePageTitleLogin">Welcome to&nbsp;</p>
                    <p id="sereniaPageTitleLogin">Serenia</p>
                </div>
                <div id="loginMessage" className="col-sm-auto d-flex justify-content-center mt-0 p-0 mb-0">
                    <p>Please, log in</p>
                </div>
            </div>


            <div className='col-xs-auto container-fluid w-50 border-secondary mt-0' id="customMarginLogin">
                <form onSubmit={loginUserHandling}>
                    <div className="col-xs-auto row mt-4 mb-4 d-flex justify-content-center">
                        <input type="text" className="loginInputData col-sm-auto form-control" placeholder="Enter your username" id="loginInputUser" name="username"
                            value={data.username} onChange={inpuntHandling} />
                        <div class="invalid-feedback"></div>
                    </div>

                    <div className="col-xs-auto row mt-4 mb-4 d-flex justify-content-center">
                        <input type="password" className="loginInputData form-control" placeholder="Enter your password" id="loginInputPass" name="password"
                            value={data.password} onChange={inpuntHandling}
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

                {/* Terminos y condiciones asi como boton de registro */}
                <div className="col-sm-auto d-flex justify-content-center mt-4">
                    <p className="col-6 d-flex justify-content-end">Don't have an account?</p>
                    <Link to="/signup" className="ms-2 text-primary col-6 d-flex-justify-content-start ">Sign-up! </Link>
                </div>

                <div className="col-sm-auto d-flex justify-content-center mt-1">
                    <p className="col-6 d-flex justify-content-end">By signing up, you agree with our</p>
                    <Link to="/signup" className="ms-2 text-primary col-6 d-flex-justify-content-start ">Terms & Conditions </Link>
                </div>
            </div>
        </>)
}