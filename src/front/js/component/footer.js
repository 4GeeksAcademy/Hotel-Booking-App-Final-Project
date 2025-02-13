import React from "react";
import "../../styles/footer.css";

export const Footer = () => (
	<footer className="navBarfooterConfig footer mt-auto py-3 text-center">
		<div className="footer-content">
			<p className="mb-3 fw-bold FontDesign text-warning">Contact Us</p>
			<p className="mb-3 FontDesign">
				<i className="bi bi-envelope me-2"></i>
				<span>support@sereniahotels.com</span>
			</p>
			<p className="app-name fw-bold mb-0">Hotel Booking App</p>
			<hr className="bg-light my-4 w-50 mx-auto" />
			<p className="small mb-0">&copy; 2025 Serenia Hotels. All rights reserved.</p>

		</div>
	</footer>
);