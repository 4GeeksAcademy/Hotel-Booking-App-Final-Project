import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const location = useLocation();
	const navigate = useNavigate();

	const handleLogOut = (e) => {
		e.preventDefault()
		actions.logOutAccount()
		navigate("/")

	}

	const handleUserProfile = (e) => {
		e.preventDefault()
		if (store.currentUser) {
			if (store.currentUser.user_type == "cliente") {
				navigate("/profile")
			}
			else if (store.currentUser.user_type == "hotel") {
				navigate("/hotel-profile/personal-info")
			}
			else if (store.currentUser.user_type == "admin") {
				navigate("/admin/personal-info")
			}
		}
	}

	console.log(location.pathname)

	return (
		<nav className="navbar navBarfooterConfig p-0 FontDesign container-fluid">
			<div className="container-fluid d-flex justify-content-between align-items-center ms-5 me-5">
				<Link to="/" className="SereniaTitle d-flex align-items-center text-light ms-0">
					<i className="fa-solid fa-location-dot fs-4 me-1"></i>
					<span className="navbar-brand mb-0 text-light">
						Serenia
					</span>
				</Link>

				{/* <div className="ml-auto d-flex"> */}
				<div className="d-flex align-items-center gap-3">
					{/* Mostrar el botón de Logout si el usuario está logueado */}
					{localStorage.getItem("user_session") && store.currentUser ? (
						<>
							{/* Botón de funciones de usuario */}
							{localStorage.getItem("user_session") && (
								<div className="col mb-0 navBar w-100 Dropdown-Setup row d-flex justify-content-start">
									<p className="col m-auto h-100 fw-none text-light text-end" onClick={() => { navigate("/search") }}> Browse </p>
									{/* Mensaje saludando al usuario */}
									<p className="col m-auto h-100 w-75 fw-none text-light text-end">Hello, {store.currentUser && store.currentUser.name}</p>

									{/* Funciones especificas del usuario a traves del navBar */}
									<div className="dropdown w-25 h-100 m-auto  d-flex justify-content-start">
										<a className="dropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
											<i className="fs-2  fa-solid fa-circle-user text-light"></i>
										</a>
										<ul class="dropdown-menu dropdown-menu-end userProfileButton bg-light">
											<li><button className="navBarProfileButton text-start w-100 h-100"
												onClick={handleUserProfile} href="#">User profile</button></li>
											<li><hr className="dropdown-divider bg-dark mb-0"></hr></li>
											<li><button className="navBarProfileButton text-start text-danger mt-0 w-100 h-100"
												onClick={handleLogOut} href="#">Logout</button></li>
										</ul>
									</div>
								</div>

							)}
						</>
					) : location.pathname == "/login" ? false : (
						<>
							{/* Botón de Login si no está logueado */}
							{(
								<>
									<div className="col mb-0 navBar w-100 Dropdown-Setup row d-flex justify-content-start">
										<p className="col m-auto h-100 fw-none text-light text-end" onClick={() => { navigate("/search") }}> Browse </p>
									</div>
									<button
										className="custom-btn-login"
										onClick={() => navigate("/login")}
									>
										Login
									</button>
								</>

							)}
						</>
					)}
					{/* Botón del carrito de reservas, solo en "/" y para clientes */}
					{store.currentUser?.user_type === "cliente" && location.pathname !== "/reservationcart" ? (
						<Link to="/reservationcart" className="icon-app text-light fs-3 ms-3">
							<i className="fa-solid fa-calendar-check"></i>
						</Link>
					) : false}
				</div>
			</div>
		</nav >
	);
};