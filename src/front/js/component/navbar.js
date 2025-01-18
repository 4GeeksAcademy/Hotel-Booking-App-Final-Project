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

					 {/* Button for User Profile <--- Temporary
					 <button
                        className="btn btn-outline-success mx-2"
                        onClick={() => navigate("/profile")}
                    >
                        User Profile
                    </button> */}

					 {/* Button for Hotel Profile  <-- Temporary
					 <button
                        className="btn btn-outline-info"
                        onClick={() => navigate("/hotel-profile/personal-info")}
                    >
                        Hotel Profile
                    </button> */}
				</div>

			</div>
		</nav>
	);
};
