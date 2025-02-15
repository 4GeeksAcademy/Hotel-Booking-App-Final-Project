import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Header from './Header';
import HotelSidebar from './HotelSidebar';
import { Context } from '../../store/appContext';
import "./hotelProfile.css";
import { Navigate } from "react-router-dom";

const Packages = () => {
  const { actions, store } = useContext(Context);
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [editedPackage, setEditedPackage] = useState({});

  useEffect(() => {
    const loadPackages = async () => {
      console.log("📤 Fetching hotel packages...");
      const fetchedPackages = await actions.fetchHotelPackages();

      console.log("📥 Received hotel packages:", fetchedPackages);

      if (fetchedPackages) {
        setPackages(fetchedPackages);
      }
    };

    loadPackages();
  }, []);

  const handleEditClick = (pkg) => {
    setEditingPackageId(pkg.id);
    setEditedPackage({ ...pkg });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPackage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    Swal.fire({
      title: "Saving...",
      text: "Please wait while we update the package details.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const success = await actions.updatePackage(editedPackage);
    if (success) {
      setPackages((prev) => prev.map((pkg) => (pkg.id === editedPackage.id ? editedPackage : pkg)));
      setEditingPackageId(null);
      Swal.fire("Success!", "Package has been updated successfully!", "success");
    } else {
      Swal.fire("Error!", "Failed to update package. Please try again.", "error");
    }
  };

  if (!store.currentUser || store.currentUser.user_type != "hotel") {
    return <Navigate to={"/login"} />
  }

  return (
    <div className="FontDesign hotel-container">
      <HotelSidebar />
      <div className="hotel-content">
        <Header title="Hotel Packages" />
        <div className="content-wrapper">
          <div className="hotel-header">
            <h4 className='FontDesign'><strong>Packages List</strong></h4>
            <button
              className="custom-btn"
              onClick={() => navigate('/hotel-profile/add-package')}
            >
              Add Package
            </button>
          </div>
          <div className="hotel-list">
            {packages.map((pkg, index) => (
              <div key={pkg.id_hotel_package || index} className="hotel-item">
                <h5>{pkg.package?.hotel_package_name || "No Name"}</h5>
                <p className="hotel-info text-dark fs-6"><strong>Hotel:</strong> {pkg.package?.hotel.name || "Unknown"}</p>
                <p className="hotel-info text-dark"><strong>Country:</strong> {pkg.package?.hotel.country || "Unknown"}</p>
                <p className="hotel-info text-dark"><strong>Location:</strong> {pkg.package?.hotel.location || "Unknown"}</p>
                <p className="hotel-info text-dark"><strong>Price:</strong> ${pkg.package?.price || "N/A"}</p>
                <p className="hotel-info text-dark"><strong>Start Date:</strong> {pkg.package?.start_date || "N/A"}</p>
                <p className="hotel-info text-dark"><strong>End Date:</strong> {pkg.package?.end_date || "N/A"}</p>
                <p className="hotel-info text-dark"><strong>Description:</strong> {pkg.package?.description || "No Description"}</p>
                {/* <button className="custom-btn mt-2" onClick={() => handleEditClick(pkg)}>Edit</button> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;