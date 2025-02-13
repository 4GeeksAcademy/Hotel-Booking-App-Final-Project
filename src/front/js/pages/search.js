import React, { useRef, useContext, useEffect, useState} from "react";
import "../../styles/home.css";

import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";


import { useNavigate } from "react-router-dom";
import {Context} from '../store/appContext.js'

export const Search = () => {
	const navigate = useNavigate();
	const {store, actions }  = useContext(Context);
	const [filterState, setFilterState] = useState(false)
	const [filteredData, setFilterData] = useState([])
	const [searchInfo, setSearchInfo] = useState({})
	const [rangeTest, setRangeTest] = useState(null)

	//data del mapa
	const mapContainer = useRef(null);
	const map = useRef(null);
	const tokyo = { lng: 139.753, lat: 35.6844 };
	const zoom = 14;
	maptilersdk.config.apiKey = 'XI6RmsHtaHLwSaq5qpLM';

	const urlParams = new URLSearchParams(window.location.search);

	useEffect(() => {
		if (map.current) return; // stops map from intializing more than once
	  
		map.current = new maptilersdk.Map({
		  container: mapContainer.current,
		  style: maptilersdk.MapStyle.STREETS,
		  center: [tokyo.lng, tokyo.lat],
		  zoom: zoom
		});
		new maptilersdk.Marker({color: "#FF0000"})
			.setLngLat([139.7525,35.6846])
			.addTo(map.current);
	  
	  }, [tokyo.lng, tokyo.lat, zoom]);


	
	useEffect(()=> {
		const loadPage = async () => {
			

			let base_packages = await actions.loadHotelPackages()
			if(base_packages){
				setFilterData([...store.hotel_packages])
			}
			if (store.clicked_hotel){
				searchInfo.hotel_name = store.clicked_hotel
				packageSearchFilter()
			}
		}
		
		loadPage();
		//console.log(filterState)
		

	}, []);


	const packageSearchFilter = (e) => {
		e ? e.preventDefault() : false 
		let hotel_packages_copy = [...store.hotel_packages]
		//let hotel_reduced_search = []
		
		//console.log(searchInfo)
		if (Object.keys(searchInfo).length == 0){
			setFilterState(false)
			setFilterData([...store.hotel_packages])
			return false
		}
		
		let hotel_reduced_search = hotel_packages_copy.reduce((hotel_package, details)=>{
			if(details.hotel_package_name.includes(searchInfo.package_name) || 
			details.hotel.name.includes(searchInfo.hotel_name) ||
			((searchInfo.min_price ? details.price >= searchInfo.min_price : searchInfo.max_price ? true : false) 
				&& (searchInfo.max_price ? details.price <= searchInfo.max_price : searchInfo.min_price ? true : false)) ||
						(new Date(searchInfo.package_date).getTime() < new Date(details.end_date).getTime() && 
							new Date(searchInfo.package_date).getTime() > new Date(details.start_date).getTime()) ||
								details.hotel.location.includes(searchInfo.hotel_location)){
							hotel_package.push(details);
			}
			return hotel_package;
		}, []);

		//console.log(hotel_reduced_search)
	
		setFilterState(true)
		setFilterData([...hotel_reduced_search])	
	}
	console.log(filteredData)

	const clearFilters = (e) => {
		e.preventDefault()
		setFilterState(false)
		setSearchInfo({})
		setFilterData([...store.hotel_packages])
	}

	const handleAddToCart = async (package_info) => {
		console.log('entered')
		await actions.addToCart(package_info)
	}

    //console.log(store.hotels)
	return(
		<>	
		<div>

	
			{/*Busqueda de hoteles */}
			<div className="container d-flex justify-content-center">
				<form className= "d-flex flex-column justify-content-center" onSubmit={packageSearchFilter}>
							<div className="row searchBarConfig">
								{/*Por nombre de hotel*/}
								<div className="col-12 col-md-6 col-lg-2 d-flex justify-content-center">
									<div className="d-inline-flex flex-column">
										<label for="locationSearch" className="label">Hotel</label>
										<div className="group-label">
											<input type="text" className="h-25" placeholder="By hotel name" id="hotelSearch" name = "hotel_name"
												onChange={(e) => {
													const {name, value} = e.target;
													setSearchInfo(prevInfo => ({
														...prevInfo, [name]:value
													}));
												}}

												value = {searchInfo.hotel_name ? searchInfo.hotel_name : ""}

												/> 
											<div className="invalid-feedback"></div> 
										</div>
									</div>
								</div>
								{/*ubicacion de hotel */}
								<div className="col-12 col-md-6 col-lg-2 d-flex justify-content-center">
									<div className="d-inline-flex flex-column">
									<label for="locationSearch" className="label">Location</label>
									<div className="group-label">
											<input type="text" className="h-25" placeholder="By Location" id="locationSearch" name = "hotel_location"
												onChange={(e) => {
													const {name, value} = e.target;
													setSearchInfo(prevInfo => ({
														...prevInfo, [name]:value
													}));
												}}
												value = {searchInfo.hotel_location ? searchInfo.hotel_location : ""}


												/> 
											<div className="invalid-feedback"></div> 
										</div>
									</div>
								</div>
								{/*Nombre del paquete*/}
								<div className="col-12 col-md-6 col-lg-2 d-flex justify-content-center">
									<div className="d-inline-flex flex-column">
										<label for="locationSearch" className="label">Package name</label>
										<div className="group-label">
											<input type="text" className="h-25" placeholder="By package name" id="nameSearch" name = "package_name"
												onChange={(e) => {
													const {name, value} = e.target;
													setSearchInfo(prevInfo => ({
														...prevInfo, [name]:value
													}));
												}}
												value = {searchInfo.package_name ? searchInfo.package_name : ""}
												/> 
											<div className="invalid-feedback"></div> 
										</div>
									</div>
								</div>
								{/*Por fecha de inicio paquete*/}
								<div className="col-12 col-md-6 col-lg-2 d-flex justify-content-center">
									<div className="d-inline-flex flex-column">
										<label for="locationSearch" className="label">Date</label>
										<div className="group-label">
											<input type="date" className="h-25" placeholder="By check-in date" id="dateSearch" name = "package_date"
												onChange={(e) => {
													const {name, value} = e.target;
													setSearchInfo(prevInfo => ({
														...prevInfo, [name]:value
													}));
												}}
												value = {searchInfo.package_date ? searchInfo.package_date : ""}

												/> 
											<div className="invalid-feedback"></div> 
										</div>
									</div>
								</div>
								{/*Por precio*/}
								<div className="col-12 col-md-6 col-lg-2 d-flex justify-content-center">
									<div className="d-inline-flex flex-column">
										<label for="locationSearch" className="label">Min Price</label>
										<div className="group-label d-flex">
											<input type="number" className="h-25 p-0" placeholder="Min price" id="priceSearch" name = "min_price"
												onChange={(e) => {
													const {name, value} = e.target;
													setSearchInfo(prevInfo => ({
														...prevInfo, [name]:value
													}));
												}}
												value = {searchInfo.min_price ? searchInfo.min_price : ""}

												/> 
											<div className="invalid-feedback"></div> 
										</div>
									</div>
								</div>
								<div className="col-12 col-md-6 col-lg-2 d-flex justify-content-center">
									<div className="d-inline-flex flex-column">
										<label for="locationSearch" className="label">Max Price</label>
										<div className="group-label d-flex">
											<input type="number" className="h-25" placeholder="Max price" id="priceSearch" name = "max_price"
														onChange={(e) => {
															const {name, value} = e.target;
															setSearchInfo(prevInfo => ({
																...prevInfo, [name]:value
															}));
														}}
														value = {searchInfo.max_price ? searchInfo.max_price : ""}
														/> 
											<div className="invalid-feedback"></div> 
										</div>
									</div>
								</div>
							</div>	
						
						<div className="col mt-3 d-flex justify-content-center">
							{/*Boton de limpieza de filtro */}
							<button  className='btn btn-secondary searchButton me-2' type="button" onClick={clearFilters}>
								<div className='text-light fw-bold'>Clear</div>
							</button>
							{/*Boton de busqueda */}
							<button  className='btn btn-success searchButton ms-2' type="submit">
								<div className='text-light fw-bold'>Search</div>
							</button>
						</div>
						
				</form>
			</div>
			
			{/* Listado de los paquetes */}
			<div className="searchBackground container-fluid mt-5 pb-5">
				<div className="hotelPackageList  packageDetails container-fluid d-flex justify-content-start w-100 ms-3 mb-5 ps-0 pb-5">
					<div className="d-inline-flex flex-column">
						<div className="row">
							<div className="col-12 col-md-7">
								{ filteredData.length > 0 ? filteredData.map((item, index) => {
								return (
									<div
										key={index}
										className="packageCard d-flex mt-4"
										>
										<div className="row w-100">
										{/*
											<div className="col-12 col-md-7 d-flex justify-content-center">
												<div className="d-inline-flex flex-column">
													*/}
													<div className="col-12 col-md-3 imgPackage">
														<img className="" src={item.hotel.image_url}/>
													</div>
													

													<div className="col-12 col-md-7 overflow-hidden">
														<div className="w-100">
															<div className="fs-1">{item.hotel.name}</div>
															<div className="fs-4 text-nowrap"><p>{item.hotel_package_name}</p></div>
															<div className="fs-4"><i className="fa-solid fa-location-dot"></i> {item.hotel.location}</div>
															<div className="fs-6"><i className="fa-regular fa-calendar"></i> Starting date: {item.start_date}</div>
															<div className="fs-6"><i className="fa-solid fa-calendar"></i> Lasts until: {item.end_date}</div>
															<div className="fs-6"><i className="fa-solid fa-money-check-dollar"></i> $ {item.price}</div>
															<div className="fs-5 mt-3 mb-2 text-break"> {item.description.substr(0, 30) + "..."}</div>
														</div>
														
													</div>
													

													<div className="col-12 col-md-2 text-break mt-auto">
														<div className="w-100">
															{store.currentUser ? (store.currentUser.user_type == "cliente"? (<>
																<button className="btn custom-btn detailsButton mb-2 ms-auto" onClick={() =>{
																	handleAddToCart(item)
																	}}> 
																	Add to cart
																</button>
															</>
																):  false) : false
															} 
																
															<button className="btn custom-btn detailsButton ms-auto mb-2" onClick={() => {
																navigate("/details")
																store.hotelDetails = item
															}}>
																View details
															</button>
														</div>
													</div>

												{/* </div>
											</div>
										*/}
										</div> 
									</div>
								);
							}) : <p className="d-flex text-end">There are currently no packages with those details.</p> 
						}
							</div>
							<div className="col-md-5 mt-4 h-100">
								<div ref={mapContainer} className="map" />
							</div>
						</div>	
					</div>
				</div>
			</div>
		</div>
		</>
		
	)
}