import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import HotelSidebar from './HotelSidebar';
import { Context } from '../../store/appContext';

const Packages = () => {
  const { actions } = useContext(Context);
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
    const success = await actions.updatePackage(editedPackage);
    if (success) {
      setPackages((prev) => prev.map((pkg) => (pkg.id === editedPackage.id ? editedPackage : pkg)));
      setEditingPackageId(null);
    } else {
      alert('Failed to update package. Please try again.');
    }
  };

  return (
    <div className="d-flex">
      <HotelSidebar />
      <div className="flex-grow-1">
        <Header title="Hotel Packages" />
        <div className="p-4">
          <div className="d-flex justify-content-between mb-3">
            <h4>Packages List</h4>
            <button
              className="btn btn-success"
              onClick={() => navigate('/hotel-profile/add-package')}
            >
              Add Package
            </button>
          </div>
          <div className="list-group">
            {packages.map((pkg, index) => (
              <div key={pkg.id_hotel_package || index} className="list-group-item">
                <h5>{pkg.package?.hotel_package_name || "No Name"}</h5>
                <p className="mb-1"><strong>Hotel:</strong> {pkg.package?.hotel.name || "Unknown"}</p>
                <p className="mb-1"><strong>Country:</strong> {pkg.package?.hotel.country || "Unknown"}</p>
                <p className="mb-1"><strong>Location:</strong> {pkg.package?.hotel.location || "Unknown"}</p>
                <p className="mb-1"><strong>Price:</strong> ${pkg.package?.price || "N/A"}</p>
                <p className="mb-1"><strong>Start Date:</strong> {pkg.package?.start_date || "N/A"}</p>
                <p className="mb-1"><strong>End Date:</strong> {pkg.package?.end_date || "N/A"}</p>
                <p className="mb-1"><strong>Description:</strong> {pkg.package?.description || "No Description"}</p>
                <button className="btn btn-primary mt-2">Edit</button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Packages;
