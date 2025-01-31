import React, {useState, useEffect, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import {Context} from '../store/appContext.js'



export const PasswordReset = () => {
    let navigate = useNavigate()
    let response = {}
    const { store, actions } = useContext(Context);
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

    return (
        <>
            <div className='container-fluid w-25 border-secondary customMargins'>
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
            </div>
        </>
            
        )
}