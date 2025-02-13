import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";

const PersonalInfo = () => {
  const { actions, store } = useContext(Context); // Access store and actions from flux
  const [isEditable, setIsEditable] = useState(false); // State to manage editability
  const [profileImage, setProfileImage] = useState(""); // Store profile image URL
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    username: "",
    email: "",
    country: "",
    language: "",
    profile_image: "",
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      const personalInfo = await actions.fetchPersonalInfo(); // Fetch personal info from backend
      if (personalInfo) {
        setFormData({
          name: personalInfo.name,
          last_name: personalInfo.last_name,
          username: personalInfo.username,
          email: personalInfo.email,
          country: personalInfo.country || "",
          language: personalInfo.language || "",
          profile_image: personalInfo.profile_image || "", // Load existing profile image
        });

        setProfileImage(personalInfo.profile_image || ""); // Update profile image state
      }
    };

    loadUserInfo();
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
      [name]: value,
    }));
  };

  // Function to upload profile image
  const uploadImage = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) {
        console.error("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      // Ensure the backend URL is correct
      const response = await fetch(`${process.env.BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error uploading image:", errorData.error);
        return;
      }

      const data = await response.json();
      console.log("Uploaded image:", data);

      // Update the profile image state
      setProfileImage(data.image_url);
      setFormData((prevState) => ({
        ...prevState,
        profile_image: data.image_url, // Update form data to save it later
      }));
    } catch (error) {
      console.error("Error in uploadImage:", error);
    }
  };

  // Handle Save Changes button click
  const handleSaveChanges = async () => {
    console.log("🚀 Saving with data:", {
        ...formData,
        profile_image: profileImage,  // ✅ Ensure image is included
    });

    const success = await actions.savePersonalInfo({
        ...formData,
        profile_image: profileImage,  // ✅ Ensure this is included
    });

    if (success) {
        setIsEditable(false); // Exit edit mode
    }
};



  

  return (
    <div className="content container mt-4">
      {/* Header */}
      <h2 className="text-center mb-4">Personal Info</h2>

      {/* Profile Picture */}
      <div className="d-flex justify-content-center mb-4">
        <label htmlFor="profile-upload" className="position-relative">
          <img
            src={profileImage || "https://via.placeholder.com/100"} // Default image if none
            alt="Profile"
            className="rounded-circle"
            style={{ width: "100px", height: "100px", objectFit: "cover", cursor: isEditable ? "pointer" : "default" }}
          />
          {isEditable && (
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={uploadImage}
              style={{ display: "none" }}
            />
          )}
        </label>
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
      </form>

      {/* Buttons */}
      <div className="d-flex justify-content-end mt-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <button className={`btn ${isEditable ? "btn-secondary" : "btn-warning"} me-2`} onClick={toggleEdit}>
          {isEditable ? "Cancel" : "Edit Info"}
        </button>
        <button className="btn btn-success" disabled={!isEditable} onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
