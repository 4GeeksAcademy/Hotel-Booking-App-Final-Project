import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { Navigate } from "react-router-dom";

const PersonalInfo = () => {
  const { actions, store } = useContext(Context); // Access store and actions from flux
  const [isEditable, setIsEditable] = useState(false); // State to manage editability
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    username: "",
    email: "",
    country: "",
    language: ""
  });
  const [shouldReload, setShouldReload] = useState(true); // State to control data reload

  // Fetch user data when the component loads or shouldReload is true
  useEffect(() => {
    const loadUserInfo = async () => {
      const personalInfo = await actions.fetchPersonalInfo(); // Fetch personal info from backend
      if (personalInfo) {
        setFormData({
          name: personalInfo.name,
          last_name: personalInfo.last_name,
          username: personalInfo.username,
          email: personalInfo.email,
          country: personalInfo.country || "", // Default value if not present
          language: personalInfo.language || "" // Default value if not present
        });
      }
    };

    // if (shouldReload) {
    loadUserInfo();
    //   setShouldReload(false); // Reset reload flag after loading data
    // }
  }, []);

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditable((prevState) => !prevState);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle Save Changes button click
  const handleSaveChanges = async () => {
    // Save the updated formData to the backend
    const success = await actions.savePersonalInfo(formData);
    if (success) {
      setIsEditable(false); // Exit edit mode
      setShouldReload(true); // Trigger reload of user data
    }
  };
  if (!store.currentUser) {
    return <Navigate to={"/login"} />
  }
  return (
    <div className="content container mt-4">
      {/* Header */}
      <h2 className="text-center mb-4">Personal Info</h2>

      {/* Profile Picture */}
      <div className="d-flex justify-content-center mb-4">
        <div
          className="rounded-circle bg-secondary"
          style={{ width: "100px", height: "100px" }}
        ></div>
      </div>

      {/* User Info Form */}
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
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          {/* <div className="col-md-6">
            <label className="form-label">Country of Residence</label>
            <input
              type="text"
              className="form-control"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Language</label>
            <input
              type="text"
              className="form-control"
              name="language"
              value={formData.language}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div> */}
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
          {isEditable ? "Cancel" : "Edit Info"}
        </button>
        <button
          className="btn btn-success"
          disabled={!isEditable}
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
