import React from "react";
import { Link } from "react-router-dom";
import "../../styles/footer.css";

export const Footer = () => (
	<footer className="navBarfooterConfig footer mt-auto py-3 text-center">
		<div className="footer-content">
			<p className="contact-title">
				{ }
				<Link to="/contact" className="contact-link FontDesign fw-bold">
					Contact Us
				</Link>
			</p>
			<p className="contact-email">support@sereniahotels.com</p>
			<p className="app-name">Hotel Booking App</p>
		</div>
	</footer>
);