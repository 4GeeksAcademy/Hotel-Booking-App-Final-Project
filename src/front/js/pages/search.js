import React, { useContext, useEffect, useState} from "react";
import "../../styles/home.css";

import { useNavigate } from "react-router-dom";
import {Context} from '../store/appContext.js'

export const Search = () => {
	const navigate = useNavigate();
	const {store, actions }  = useContext(Context);
	const [state, setState] = useState(null)
	const [searchInfo, setSearchInfo] = useState({
		hotel_name: "",
		hotel_location: "",
		package_name: "",
		package_date: "",
		price_range_min: "",
		price_range_max: ""
	})
	let contactID = 0;
	let contactName = "";

	useEffect(()=> {
		const loadPage = async () => {
			await actions.loadHotelPackages()
		}
		
		loadPage();
	
	}, []);

    //console.log(store.hotels)
	return(
		<>	
			{/*Busqueda de hoteles */}
			<form className="container-fluid d-flex">
					<div className="col d-flex justify-content-center h-50 mt-5">
						<div className="row d-inline-flex justify-content-center searchBarConfig">
							{/*Por nombre de hotel*/}
							<div className="col me-3">
								<label for="locationSearch" className="label">Hotel</label>
								<div className="group-label">
									<input type="text" className="h-25" placeholder="By hotel name" id="hotelSearch" name = "hotel"
										/> 
									<div class="invalid-feedback"></div> 
								</div>
							</div>
							{/*ubicacion de hotel */}
							<div className="col me-3">
								<label for="locationSearch" className="label">Location</label>
								<div className="group-label">
									<input type="text" className="h-25" placeholder="By Location" id="locationSearch" name = "location"
										/> 
									<div class="invalid-feedback"></div> 
								</div>
							</div>
							{/*Nombre del paquete*/}
							<div className="col me-3">
								<label for="locationSearch" className="label">Package name</label>
								<div className="group-label">
									<input type="text" className="h-25" placeholder="By package name" id="nameSearch" name = "package_name"
										/> 
									<div class="invalid-feedback"></div> 
								</div>
							</div>
							{/*Por fecha de inicio paquete*/}
							<div className="col me-3">
								<label for="locationSearch" className="label">Date</label>
								<div className="group-label">
									<input type="text" className="h-25" placeholder="By check-in date" id="dateSearch" name = "hotel"
										/> 
									<div class="invalid-feedback"></div> 
								</div>
							</div>
							{/*Por precio*/}
							<div className="col">
								<label for="locationSearch" className="label">Price range</label>
								<div className="group-label">
									<input type="text" className="h-25" placeholder="By package name" id="priceSearch" name = "price"
										/> 
									<div class="invalid-feedback"></div> 
								</div>
							</div>
						</div>
					</div>
				
			</form>
			
			
			<div className="hotelPackageList col-6 d-flex justify-content-start  ms-3 h-75 mb-5 mt-5 ps-0">
				<ul className="list-group">
					{ store.hotel_packages ? store.hotel_packages.map((item, index) => {
					return (
						<li
							key={index}
							className="d-flex mt-4"
							>
							<div className="col-4 imgPackage container-fluid ">
								<img className="" src="https://picsum.photos/536/354"/>
							</div>
							

							<div className="col-6 packageDetails container-fluid">
								<div className="fs-2">{item.hotel_package_name}</div>
								<div className="fs-3 mt-3 text-break"><i className="fa-solid fa-location-dot"></i> {item.description}</div>
								<div className="fs-4"><i className="fa-solid fa-phone"></i> {item.price}</div>
							</div>

							<div className="col-2 packageButtons container-fluid d-flex justify-content-start text-break">
								<p>aaaaaaaaaaaaaaaa</p>
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