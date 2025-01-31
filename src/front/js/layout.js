import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { ContactUs } from "./pages/contactUs";
import { Dashboard } from "./pages/dashboard.jsx";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { SignUp } from "./pages/signup.jsx";
import { TermsAndConditions } from "./pages/termsAndConditions.jsx";
import { LoginAccount } from "./pages/login";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Search } from "./pages/search.js";

import UserProfile from "./pages/profilePages/UserProfile";
import PersonalInfo from "./pages/profilePages/PersonalInfo";
import FavoriteHotels from "./pages/profilePages/FavoriteHotels";
import StayHistory from "./pages/profilePages/StayHistory";

import HotelPersonalInfo from "./pages/hotelProfilePages/HotelPersonalInfo";
import Hotels from "./pages/hotelProfilePages/Hotels";
import Packages from "./pages/hotelProfilePages/Packages";
import AddHotel from './pages/hotelProfilePages/AddHotel';
import AddPackage from './pages/hotelProfilePages/AddPackage';

import AdminPersonalInfo from "./pages/adminProfilePages/AdminPersonalInfo";
import AdminExistingHotels from "./pages/adminProfilePages/AdminExistingHotels";
import AdminExistingUsers from "./pages/adminProfilePages/AdminExistingUsers";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div className="layout">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        {/* General Routes */}
                        <Route element={<Dashboard />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<SignUp />} path="/signup" />
                        <Route element={<LoginAccount />} path="/login" />
                        <Route element={<ContactUs />} path="/contact" />
                        <Route element={<Search />} path="/search" />
                        <Route element={<TermsAndConditions />} path="/terms" />

                        {/* User Profile Routes */}
                        <Route element={<UserProfile />} path="/profile">
                            <Route index element={<PersonalInfo />} /> {/* Default route */}
                            <Route path="personal-info" element={<PersonalInfo />} />
                            <Route path="favorite-hotels" element={<FavoriteHotels />} />
                            <Route path="stay-history" element={<StayHistory />} />
                        </Route>

                        {/* Hotel Profile Routes */}
                        <Route element={<HotelPersonalInfo />} path="/hotel-profile/personal-info" />
                        <Route element={<Hotels />} path="/hotel-profile/hotels" />
                        <Route element={<Packages />} path="/hotel-profile/packages" />
                        <Route element={<AddHotel />} path="/hotel-profile/add-hotel" />
                        <Route element={<AddPackage />} path="/hotel-profile/add-package" />

                        {/* Admin Routes */}
                        <Route element={<AdminExistingHotels />} path="/admin/existing-hotels" />
                        <Route element={<AdminExistingUsers />} path="/admin/existing-users" />
                        <Route element={<AdminPersonalInfo />} path="/admin/personal-info" />

                        {/* Fallback Route */}
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
