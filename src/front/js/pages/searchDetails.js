import React, { useRef, useContext, useEffect, useState} from "react";
import "../../styles/home.css";
import Swal from 'sweetalert2';



import { useNavigate } from "react-router-dom";
import {Context} from '../store/appContext.js'

export const SearchDetails = () => {
    const navigate = useNavigate();
    const {store, actions }  = useContext(Context);
    const [filterState, setFilterState] = useState(false)
    const [filteredData, setFilterData] = useState([])
    const [searchInfo, setSearchInfo] = useState({})
    const [rangeTest, setRangeTest] = useState(null)

    console.log(store.hotelDetails.length)
    useEffect(()=> {
        if(store.hotelDetails.length < 1){
            navigate("/search")
        }
    }, []);

    const showLoginAlert = () => {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please log in to make a reservation.',
                confirmButtonText: 'OK'
            });
           };


    const handleAddToCart = async (package_info) => {
        console.log('entered')
        await actions.addToCart(package_info)
        Swal.fire({
                    icon: 'success',
                    title: 'Item added',
                    text: 'The item was successfully added to the cart!',
                    timer: 2000,
                    showConfirmButton: false,
                });
    }

    console.log(store.hotelDetails)
    //console.log(store.hotels)
    return(
        <div className="h-100 w-75 m-auto mt-5 details-card mb-5">	
            { store.hotelDetails.length < 1 ? false : 
                (
                <div className="d-flex justify-content-center">
                    <div className="d-inline-flex flex-column">
						<div className="row d-flex justify-content-center">
							<div className="col-12">
                                <div className="row d-flex justify-content-center">
                                    <div className="row details-title h-100">
                                        <div className="fs-1 mb-2 text-center text-md-start">{store.hotelDetails.hotel.name}</div>
                                    </div>
                                    
                                    <div className="col-12 col-md-4 p-0 h-auto details-title mt-2">
                                        <img className="h-100 w-100" src={store.hotelDetails.hotel.image_url}/>
                                    </div>
                                                            
                                    <div className="col-12 col-md-7 ms-md-2 h-auto  mt-2 details-title">
                                        <div className="row w-100 mt-2">
                                            <div className="fs-4 text-center text-md-start"><p>{store.hotelDetails.hotel_package_name}</p></div>
                                            <div className="fs-6"><i className="fa-regular fa-calendar mt-3"></i> Starting date: {store.hotelDetails.start_date}</div>
                                            <div className="fs-6"><i className="fa-solid fa-calendar"></i> Lasts until: {store.hotelDetails.end_date}</div>
                                            <div className="fs-6"><i className="fa-solid fa-money-check-dollar"></i> $ {store.hotelDetails.price}</div>
                                            <div className="fs-6"><i className="fa-solid fa-location-dot"></i> {store.hotelDetails.hotel.location}</div>
                                            <div className="fs-6 mt-3 mb-5 text-break "> {store.hotelDetails.description}</div>
                                        </div>
                                        <div className="row d-flex justify-content-center">
                                            <button className="btn custom-btn detailsButton mb-3 w-25" onClick={() =>{
                                                    store.currentUser ? handleAddToCart(store.hotelDetails): showLoginAlert()
                                                }}> 
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                    
                                </div>
                                

                                
                            </div>
                        </div>                  
                    </div>
                </div> )
                                            
            } 
        </div>
        
    )
}