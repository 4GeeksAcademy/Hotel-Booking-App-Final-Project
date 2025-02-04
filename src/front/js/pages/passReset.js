import React, {useState, useEffect, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import {Context} from '../store/appContext.js'



export const PasswordReset = () => {
    let navigate = useNavigate()
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
        let response = await actions.resetAccPassword(email)   
    }

    console.log(passChange)


    //Verificacion del codigo 
    const acceptPassReset = async(e) => {
        e.preventDefault()
        const inputToCheck = insertedCode.input1 + insertedCode.input2 + insertedCode.input3 + insertedCode.input4
        console.log(inputToCheck)
        const checkCode = await actions.checkPasswordRecovery(email, inputToCheck)
        checkCode.Code == true ? setValidCode(true) : false
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
        passChange.newPassword === passChange.confirm_password && (passChange.newPassword !== ""  &&passChange.confirm_password !== "")
            ? actions.changePassword(passChange, email) : alert("Incorrect!")
    }

    return (
        <>
            <div className='container-fluid d-flex justify-content-center'>
                {!alreadyCode ? (<>
                    <div id="emailAsk">
                        <label for="full_Name" className="form-label fw-bold">E-mail</label>
                        <form  onSubmit={resetPasswordHandle}>
                            <div className="row mb-3">
                                <input type="text" className="form-control" placeholder="Enter your e-mail" id="inputUser" name = "username"
                                    value= {email}  onChange={inpuntHandling}/>                            
                                    <div class="invalid-feedback"></div>
                            </div>
                        </form>
                        <button className='w-100 bg-primary' onClick={resetPasswordHandle}
                            ><div className='text-light fw-bold'>Send Request</div></button>
                        <p onClick={(e) => {
                            setAlreadyCode(true)
                            }} className = "text-primary">Already have a code?</p>
                    </div>
                </> 
                ): !validCode ? (<>
                    <div className="customMargins">
                        {/*Revision de codigo del usuario */}
                        <h3 className="col-12">Reset Password</h3>
                        <form  onSubmit={acceptPassReset} className="col-12 d-flex justify-content-center">
                            <div>
                                {!email || alreadyCode ? 
                                    <input class="w-100"type="text" placeholder="Enter your e-mail" aria-label="digit2" aria-describedby="basic-addon1" name = "code" value = {email}
                                     onChange={
                                            inpuntHandling
                                        }/>
                                    : false
                                    }
                                <div className="resetConfigForm mt-3 mb-3">
                                    <input type="text" aria-label="digit2" aria-describedby="basic-addon1" maxlength="1" id="inputCode" name = "input1" value = {insertedCode.input1}
                                        onChange={
                                            handleCode
                                        }/>
                                    <input type="text" className="ms-3" aria-label="digit3" aria-describedby="basic-addon1" maxlength="1" name = "input2" value = {insertedCode.input2}
                                        onChange={
                                            handleCode
                                        }/>
                                    <input type="text" className="ms-3" aria-label="digit4" aria-describedby="basic-addon1" maxlength="1" name = "input3" value = {insertedCode.input3}
                                        onChange={
                                            handleCode
                                        }/>
                                    <input type="text" className="ms-3" aria-label="digit5" aria-describedby="basic-addon1" maxlength="1" name = "input4" value = {insertedCode.input4}
                                        onChange={
                                            handleCode
                                        }/>
                                </div>
                            </div>
                            
                        </form>
                        <p className="col-12 mt-3">Please input the confirmation code sent to your email.</p>
                        <button className="btn btn-success" onClick={acceptPassReset}>Reset Password</button>
                    </div>
    
                </>): 

                    (<>
                        <div className="customMargins">
                            <h3 className="col-12">Set password for &nbsp;</h3>
                            <h6 className="col-12 mt-3">{email}</h6>
                            <div className="mt-3 mb-3">
                                <div className="row">
                                    <label><p className="fw-bold m-0 p-0">New Password</p></label>
                                    <input className = "mt-2"type="text" aria-label="digit2" aria-describedby="basic-addon1"  id="inputCode" name = "newPassword" value = {passChange.newPassword}
                                            onChange={
                                                handleNewPassword
                                            }/>
                                </div>    
                                <div className="row mt-4">
                                <label><p className="fw-bold m-0 p-0">Confirm Password</p></label>
                                    <input type="text" aria-label="digit2" aria-describedby="basic-addon1"  id="inputCode" name = "confirm_password" value = {passChange.confirm_password}
                                            onChange={
                                                handleNewPassword
                                            }/>
                                </div>   
                                <button className='w-100 bg-primary mt-5' onClick={handlePassChange}
                                     ><div className='text-light fw-bold'>Reset Password</div></button>
                            </div>
                        </div>

                    </>)
                }
                    
            </div>
        </>
            
        )
}