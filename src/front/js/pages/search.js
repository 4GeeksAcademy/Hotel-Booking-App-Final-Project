import React, { useContext, useEffect, useState} from "react";
import "../../styles/home.css";

import { useNavigate } from "react-router-dom";
import {Context} from '../store/appContext.js'

export const Search = () => {
	const navigate = useNavigate();
	const {store, actions }  = useContext(Context);
	const [filterState, setFilterState] = useState(false)
	const [filteredData, setFilterData] = useState([])
	const [searchInfo, setSearchInfo] = useState({})

	useEffect(()=> {
		const loadPage = async () => {
			await actions.loadHotelPackages()
		}
		
		loadPage();
		console.log(filterState)
	
	}, []);


	const packageSearchFilter = (e) => {
		e.preventDefault()
		let hotel_packages_copy = [...store.hotel_packages]
		//let hotel_reduced_search = []
		
		console.log(searchInfo)
		if (Object.keys(searchInfo).length == 0){
			setFilterState(false)
			return false
		}
		
		let hotel_reduced_search = hotel_packages_copy.reduce((hotel, details)=>{
			if(details.hotel_package_name.includes(searchInfo.package_name) || details.price == searchInfo.price ||
				(searchInfo.package_date < details.end_date && searchInfo.package_date > details.start_date)){
					hotel.push(details);
			}
			return hotel;
		}, []);
		console.log(hotel_reduced_search)
	
		setFilterState(true)
		setFilterData([...hotel_reduced_search])	
	}

	const clearFilters = (e) => {
		e.preventDefault()
		setFilterState(false)
		setSearchInfo({})
	}

    //console.log(store.hotels)
	return(
		<>	
			{/*Busqueda de hoteles */}
			<div className="container-fluid d-flex justify-content-center">
				<form onSubmit={packageSearchFilter}>
						<div className="row h-50 mt-5">
							<div className="d-inline-flex justify-content-center searchBarConfig">
								{/*Por nombre de hotel*/}
								<div className="col me-4">
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
										<div class="invalid-feedback"></div> 
									</div>
								</div>
								{/*ubicacion de hotel */}
								<div className="col me-4">
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
										<div class="invalid-feedback"></div> 
									</div>
								</div>
								{/*Nombre del paquete*/}
								<div className="col me-4">
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
										<div class="invalid-feedback"></div> 
									</div>
								</div>
								{/*Por fecha de inicio paquete*/}
								<div className="col me-4">
									<label for="locationSearch" className="label">Date</label>
									<div className="group-label">
										<input type="text" className="h-25" placeholder="By check-in date" id="dateSearch" name = "package_date"
											onChange={(e) => {
												const {name, value} = e.target;
												setSearchInfo(prevInfo => ({
													...prevInfo, [name]:value
												}));
											}}
											value = {searchInfo.package_date ? searchInfo.package_date : ""}

											/> 
										<div class="invalid-feedback"></div> 
									</div>
								</div>
								{/*Por precio*/}
								<div className="col">
									<label for="locationSearch" className="label">Price range</label>
									<div className="group-label">
										<input type="text" className="h-25" placeholder="By package name" id="priceSearch" name = "price"
											onChange={(e) => {
												const {name, value} = e.target;
												setSearchInfo(prevInfo => ({
													...prevInfo, [name]:value
												}));
											}}
											value = {searchInfo.price ? searchInfo.price : ""}

											/> 
										<div class="invalid-feedback"></div> 
									</div>
								</div>
							</div>
							
						</div>
						<div className="mt-3 d-flex justify-content-center">
							<button  className='btn btn-secondary searchButton me-2' type="button" onClick={clearFilters}>
								<div className='text-light fw-bold'>Clear</div>
							</button>
							<button  className='btn btn-success searchButton ms-2' type="submit">
								<div className='text-light fw-bold'>Search</div>
							</button>
						</div>
						
				</form>
			</div>
			

			<div className="searchBackground container-fluid mt-5">
				<div className="hotelPackageList col-6 d-flex justify-content-start  ms-3 h-75 mb-5 mt-5 ps-0">
					<ul className="list-group">
						{ store.hotel_packages && filterState == false ? store.hotel_packages.map((item, index) => {
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
					}) : filteredData ? filteredData.map((item, index) => {
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
					}) : <p className="d-flex justify-content-end">There are currently no packages with those details.</p> 
				}
					</ul>
				</div>
			</div>
			
		</>
		
	)
}