import React, { useState, useEffect, useContext } from "react";
import Header from "./Header";
import HotelSidebar from "./HotelSidebar";
import { Context } from "../../store/appContext";

const HotelPersonalInfo = () => {
  const { actions } = useContext(Context);
  const [isEditable, setIsEditable] = useState(false);
  const [showPlanSelection, setShowPlanSelection] = useState(false); // Toggle for showing plan selection
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    username: "",
    email: "",
    plan: "basic" // Default plan (this should be fetched from backend)
  });

  useEffect(() => {
    const loadHotelInfo = async () => {
      const hotelInfo = await actions.fetchHotelPersonalInfo();
      if (hotelInfo) {
        setFormData({
          name: hotelInfo.name || "",
          last_name: hotelInfo.last_name || "",
          username: hotelInfo.username || "",
          email: hotelInfo.email || "",
          plan: hotelInfo.plan || "basic" // Fetching the current plan
        });
      }
    };
    loadHotelInfo();
  }, []);

  const toggleEdit = () => setIsEditable((prevState) => !prevState);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const success = await actions.updateHotelPersonalInfo(formData);
    if (success) {
      alert("Changes saved successfully!");
      setIsEditable(false);
    } else {
      alert("Failed to save changes. Please try again.");
    }
  };

  const handlePlanSelection = async (plan) => {
    setSelectedPlan(plan);
  };

  const confirmPlanSelection = async (planId) => {
    if (!planId) {
        console.error("Plan ID is missing!");
        alert("Something went wrong. Please try again.");
        return;
    }

    console.log("✅ Selected plan ID:", planId);

    const result = await actions.selectPlan(planId);

    if (result) {
        alert(result); // Success message
        setFormData({ ...formData, plan: planId === 1 ? "priority" : "basic" }); // Update UI
        setShowPlanSelection(false); // Hide selection panel
    } else {
        alert("❌ Failed to update plan. Please try again.");
    }
};



  return (
    <div className="d-flex">
      <HotelSidebar />
      <div className="flex-grow-1">
        <Header title="Personal Information" />

        <div className="content container mt-4">
          <h2 className="text-center mb-4">Hotel User Information</h2>

          {/* Profile Form */}
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
                />
              </div>
            </div>

            {/* Display and Change Plan */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Current Plan</label>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control"
                    value={formData.plan}
                    disabled
                  />
                  <button
                    className="btn btn-outline-primary ms-2"
                    type="button"
                    onClick={() => setShowPlanSelection(!showPlanSelection)}
                  >
                    Change Plan
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Plan Selection Section (Shows when "Change Plan" is clicked) */}
          {showPlanSelection && (
            <div className="row mt-4">
              <h3 className="text-center mb-3">Select a New Plan</h3>
              <div className="col-md-6">
                <div
                  className={`card ${selectedPlan === "Priority" ? "border-primary" : ""}`}
                  onClick={() => handlePlanSelection("Priority")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Priority Plan</h5>
                    <p className="card-text">Get premium listing for your packages.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className={`card ${selectedPlan === "basic" ? "border-primary" : ""}`}
                  onClick={() => handlePlanSelection("basic")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Basic Plan</h5>
                    <p className="card-text">Standard visibility for your packages.</p>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <button onClick={() => {
                  console.log("Button clicked for Priority Plan, sending ID: 1");
                  confirmPlanSelection(1);
                }}>
                  Select Priority Plan
                </button>

                <button onClick={() => {
                  console.log("Button clicked for Basic Plan, sending ID: 2");
                  confirmPlanSelection(2);
                }}>
                  Select Basic Plan
                </button>

              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="d-flex justify-content-end mt-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <button className={`btn ${isEditable ? "btn-secondary" : "btn-warning"} me-2`} onClick={toggleEdit}>
              {isEditable ? "Cancel" : "Edit Information"}
            </button>
            <button className="btn btn-success" onClick={handleSave} disabled={!isEditable}>
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HotelPersonalInfo;
