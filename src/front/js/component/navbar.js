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



	return (
		<nav className="navbar navBarConfig p-0 FontDesign container-fluid">
			<div className="container-fluid d-flex justify-content-between ms-5 me-5">
				<Link to="/" className="SereniaTitle">
					<span className="navbar-brand mb-0 h1 text-light SereniaTitle">Serenia</span>
				</Link>
				<div className="ml-auto">
					{/* Mostrar el botón de Logout si el usuario está logueado */}
					{localStorage.getItem("user_session") && store.currentUser ? (
						<>
							{/* Botón de funciones de usuario */}
							{localStorage.getItem("user_session") && (
								<div className="mb-0 navBar Dropdown-Setup row d-flex justify-contente-start">
									{/* Mensaje saludando al usuario */}
									<p className="mb-0 pb-0 w-75 fw-none text-light text-end">Hello, {store.currentUser && store.currentUser.name}</p>
									{/* Funciones especificas del usuario a traves del navBar */}
									<div className="dropdown mb-0 w-25 d-flex justify-content-start">
										<a className="dropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
											<i className="fs-2 mb-0 fa-solid fa-circle-user text-light"></i>
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
					) : (
						<>
							{/* Botón de Login si no está logueado */}
							{(
								<button
									className="btndashboard-signup"
									onClick={() => navigate("/login")}
								>
									Login
								</button>
							)}

						</>
					)}
				</div>
			</div>
		</nav>
	);
};