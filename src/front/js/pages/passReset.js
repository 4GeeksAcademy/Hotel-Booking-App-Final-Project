import React, {useState, useEffect, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import {Context} from '../store/appContext.js'
import Swal from 'sweetalert2';



export const PasswordReset = () => {
    const navigate = useNavigate()
    let response = {}
    const { store, actions } = useContext(Context);
    const [alreadyCode, setAlreadyCode] = useState(false)
    const [validCode, setValidCode] = useState(false)
    const [email, setEmail] = useState("")
    const [passChange, setPassChange] = useState({
        newPassword: "",
        confirm_password: ""
    })

    const [insertedCode, setInsertedCode] = useState({
        input1: "",
        input2: "",
        input3: "",
        input4: "",
    })
    //console.log(store.user)


    useEffect(() => {
        setAlreadyCode(false)
     },[]) 

    
     //getting the user values
    const inpuntHandling = e => {
        e.preventDefault()
        const {name, value} = e.target;
        setEmail(value);
        //console.log(data);
    }
     

    const resetPasswordHandle = async(e) => {
        e.preventDefault()
        const response = await actions.resetAccPassword(email)  
        if(response.account) {
            Swal.fire({
                        icon: 'warning',
                        title: 'Email error',
                        text: response.account,
                        confirmButtonText: 'OK'
                    });
        }
        else{
            Swal.fire({
                        icon: 'success',
                        title: 'Email verification',
                        text: 'Successfully sent the email verification code!',
                        timer: 2000,
                        showConfirmButton: false,
                    });
        } 
    }

    console.log(passChange)


    //Verificacion del codigo 
    const acceptPassReset = async(e) => {
        e.preventDefault()
        if(email.length < 1){
            Swal.fire({
                icon: 'warning',
                title: 'email input',
                text: "Please input your email",
                confirmButtonText: 'OK'
            });
            return false
        }
        const inputToCheck = insertedCode.input1 + insertedCode.input2 + insertedCode.input3 + insertedCode.input4
        //console.log(inputToCheck)
        const checkCode = await actions.checkPasswordRecovery(email, inputToCheck)
        console.log(checkCode)
        if(checkCode.message) {
            Swal.fire({
                        icon: 'warning',
                        title: 'Password reset error',
                        text: checkCode.message,
                        confirmButtonText: 'OK'
                    });
        }
        else{
            setValidCode(true)
        }
        
    }


    //tomar codigo de verificacion
    const handleCode = e => {
        const { name, value } = e.target;
        setInsertedCode(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleNewPassword = e => {
        const { name, value } = e.target;
        setPassChange(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    //creacion de nueva password
    const handlePassChange = async (e) => {
        if (passChange.newPassword === passChange.confirm_password && (passChange.newPassword !== ""  &&passChange.confirm_password !== "")){
            actions.changePassword(passChange.newPassword, email)
            Swal.fire({
                        icon: 'success',
                        title: 'Password change',
                        text: 'Successfully changed your password!',
                        timer: 2000,
                        showConfirmButton: false,
                    });
            navigate("/")
            return true
        }
        else{
            Swal.fire({
                icon: 'warning',
                title: 'Password miss match',
                text: "Both password need to be the same!",
                confirmButtonText: 'OK'
            });
        }
    }

    return (
        <>
            {/*Form para envio de codigo*/}
            <div className='container-fluid d-flex justify-content-center mb-5 pb-5'>
                {!alreadyCode ? (<>
                    <div id="emailAsk">
                        <label for="full_Name" className="form-label fw-bold">E-mail</label>
                        <form  onSubmit={resetPasswordHandle}>
                            <div className="row mb-3">
                                <input type="text" className="form-control password-reset" placeholder="Enter your e-mail" id="inputUser" name = "username"
                                    value= {email}  onChange={inpuntHandling}/>                            
                                    <div class="invalid-feedback"></div>
                            </div>
                        </form>
                        <button className='w-100 custom-btn' onClick={resetPasswordHandle}
                            ><div className='text-light fw-bold'>Send Request</div></button>
                        <p onClick={(e) => {
                            setAlreadyCode(true)
                            }} className = "text-primary">Already have a code?</p>
                    </div>
                </> 
                ): !validCode ? (<>
                    {/*Form para verificacion del codigo*/}
                    <div className="customMargins">
                        {/*Revision de codigo del usuario */}
                        <h3 className="col-12">Reset Password</h3>
                        <form  onSubmit={acceptPassReset} className="col-12 d-flex justify-content-center p-2">
                            <div>
                                {!email || alreadyCode ? 
                                    <input className="password-reset" type="text" placeholder="Enter your e-mail" aria-label="digit2" aria-describedby="basic-addon1" name = "code" value = {email}
                                     onChange={
                                            inpuntHandling
                                        }/>
                                    : false
                                    }
                                <div className="row resetConfigForm mt-3 mb-2 justify-content-center">
                                    <input className= "col-3 " type="text" aria-label="digit2" aria-describedby="basic-addon1" maxlength="1" id="inputCode" name = "input1" value = {insertedCode.input1} required
                                        onChange={
                                            handleCode
                                        }/>
                                    <input className= "col-3 ms-2" type="text"  aria-label="digit3" aria-describedby="basic-addon1" maxlength="1" name = "input2" value = {insertedCode.input2} required
                                        onChange={
                                            handleCode
                                        }/>
                                    <input className= "col-3 ms-2" type="text"  aria-label="digit4" aria-describedby="basic-addon1" maxlength="1" name = "input3" value = {insertedCode.input3} required
                                        onChange={
                                            handleCode
                                        }/>
                                    <input className= "col-3 ms-2"  type="text" aria-label="digit5" aria-describedby="basic-addon1" maxlength="1" name = "input4" value = {insertedCode.input4} required
                                        onChange={
                                            handleCode
                                        }/>
                                </div>
                            </div>
                            
                        </form>
                        <p className="col-12 mt-2 text-center ">Please input the confirmation code sent to your email.</p>
                        <div className="d-flex justify-content-center">   
                            <button className="custom-btn" onClick={acceptPassReset}>Reset Password</button>
                        </div>
                        
                    </div>
    
                </>): 

                    (<>
                        {/*Form para reinicio de password*/}
                        <div className="customMargins">
                            <h3 className="col-12">Set password for &nbsp;</h3>
                            <h6 className="col-12 mt-3">{email}</h6>
                            <div className="mt-3 mb-3 ">
                                <div className="row justify-content-center">
                                    <label><p className="fw-bold ms-2 mb-0 p-0">New Password</p></label>
                                    <input className = "mt-2 w-75 password-reset" type="password" aria-label="digit2" aria-describedby="basic-addon1"  id="inputCode" name = "newPassword" value = {passChange.newPassword}
                                            onChange={
                                                handleNewPassword
                                            }/>
                                </div>    
                                <div className="row mt-4 justify-content-center">
                                <label><p className="fw-bold ms-2 mb-0 p-0">Confirm Password</p></label>
                                    <input className="w-75 password-reset" type="password" aria-label="digit2" aria-describedby="basic-addon1"  id="inputCode" name = "confirm_password" value = {passChange.confirm_password}
                                            onChange={
                                                handleNewPassword
                                            }/>
                                </div>   

                                <button className=' mt-5 mb-2 custom-btn' onClick={handlePassChange}>
                                    Reset Password
                                </button>
                            </div>
                        </div>

                    </>)
                }
                    
            </div>
        </>
            
        )
}