import React, {useState, useEffect, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import {Context} from '../store/appContext.js'



export const PasswordReset = () => {
    let navigate = useNavigate()
    let response = {}
    const { store, actions } = useContext(Context);
    const [insertedCode, setInsertedCode] = useState({
        input1: "",
        input2: "",
        input3: "",
        input4: "",
    })
    //console.log(store.user)
    const [data, setData] = useState({
        username: "",
        password: "",
      });


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
    // useEffect(

    // ,[response]) 

    const resetPasswordHandle = async(e) => {
        e.preventDefault()
        let response = await actions.resetAccPassword(data.username)
        //console.log(response)
    }

    const acceptPassReset = async(e) => {
        e.preventDefault()
        const inputToCheck = insertedCode.inpu1 + insertedCode.inpu2 + insertedCode.inpu3 + insertedCode.inpu4
        inputToCheck == store.resetCode ? console.log("successful!") : alert("Wrong code")
    }
    console.log(insertedCode)

    return (
        <>
            <div className='container-fluid d-flex justify-content-center customMargins'>
                {!store.resetCode && Date.now() > store.codeExpiration ? (<>
                    <form  onSubmit={resetPasswordHandle}>
                        <label for="full_Name" className="form-label fw-bold">E-mail</label>
                        <div className="row mb-3">
                            <input type="text" className="form-control" placeholder="Enter your e-mail" id="inputUser" name = "username"
                                value= {data.username}  onChange={inpuntHandling}/>                            
                                <div class="invalid-feedback"></div>
                        </div>
                        <button className='w-100 bg-primary' type="submit"
                        ><div className='text-light fw-bold'>Send Request</div></button>
                    </form>
                    <Link to="/signup" className = "text-primary">Don't have an account? Sign-up!</Link>
                </> 
                ): (<>
                    <div>
                        <h3 className="col-12">Reset Password</h3>
                        <form  onSubmit={acceptPassReset} className="col-12 d-flex justify-content-center">
                            <div className="mt-3 mb-3">
                                <input type="text" aria-label="digit2" aria-describedby="basic-addon1" maxlength="1"
                                    onChange={(e) => {
                                        setInsertedCode({input1: e.target.value})
                                    }}/>
                                <input type="text" className="ms-3" aria-label="digit3" aria-describedby="basic-addon1" maxlength="1"
                                    onChange={(e) => {
                                        setInsertedCode({input2: e.target.value})
                                    }}/>
                                <input type="text" className="ms-3" aria-label="digit4" aria-describedby="basic-addon1" maxlength="1"
                                    onChange={(e) => {
                                        setInsertedCode({input3: e.target.value})
                                    }}/>
                                <input type="text" className="ms-3" aria-label="digit5" aria-describedby="basic-addon1" maxlength="1"
                                    onChange={(e) => {
                                        setInsertedCode({input4: e.target.value})
                                    }}/>
                            </div>
                        </form>
                        <p className="col-12 mt-3">Please input the confirmation code sent to your email.</p>
                        <button className="text-light" onClick={acceptPassReset}>Reset Password</button>
                    </div>
    
                </>) 
                }
                    
            </div>
        </>
            
        )
}