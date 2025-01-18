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



	return (
		<nav className="navbar navBarConfig p-0 FontDesign container-fluid">
			<div className="container-fluid d-flex justify-content-between ms-5 me-5">
				<Link to="/" className="SereniaTitle">
					<span className="navbar-brand mb-0 h1 text-light SereniaTitle">Serenia</span>
				</Link>
				<div className="ml-auto">
					{/* Mostrar el botón de Logout si el usuario está logueado */}
					{localStorage.getItem("user_session") ? (
						<>
							{/* Botón de Logout */}
							{location.pathname === "/" && localStorage.getItem("user_session") && (

								<div class="dropdown">
								<a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									<i className="fa-solid fa-circle-user text-light"></i>
								</a>

								<ul class="dropdown-menu userProfileButton">
								<li><a className=" text-warning"
									onClick={handleLogOut} href="#">Logout</a></li>
								</ul>
								</div>
							)}
						</>
					) : (
						<>
							{/* Botón de Login si no está logueado */}
							{location.pathname === "/" && (
								<button
									className="btndashboard-signup"
									onClick={() => navigate("/login")}
								>
									Login
								</button>
							)}

							{/* Botón de Login dentro de Vista SignUp */}
							{location.pathname === "/signup" && (
								<button
									className="btnlogin-signup"
									onClick={() => navigate("/login")}
								>
									Login
								</button>
							)}
						</>
					)}

					{/* Botón de Dashboard en Vista SignUp */}
					{location.pathname === "/signup" && (
						<button
							className="btndashboard-signup"
							onClick={() => navigate("/")}
						>
							Dashboard
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};