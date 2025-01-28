import React, { useState, useEffect, useContext } from "react";
import Header from "./Header";
import HotelSidebar from "./HotelSidebar";
import { Context } from "../../store/appContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const HotelPersonalInfo = () => {
  const { actions } = useContext(Context);
  const [isEditable, setIsEditable] = useState(false); // Toggle edit mode
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    username: "",
    email: "",
  });
  const navigate = useNavigate()

  // Fetch hotel info on component mount
  useEffect(() => {
    const loadHotelInfo = async () => {
      const hotelInfo = await actions.fetchHotelPersonalInfo();
      if (hotelInfo) {
        setFormData({
          name: hotelInfo.name || "",
          last_name: hotelInfo.last_name || "",
          username: hotelInfo.username || "",
          email: hotelInfo.email || "",

        });
      }
      else {
        console.log("no usuario hotel")
        // navigate("/")
      }

    };

    loadHotelInfo();
  }, []);

  const toggleEdit = () => setIsEditable((prevState) => !prevState); // Toggle edit mode

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update local state
  };

  const handleSave = async () => {
    const success = await actions.updateHotelPersonalInfo(formData); // Save changes to backend
    if (success) {
      alert("Changes saved successfully!");
      setIsEditable(false); // Disable edit mode
    } else {
      alert("Failed to save changes. Please try again.");
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <HotelSidebar />

      <div className="flex-grow-1">
        <Header title="Personal Information" />

        <div className="content container mt-4">
          <h2 className="text-center mb-4">Hotel User Information</h2>

          {/* Profile Picture */}
          <div className="d-flex justify-content-center mb-4">
            <div
              className="rounded-circle bg-secondary"
              style={{ width: "150px", height: "150px" }}
            >
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="img-fluid rounded-circle"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Form */}
          <form className="w-100" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                // placeholder="john@example.com"
                // disabled={!isEditable}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Display Plan</label>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Active Plan"
                    disabled={!isEditable}
                  />
                  <a href="#" className="ms-2 text-decoration-none">
                    Change Plan
                  </a>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Language</label>
                <select
                  className="form-select"
                  disabled={!isEditable}
                >
                  <option selected>Spanish</option>
                  <option>English</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Country of Residence</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Spain"
                  disabled={!isEditable}
                />
              </div>
            </div>
          </form>

          {/* Buttons */}
          <div
            className="d-flex justify-content-end mt-4"
            style={{ maxWidth: "800px", margin: "0 auto" }}
          >
            <button
              className={`btn ${isEditable ? "btn-secondary" : "btn-warning"} me-2`}
              onClick={toggleEdit}
            >
              {isEditable ? "Cancel" : "Edit Information"}
            </button>
            <button
              className="btn btn-success"
              onClick={handleSave}
              disabled={!isEditable}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelPersonalInfo;
