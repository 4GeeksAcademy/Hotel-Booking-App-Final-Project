import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
	const location = useLocation();
	return (
		<nav className="navbar navbar-light bg-light">
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

					{/* Botón de Login dentro de Vista SignUp */}
					{location.pathname === "/signup" && (
						<button className="btn btn-secondary">
							Login
						</button>
					)}

				</div>

			</div>
		</nav>
	);
};
