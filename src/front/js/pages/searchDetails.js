import React, { useRef, useContext, useEffect, useState} from "react";
import "../../styles/home.css";



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


    const handleAddToCart = async (package_info) => {
        console.log('entered')
        await actions.addToCart(package_info)
    }

    console.log(store.hotelDetails)
    //console.log(store.hotels)
    return(
        <div className="h-100">	
            { store.hotelDetails.length < 1 ? false : 
                (
                <div className="d-flex justify-content-center">
                    <div className="d-inline-flex flex-column">
						<div className="row d-flex justify-content-center">
							<div className="col-12 col-md-7"></div>
                                <div className="row d-flex justify-content-center">
                                    <div className="fs-1">{store.hotelDetails.hotel.name}</div>
                                    <div className="col-12 col-md-3 imgPackage">
                                        <img className="" src={store.hotelDetails.hotel.image_url}/>
                                    </div>
                                                                

                                    <div className="col-12 col-md-7 overflow-hidden">
                                        <div className="w-100">
                                            
                                            <div className="fs-4 text-nowrap"><p>{store.hotelDetails.hotel_package_name}</p></div>
                                            <div className="fs-4"><i className="fa-solid fa-location-dot"></i> {store.hotelDetails.hotel.location}</div>
                                            <div className="fs-6"><i className="fa-regular fa-calendar"></i> Starting date: {store.hotelDetails.start_date}</div>
                                            <div className="fs-6"><i className="fa-solid fa-calendar"></i> Lasts until: {store.hotelDetails.end_date}</div>
                                            <div className="fs-6"><i className="fa-solid fa-money-check-dollar"></i> $ {store.hotelDetails.price}</div>
                                            <div className="fs-5 mt-3 mb-2 text-break"> {store.hotelDetails.description}</div>
                                        </div>
                                                                    
                                    </div>
                                                                

                                    <div className="col-12 col-md-2 text-break mt-auto">
                                        <div className="w-100">
                                            {store.currentUser ? (store.currentUser.user_type == "cliente" ? (<>
                                                <button className="btn custom-btn detailsButton mb-2 ms-auto" onClick={() =>{
                                                    handleAddToCart(item)
                                                }}> 
                                                    Add to cart
                                                </button>
                                            </>):  false) : false
                                            } 
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