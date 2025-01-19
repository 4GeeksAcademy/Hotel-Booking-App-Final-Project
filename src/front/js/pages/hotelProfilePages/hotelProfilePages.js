import React from "react";
import { Outlet } from "react-router-dom";
import HotelSidebar from "../../component/HotelSidebar";
import Header from "../../component/Header";

const HotelProfile = () => {
    return (
        <div className="d-flex">
            <HotelSidebar />
            <div className="flex-grow-1">
                <Header />
                <Outlet />
            </div>
        </div>
    );
};

export default HotelProfile;
