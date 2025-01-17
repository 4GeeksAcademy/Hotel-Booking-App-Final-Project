import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<nav className="navbar navbar-light bg-light FontDesign">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">

					{/* Link que venía en plantilla, solo le puse el location */}
					{location.pathname === "/" && (
						<Link to="/demo">
							<button className="btn btn-primary">Check the Context in action</button>
						</Link>
					)}

					{/* Botón de regreso al Dashboard (home) dentro de Vista SignUp */}
					{location.pathname === "/signup" && (
						<button
							className="btndashboard-signup"
							onClick={() => navigate("/")}
						>
							Dashboard
						</button>
					)}

					{/* Botón de Login dentro de Vista SignUp */}
					{location.pathname === "/signup" && (
						<button className="btnlogin-signup" onClick={() => navigate("/login")}>
							Login
						</button>
					)}
				</div>

			</div>
		</nav>
	);
};
