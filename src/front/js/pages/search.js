import React, { useRef, useContext, useEffect, useState} from "react";
import "../../styles/home.css";
import Swal from 'sweetalert2';



import { useNavigate } from "react-router-dom";
import {Context} from '../store/appContext.js'

export const Search = () => {
	const navigate = useNavigate();
	const {store, actions }  = useContext(Context);
	const [filterState, setFilterState] = useState(false)
	const [filteredData, setFilterData] = useState([])
	const [searchInfo, setSearchInfo] = useState({})
	const [currentPage, setCurrentPage] = useState(1)
	const [slicedHotels, setSlicedHotels] = useState([])
	const [pagination, setPagination] = useState([])


	const showLoginAlert = () => {
		//console.log(store.currentUser.user_type)
		if(store.currentUser.user_type == "hotel"){
			//console.log("AAAAAAAAA")
			Swal.fire({
				icon: 'warning',
				title: 'Client only feature',
				text: 'Please log in as a client user to make a reservation.',
				confirmButtonText: 'OK'
			});
			return true;
		}
			Swal.fire({
				icon: 'warning',
				title: 'Login Required',
				text: 'Please log in to make a reservation.',
				confirmButtonText: 'OK'
			});
		};


	
	useEffect(()=> {
		const loadPage = async () => {
			let base_packages = await actions.loadHotelPackages()
			if(base_packages){
				setSlicedHotels([...store.hotel_packages.slice(0, 6)])
				for(let i = 0; i <= Math.floor(store.hotel_packages.length/6); i++){
					setPagination(prevPagination => [...prevPagination, i])
				}
			}
			if (store.clicked_hotel){
				searchInfo.hotel_name = store.clicked_hotel
				packageSearchFilter()
			}
		}
		
		loadPage();
		//console.log(filterState)
	}, []);

	useEffect(() => {
		changeData()
	}, [currentPage, filterState, filteredData])

	const changeData= () => {
		console.log(filteredData)
		let hotel_copy = [...store.hotel_packages]

		if(filterState){
			console.log("entrado")
			hotel_copy = []
			hotel_copy = [...filteredData]
		}
		
		console.log(hotel_copy)
		const pageNumber = currentPage
		const startIndex = (pageNumber - 1 ) * 6
    	const endIndex = startIndex + 6
		const sliced_data = hotel_copy.slice(startIndex, endIndex)
		console.log(sliced_data)
		setSlicedHotels([...sliced_data])
	}


	const packageSearchFilter = (e) => {
		e ? e.preventDefault() : false 
		let hotel_packages_copy = [...store.hotel_packages]
		//let hotel_reduced_search = []
		
		//console.log(searchInfo)
		if (Object.keys(searchInfo).length == 0){
			setFilterState(false)
			//setFilterData([...store.hotel_packages])
			setSlicedHotels([...store.hotel_packages.slice(0, 6)])
			return false
		}
		
		let hotel_reduced_search = hotel_packages_copy.reduce((hotel_package, details)=>{
			if(details.hotel_package_name.location.toLowerCase().includes(searchInfo.package_name.toLowerCase()) || 
			details.hotel.name.location.toLowerCase().includes(searchInfo.hotel_name.toLowerCase()) ||
			((searchInfo.min_price ? (parseFloat(details.price) >= parseFloat(searchInfo.min_price)) : searchInfo.max_price ? true : false) 
				&& (searchInfo.max_price ? (parseFloat(details.price) <= parseFloat(searchInfo.max_price)) : searchInfo.min_price ? true : false)) ||
						(new Date(searchInfo.package_date).getTime() < new Date(details.end_date).getTime() && 
							new Date(searchInfo.package_date).getTime() > new Date(details.start_date).getTime()) ||
								details.hotel.location.toLowerCase().includes(searchInfo.hotel_location.locationtoLowerCase())){
									hotel_package.push(details);
			}
			return hotel_package;
		}, []);

		setPagination([])
		for(let i = 0; i <= Math.floor(hotel_reduced_search.length/6); i++){
			setPagination(prevPagination => [...prevPagination, i])
		}
		//console.log(Math.floor(hotel_reduced_search.length/6))

		setFilterState(true)
		setFilterData([...hotel_reduced_search])

		if(currentPage != 1){
			setCurrentPage(1)
		}
		else{
			changeData()
		}
	}

	
	
	const clearFilters = async ()=> {
		setFilterState(false)
		setSearchInfo({})
		setPagination([])
		for(let i = 0; i <= Math.floor(store.hotel_packages.length/6); i++){
			setPagination(prevPagination => [...prevPagination, i])
		}
		
		changeData()
		
	}

	const handleAddToCart = async (package_info) => {
		//console.log('entered')
		await actions.addToCart(package_info)
		Swal.fire({
			icon: 'success',
			title: 'Item added',
			text: 'The item was successfully added to the cart!',
			timer: 2000,
            showConfirmButton: false,
		});
	}

    
	return(
		<>	
		<div className="h-auto FontDesign">
			{/*Busqueda de hoteles */}
			<div className="container d-flex justify-content-center mt-5">
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
							{/*Boton de busqueda */}
							<button  className='btn btn-success searchButton me-2' type="submit">
								<div className='text-light fw-bold'>Search</div>
							</button>

							{/*Boton de limpieza de filtro */}
							<button  className='btn btn-secondary searchButton ms-2' type="button" onClick={() => {
								clearFilters()
							}}>
								<div className='text-light fw-bold'>Clear</div>
							</button>
						</div>
						
				</form>
			</div>
			
			{/* Listado de los paquetes */}
			<div className="searchBackground container-fluid mt-5">
				<div className="hotelPackageList  packageDetails container-fluid d-flex justify-content-start w-100 ms-md-3">
					<div className="d-inline-flex flex-column">
						<div className="row justify-content-center">
							
								{ slicedHotels.length > 0 ? 
									slicedHotels.map((item, index) => {
								return (
									<div
										key={index}
										className="col-11 mt-4 hotel-card ps-0 pe-0"
										>
										<div className="row w-100 justify-content-sm-center m-0 justify-content-md-start p-0 packageCard">
										{/*
											<div className="col-12 col-md-7 d-flex justify-content-center">
												<div className="d-inline-flex flex-column">
													*/}
													<div className="col-12 col-md-3 p-0 rounded-md-0">
														<img className="img-fluid h-100" src={item.hotel.image_url}/>
													</div>
													

													<div className="col-12 col-md-7 ms-sm-2 ms-md-0 overflow-hidden">
														<div className="w-100">
															<div className="fs-1">{item.hotel.name}</div>
															<div className="fs-4 "><p>{item.hotel_package_name}</p></div>
															<div className="fs-4"><i className="fa-solid fa-location-dot"></i> {item.hotel.location}</div>
															<div className="fs-6"><i className="fa-regular fa-calendar"></i> Starting date: {item.start_date}</div>
															<div className="fs-6"><i className="fa-solid fa-calendar"></i> Lasts until: {item.end_date}</div>
															<div className="fs-6"><i className="fa-solid fa-money-check-dollar"></i> $ {item.price}</div>
															<div className="fs-5 mt-3 mb-2 text-break"> {item.description.substr(0, 30) + "..."}</div>
														</div>
														
													</div>
													

													<div className="col-12 col-md-2 mb-2 mt-auto d-flex justify-content-center">
														<div className="row">
															<div className="d-inline-flex flex-column">
																	<button className="w-100 btn custom-btn detailsButton mb-2 me-2" onClick={() =>{
																		(store.currentUser.user_type == "cliente") ? handleAddToCart(item): showLoginAlert()
																		}}> 
																		Add to cart
																	</button>
																	<button className="w-100 btn custom-btn detailsButton " onClick={() => {
																	navigate("/details")
																	store.hotelDetails = item
																	}}>
																		View details
																	</button>
															</div>		
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
						
							{/* <div className="d-none d-md-flex col-md-5 mt-4 h-100 mb-5  justify-content-center">
								<div ref={mapContainer} className="map h-100" />
							</div> */}
						</div>	
						<nav className="col-12 mt-3" aria-label="Page navigation example">
							<ul class="pagination d-flex justify-content-center">
								<li class="page-item">
								<a class="page-link" href="#" aria-label="Previous" 
								onClick={() =>{
										if(currentPage > 1){
											setCurrentPage(currentPage-1)
											
										}
										}}>
									<span aria-hidden="true">&laquo;</span>
								</a>
								</li>
								{pagination.length > 0 ? 
									pagination.map((item, index) => {
										return (
											<li class="page-item" onClick={() =>{
												setCurrentPage(index+1)
												
												
											}
											
										}><a class="page-link" href="#">{index+1}</a></li>
										)
										})
								: <li class="page-item"><a class="page-link" href="#">1</a></li>
								}
								<li class="page-item">
								<a class="page-link" href="#" aria-label="Next" 
									onClick={() =>{
											if(currentPage < (pagination.length )){
												setCurrentPage(currentPage + 1)
											}
						
										}}>
									<span aria-hidden="true">&raquo;</span>
								</a>
								</li>
							</ul>
						</nav>
					</div>
				</div>
				
			</div>
		</div>
		</>
		
	)
}