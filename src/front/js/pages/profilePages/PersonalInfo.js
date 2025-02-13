import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import "../../../styles/userProfile.css";

const PersonalInfo = () => {
  const { actions, store } = useContext(Context);
  const [isEditable, setIsEditable] = useState(false);
  const [profileImage, setProfileImage] = useState("");
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
      const personalInfo = await actions.fetchPersonalInfo();
      if (personalInfo) {
        setFormData({
          name: personalInfo.name,
          last_name: personalInfo.last_name,
          username: personalInfo.username,
          email: personalInfo.email,
          country: personalInfo.country || "",
          language: personalInfo.language || "",
          profile_image: personalInfo.profile_image || "",
        });

        setProfileImage(personalInfo.profile_image || "");
      }
    };

    loadUserInfo();
  }, []);

  const toggleEdit = () => {
    setIsEditable((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const uploadImage = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) {
        console.error("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

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
      setProfileImage(data.image_url);
      setFormData((prevState) => ({
        ...prevState,
        profile_image: data.image_url,
      }));
    } catch (error) {
      console.error("Error in uploadImage:", error);
    }
  };

  const handleSaveChanges = async () => {
    console.log("🚀 Saving with data:", {
      ...formData,
      profile_image: profileImage,
    });

    const success = await actions.savePersonalInfo({
      ...formData,
      profile_image: profileImage,
    });

    if (success) {
      setIsEditable(false);
    }
  };

  return (
    <div className="content container mt-4">
      <h2 className="text-center mb-4">Personal Info</h2>
      <div className="d-flex justify-content-center mb-4">
        <label htmlFor="profile-upload" className="position-relative">
          <img
            src={profileImage || "https://via.placeholder.com/100"}
            alt="Profile"
            className="rounded-circle profile-image"
          />
          {isEditable && (
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={uploadImage}
              className="d-none"
            />
          )}
        </label>
      </div>
      <form className="user-info-form">
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
      <div className="d-flex justify-content-end mt-4">
        <button className={`custom-btn-yellow me-2`} onClick={toggleEdit}>
          {isEditable ? "Cancel" : "Edit Info"}
        </button>
        <button className="custom-btn-green" disabled={!isEditable} onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
