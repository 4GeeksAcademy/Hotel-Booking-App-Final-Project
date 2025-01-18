import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { ContactUs } from "./pages/contactUs";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { SignUp } from "./pages/signup.jsx";
import { LoginAccount } from "./pages/login";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";


import UserProfile from "./pages/profilePages/UserProfile";
import PersonalInfo from "./pages/profilePages/PersonalInfo";
import FavoriteHotels from "./pages/profilePages/FavoriteHotels";
import StayHistory from "./pages/profilePages/StayHistory";


import HotelPersonalInfo from "./pages/hotelProfilePages/HotelPersonalInfo";  
import Hotels from "./pages/hotelProfilePages/Hotels";  
import Packages from "./pages/hotelProfilePages/Packages";  
import AddHotel from './pages/hotelProfilePages/AddHotel';
import AddPackage from './pages/hotelProfilePages/AddPackage';





const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div className="layout">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<SignUp />} path="/signup"/>
                        <Route element={<LoginAccount />} path="/login" />
                        <Route element={<ContactUs />} path="/contact" />

                      
                        <Route element={<UserProfile />} path="/profile">
                            <Route index element={<PersonalInfo />} />
                            <Route path="personal-info" element={<PersonalInfo />} />
                            <Route path="favorite-hotels" element={<FavoriteHotels />} />
                            <Route path="stay-history" element={<StayHistory />} />
                        </Route>

                       
                        <Route element={<HotelPersonalInfo />} path="/hotel-profile/personal-info" />
                        <Route element={<Hotels />} path="/hotel-profile/hotels" />
                        <Route element={<Packages />} path="/hotel-profile/packages" />
                        <Route element={<AddHotel />} path="/hotel-profile/add-hotel" />
                        <Route element={<AddPackage />} path="/hotelProfilePages/add-package" />


                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
