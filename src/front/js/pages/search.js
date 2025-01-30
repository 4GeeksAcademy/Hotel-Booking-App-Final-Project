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
	const [rangeTest, setRangeTest] = useState(null)

	useEffect(()=> {
		const loadPage = async () => {
			let base_packages = await actions.loadHotelPackages()
			if(base_packages){
				setFilterData([...store.hotel_packages])
			}
		}
		
		loadPage();
		//console.log(filterState)
	
	}, []);


	const packageSearchFilter = (e) => {
		e.preventDefault()
		let hotel_packages_copy = [...store.hotel_packages]
		//let hotel_reduced_search = []
		
		//console.log(searchInfo)
		if (Object.keys(searchInfo).length == 0){
			setFilterState(false)
			setFilterData([...store.hotel_packages])
			return false
		}
		
		let hotel_reduced_search = hotel_packages_copy.reduce((hotel_package, details)=>{
			if(details.hotel_package_name.includes(searchInfo.package_name) || details.price == searchInfo.price ||
				(new Date(searchInfo.package_date).getTime() < new Date(details.end_date).getTime() && 
					new Date(searchInfo.package_date).getTime() > new Date(details.start_date).getTime()) ||
						details.hotel.location.includes(searchInfo.hotel_location)){
					hotel_package.push(details);
			}
			return hotel_package;
		}, []);

		console.log(hotel_reduced_search)
	
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

    //console.log(store.hotels)
	return(
		<>	
			{/*Busqueda de hoteles */}
			<div className="container-fluid d-flex justify-content-center">
				<form onSubmit={packageSearchFilter}>
						<div className="row sm-h-50 mt-5">
							<div className="col d-inline-flex justify-content-center searchBarConfig">
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
										<div className="invalid-feedback"></div> 
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
										<div className="invalid-feedback"></div> 
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
										<div className="invalid-feedback"></div> 
									</div>
								</div>
								{/*Por fecha de inicio paquete*/}
								<div className="col me-4">
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
								{/*Por precio*/}
								<div className="col">
									<label for="locationSearch" className="label">Price range</label>
									<div className="group-label d-flex">
										<input type="number" className="h-25 w-25 p-0 me-2" placeholder="Min price" id="priceSearch" name = "min_price"
											onChange={(e) => {
												const {name, value} = e.target;
												setSearchInfo(prevInfo => ({
													...prevInfo, [name]:value
												}));
											}}
											value = {searchInfo.min_price ? searchInfo.min_price : ""}

											/> 
											<input type="number" className="h-25 w-25 ms-2" placeholder="Max price" id="priceSearch" name = "max_price"
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
						<div className="mt-3 d-flex justify-content-center">
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
			

			<div className="searchBackground container-fluid mt-5">
				<div className="hotelPackageList col-7 d-flex justify-content-start  ms-3 h-75 mb-5 mt-5 ps-0">
					<ul className="list-group">
						{ filteredData ? filteredData.map((item, index) => {
						return (
							<li
								key={index}
								className="d-flex mt-4"
								>
								<div className="col-3 imgPackage container-fluid ">
									<img className="" src="https://picsum.photos/536/354"/>
								</div>
								

								<div className="col-5 packageDetails container-fluid">
								<div className="fs-2">{item.hotel_package_name}</div>
									<div className="fs-4"><i className="fa-solid fa-location-dot"></i> {item.hotel.location}</div>
									<div className="fs-6"><i className="fa-regular fa-calendar"></i> Starting date: {item.start_date}</div>
									<div className="fs-6"><i className="fa-solid fa-calendar"></i> Lasts until: {item.end_date}</div>
									<div className="fs-5 mt-3 mb-2 text-break"> {item.description}</div>
								</div>

								<div className="col-4 container-fluid d-inline-flex justify-content-between text-break mt-auto ">
									<div className="fs-6"><i className="fa-solid fa-money-check-dollar"></i> $ {item.price}</div>
									<button className="btn custom-btn detailsButton h-25 ms-2 mb-2">
										View details
									</button>
									
									
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