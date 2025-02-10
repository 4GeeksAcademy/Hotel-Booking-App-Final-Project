import React from "react";
import { useNavigate } from 'react-router-dom';

export const TermsAndConditions = () => {
    const navigate = useNavigate();
    return (
        <div className="container py-5">
            <div className="col-12 col-md-8 col-lg-6 mx-auto">
                <h2 className="text-center fw-bold">Terms and Conditions</h2>
                <p className="text-secondary text-center">Last updated: January 2025</p>

                <h4 className="mt-4">1. Introduction</h4>
                <p>
                    Welcome to Serenia! These Terms and Conditions govern the use of our booking platform,
                    where clients can browse and book hotel packages, and hotels can list their properties and manage package offerings.
                    By signing up and using our platform, you agree to comply with these terms.
                </p>

                <h4 className="mt-4">2. User Responsibilities</h4>
                <ul>
                    <li><strong>Clients:</strong> Must provide accurate information when booking and adhere to hotel policies.</li>
                    <li><strong>Hotels:</strong> Are responsible for keeping package details up to date and ensuring bookings are honored.</li>
                </ul>

                <h4 className="mt-4">3. Booking and Payment</h4>
                <p>
                    Serenia facilitates hotel reservations and clients must adhere to the cancellation policies set by the respective hotels.
                </p>

                <h4 className="mt-4">4. Cancellations and Refunds</h4>
                <p>
                    Cancellation and refund policies vary by hotel, these procedures will only be carried out by contacting the specific hotel. Customers should review the specific details of each reservation before proceeding with payment.
                </p>

                <h4 className="mt-4">5. Account Management</h4>
                <p>
                    Users are responsible for maintaining the security of their accounts.
                </p>

                <h4 className="mt-4">6. Limitation of Liability</h4>
                <p>
                    Serenia is a platform connecting clients with hotels but is not liable for any disputes, cancellations, or service issues between the two parties.
                </p>

                <h4 className="mt-4">7. Modifications to Terms</h4>
                <p>
                    Serenia reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
                </p>

                <h4 className="mt-4">8. Contact Information</h4>
                <p>
                    If you have any questions about these terms, please contact us at <strong>support@sereniahotels.com</strong>.
                </p>
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <button className="btn custom-btn" onClick={() => navigate('/signup')}>
                        Go to Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};