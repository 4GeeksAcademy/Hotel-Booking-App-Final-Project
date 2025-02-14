import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { googleLogout } from '@react-oauth/google';

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const location = useLocation();
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para controlar la visibilidad en pantallas pequeñas

	const handleLogOut = (e) => {
		e.preventDefault()
		actions.logOutAccount()
		googleLogout()
		navigate("/")

	}

	const handleUserProfile = (e) => {
		e.preventDefault();
		if (store.currentUser) {
			if (store.currentUser.user_type === "cliente") {
				navigate("/profile");
			} else if (store.currentUser.user_type === "hotel") {
				navigate("/hotel-profile/personal-info");
			} else if (store.currentUser.user_type === "admin") {
				navigate("/admin/personal-info");
			}
		}
	};

	// Verificar si la ruta está en la lista de exclusión
	const shouldDisplayMenu =
		location.pathname !== "/" &&
		location.pathname !== "/login" &&
		location.pathname !== "/signup" &&
		location.pathname !== "/reservationcart" &&
		location.pathname !== "/search";

	const shouldHideHamburgerMenu =
		location.pathname === "/login" || location.pathname === "/signup";

	return (
		<nav className="navbar navbar-expand-lg navBarfooterConfig FontDesign container-fluid p-0">
			<div className="container-fluid d-flex justify-content-between align-items-center px-4">
				{/* Logo */}
				<Link to="/" className="SereniaTitle d-flex align-items-center text-light">
					<i className="fa-solid fa-location-dot fs-4 me-1"></i>
					<span className="navbar-brand mb-0 text-light">Serenia</span>
				</Link>

				{/* Botón de menú para pantallas pequeñas */}
				<button
					className="navbar-toggler text-light border-0"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarContent"
					aria-controls="navbarContent"
					aria-expanded={isMobileMenuOpen ? "true" : "false"}
					aria-label="Toggle navigation"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Controlar estado del menú móvil
				>
					<i className="fa-solid fa-bars fs-3"></i>
				</button>

				{/* Contenido del Navbar */}
				<div className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`} id="navbarContent">
					<div className="navbar-nav ms-auto align-items-center gap-3">
						{/* Usuario logueado */}
						{localStorage.getItem("user_session") && store.currentUser ? (
							<div className="d-flex align-items-center gap-3">
								<p className="m-0 fw-none text-light">
									Hello, {store.currentUser?.name}
								</p>
								<div className="dropdown">
									<a
										className="dropdown"
										href="#"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										<i className="fs-2 fa-solid fa-circle-user text-light"></i>
									</a>
									<ul className="dropdown-menu dropdown-menu-end userProfileButton bg-light">
										<li>
											<button
												className="navBarProfileButton text-start w-100"
												onClick={handleUserProfile}
											>
												User profile
											</button>
										</li>
										<li>
											<hr className="dropdown-divider bg-dark mb-0"></hr>
										</li>
										<li>
											<button
												className="navBarProfileButton text-start text-danger mt-0 w-100"
												onClick={handleLogOut}
											>
												Logout
											</button>
										</li>
									</ul>
								</div>
							</div>
						) : location.pathname === "/login" ? (
							false
						) : (
							<button
								className="custom-btn-grey navbar-menu-btn"
								onClick={() => navigate("/login")}
							>
								Login
							</button>
						)}

						{/* Carrito de reservas */}
						{store.currentUser?.user_type === "cliente" &&
							location.pathname !== "/reservationcart" ? (
							<Link
								to="/reservationcart"
								className="icon-app text-light fs-3 ms-3"
							>
								<i className="fa-solid fa-calendar-check"></i>
							</Link>
						) : null}

						{/* Botón de Browse */}
						{location.pathname === "/" && (
							<button
								className={`${localStorage.getItem("user_session") && store.currentUser
									? "custom-btn-grey navbar-menu-btn"
									: "custom-btn-yellow navbar-menu-btn"
									}`}
								onClick={() => navigate("/search")}
							>
								Browse
							</button>
						)}

						{/* Mostrar las opciones del sidebar solo en pantallas pequeñas */}
						{isMobileMenuOpen && store.currentUser?.user_type === "hotel" && shouldDisplayMenu && (
							<>
								<Link to="/hotel-profile/personal-info" className="nav-link text-light">
									Personal Info
								</Link>
								<Link to="/hotel-profile/hotels" className="nav-link text-light">
									Hotels
								</Link>
								<Link to="/hotel-profile/packages" className="nav-link text-light">
									Packages
								</Link>
							</>
						)}
						{isMobileMenuOpen && store.currentUser?.user_type === "cliente" && shouldDisplayMenu && (
							<>
								<Link to="/profile/personal-info" className="nav-link text-light">
									Personal Information
								</Link>
								<Link to="/profile/favorite-hotels" className="nav-link text-light">
									Favorite Hotels
								</Link>
								<Link to="/profile/stay-history" className="nav-link text-light">
									Stay History
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};