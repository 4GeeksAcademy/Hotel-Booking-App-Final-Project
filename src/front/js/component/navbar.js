import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<nav className="navbar navbar-light bg-light FontDesign">
			<div className="container">
				<Link to="/" className="SereniaTitle">
					<span className="navbar-brand mb-0 h1 SereniaTitle">Serenia</span>
				</Link>
				<div className="ml-auto">
					{/* Mostrar el botón de Logout si el usuario está logueado */}
					{store.user_session ? (
						<>
							{/* Botón de Logout */}
							{location.pathname === "/" && (
								<button
									className="btndashboard-signup"
									onClick={() => navigate("/login")}
								>
									Logout
								</button>
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

							{/* Botón de Dashboard en la Vista de Login */}
							{location.pathname === "/login" && (
								<button
									className="btndashboard-signup"
									onClick={() => navigate("/")}
								>
									Dashboard
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