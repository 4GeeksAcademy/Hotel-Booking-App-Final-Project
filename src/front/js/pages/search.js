import React, { useContext, useEffect, useState} from "react";
import "../../styles/home.css";

import { useNavigate } from "react-router-dom";
import {Context} from '../store/appContext.js'

export const Search = () => {
	const navigate = useNavigate();
	const {store, actions }  = useContext(Context);
	const [state, setState] = useState(null)
	let contactID = 0;
	let contactName = "";

	//useEffect(()=> {actions.loadSomeData()}, []);
    console.log(store.hotels)
	return(
		<>	
			{/*Busqueda de hoteles */}
			<form>
				<div className="col-12 border border-solid d-inline justify-content-center h-25  mb-5 mt-5 ">
					<div className="col-12 border border-solid d-flex justify-content-center  h-50  mt-5">
						<div className="col-12 border border-solid d-flex justify-content-center searchBarConfig">
							{/*Por nombre de hotel*/}
							<div className="border border-solid me-3">
								<label for="locationSearch" className="label">Hotel</label>
								<div className="group-label">
									<input type="text" className="h-25" placeholder="By hotel name" id="hotelSearch" name = "hotel"
										/> 
									<div class="invalid-feedback"></div> 
								</div>
							</div>
							{/*ubicacion de hotel */}
							<div className="border border-solid me-3">
								<label for="locationSearch" className="label">Location</label>
								<div className="group-label">
									<input type="text" className="h-25" placeholder="By Location" id="locationSearch" name = "location"
										/> 
									<div class="invalid-feedback"></div> 
								</div>
							</div>
							{/*Nombre del paquete*/}
							<div className="border border-solid me-3">
								<label for="locationSearch" className="label">Package name</label>
								<div className="group-label">
									<input type="text" className="h-25" placeholder="By package name" id="nameSearch" name = "package_name"
										/> 
									<div class="invalid-feedback"></div> 
								</div>
							</div>
							{/*Por fecha de inicio paquete*/}
							<div className="border border-solid me-3">
								<label for="locationSearch" className="label">Date</label>
								<div className="group-label">
									<input type="text" className="h-25" placeholder="By check-in date" id="dateSearch" name = "hotel"
										/> 
									<div class="invalid-feedback"></div> 
								</div>
							</div>
							{/*Por precio*/}
							<div className="border border-solid">
								<label for="locationSearch" className="label">Price range</label>
								<div className="group-label">
									<input type="text" className="h-25" placeholder="By package name" id="priceSearch" name = "price"
										/> 
									<div class="invalid-feedback"></div> 
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
			
			
			<div className="col-6 border border-solid d-flex justify-content-center ms-3 h-75 mb-5 mt-5">
				<ul className="list-group w-75">
					{ store.hotels ? store.hotels.map((item, index) => {
					return (
						<li
							key={index}
							className="list-group-item d-flex justify-content-between"
							style={{ background: "white", width:"100%"}}>
							<img className="me-5 ms-5 mt-4 mb-4" src="https://picsum.photos/536/354" style= {{"border-radius": "50%", width: "180px", height: "190px"}}/>

							<div className="container ms-5">
							
								<div className="fs-2">{item.name}</div>
								<div className="fs-3 mt-3"><i className="fa-solid fa-location-dot"></i> {item.location}</div>
								<div className="fs-4"><i className="fa-solid fa-phone"></i> {item.coountry}</div>
								<div className="fs-5"><i className="fa-solid fa-envelope"></i> {item.description}</div>
							</div>
							<div className="d-flex justify-content-end">
								<button className='bg-success mb-4' style={{border: "none", height: "40px","border-radius": "5px", "margin-right": "12.5%"}}
									onClick={() => navigate("/addContact")}
								><div className='text-light fw-bold'>Add New Contact</div></button>
							</div>

						</li>
					);
				}) : <p>No contacts right now!</p>
			}
				</ul>
			</div>
		</>
		
	)
}