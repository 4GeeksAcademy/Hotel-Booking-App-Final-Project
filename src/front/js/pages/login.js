import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

const customMargins = {
    "margin-top": "15vh",
    padding: "35px",
}

const imgStyle = {
    height:"50%",
    width: "50%",
    "border-radius": "50%"
}


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
    const loginUserHandling = async(e) => {
        e.preventDefault()
        let response = await actions.loginAccount(data.username, data.password)
        //console.log(response)
        response.msg ? alert(response.msg): navigate("/user")
    }

    //getting the user values
    const inpuntHandling = e => {
        e.preventDefault()
        const {name, value} = e.target;
        setData(prevInfo => (
            {
                ...prevInfo, [name]:value
            }));
        //console.log(data);
    }

    return (
    <>
        <div className='col-xs-auto container-fluid mt-0' >
            <div className="col-sm-auto d-flex justify-content-center mt-5 mb-0 pb-0">
                <p style={{"font-size":"48px", "font-weight":"bold", "color":"rgb(0,0,0)"}}>Welcome to&nbsp;</p>
                <p style={{"font-size":"48px","font-weight":"bold", "color":"#30728A"}}>Serenia</p>
            </div>
            <div className="col-sm-auto d-flex justify-content-center mt-0 p-0 mb-0">
                <p style={{"font-weight":"bold", "color":"#B9B9B9"}}>Please, log in</p>
            </div>
        </div>
        

        <div className='col-xs-auto container-fluid w-50 border-secondary mt-0' style={customMargins}>
                <form  onSubmit={loginUserHandling}>
                    <div className="col-xs-auto row mt-4 mb-4 d-flex justify-content-center">
                        <input type="text" className="col-sm-auto form-control" placeholder="Enter your username" id="inputUser" name = "username"
                            value= {data.username}  onChange={inpuntHandling} style={{"min-width":"400px","border":"solid", "border-radius": "20px", "border-width":"2px"}}/>                            
                            <div class="invalid-feedback"></div>
                    </div>
                    
                    <div className="col-xs-auto row mt-4 mb-4 d-flex justify-content-center">
                        <input type="password" className="form-control" placeholder="Enter your password" id="inputPassword" name= "password"
                            value= {data.password}  onChange={inpuntHandling} style={{"min-width":"400px","border":"solid", "border-radius": "20px", "border-width":"2px"}}
                            />
                            <div class="invalid-feedback"></div>
                        </div>            
                        
                    {/* Botones de login y de perdida de contraseña */}
                    <div className="col-xs-auto d-flex justify-content-center mt-5">
                        <button className='col-xs-auto ps-4 pe-4' style={{"min-width":"230px","border": "none", "height": "40px","border-radius": "40px", "background-color":"#30728A"}} type="submit">
                            <div className='text-light fw-bold' >Login</div>
                        </button>
                    </div>
                    <div className="col-12 d-flex justify-content-center">
                        <button className='mt-3 ps-4 pe-4' style={{"min-width":"230px", "border": "none", "height": "40px","border-radius": "40px", "background-color":"#484848"}} type="submit">
                            <div className='text-light fw-bold'>Forgot your password?</div>
                        </button>
                    </div>
                </form>

                    {/* Terminos y condiciones asi como boton de registro */}
                    <div className="col-sm-auto d-flex justify-content-center mt-4">
                            <p className="col-6 d-flex justify-content-end">Don't have an account?</p>
                            <Link to="/signup" className = "ms-2 text-primary col-6 d-flex-justify-content-start ">Sign-up! </Link>
                    </div>
                    
                    <div className="col-sm-auto d-flex justify-content-center mt-1">
                        <p className="col-6 d-flex justify-content-end">By signing up, you agree with our</p>
                        <Link to="/signup" className = "ms-2 text-primary col-6 d-flex-justify-content-start ">Terms & Conditions </Link>
                    </div>
            </div>
    </>)
}