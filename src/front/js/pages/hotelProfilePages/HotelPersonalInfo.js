import React, { useState, useEffect, useContext } from "react";
import Header from "./Header";
import HotelSidebar from "./HotelSidebar";
import { Context } from "../../store/appContext";
import "./hotelProfile.css";

const HotelPersonalInfo = () => {
  const { actions } = useContext(Context);
  const [isEditable, setIsEditable] = useState(false);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    username: "",
    email: "",
    plan: "basic"
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
          plan: hotelInfo.plan || "basic"
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
      alert(result);
      setFormData({ ...formData, plan: planId === 1 ? "priority" : "basic" });
      setShowPlanSelection(false);
    } else {
      alert("❌ Failed to update plan. Please try again.");
    }
  };

  return (
    <div className="hotel-container FontDesign">
      <HotelSidebar />
      <div className="hotel-content">
        <Header title="Personal Information" />
        <div className="content-wrapper">
          <div className="d-flex justify-content-center col-xs-12 col-md-auto">
            <span className="colorTitleHotel">Hotel&nbsp;</span>
            <span id="TitleHotelInfo">User Information</span>
          </div>
          <form className="hotel-form">
            <div className="form-group FontDesign">
              <label className="FontDesign">First Name</label>
              <input type="text" className="rounded-pill border-2 border-dark" name="name" value={formData.name} onChange={handleChange} disabled={!isEditable} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" className="rounded-pill border-2 border-dark" name="last_name" value={formData.last_name} onChange={handleChange} disabled={!isEditable} />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input type="text" className="rounded-pill border-2 border-dark" name="username" value={formData.username} onChange={handleChange} disabled={!isEditable} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="rounded-pill border-2 border-dark" name="email" value={formData.email} disabled />
            </div>
            <div className="form-group">
              <label>Current Plan</label>
              <div className="plan-selection">
                <input type="text" className="rounded-pill border-2 border-dark" value={formData.plan} disabled />
                <button type="button" className="custom-btn" onClick={() => setShowPlanSelection(!showPlanSelection)}>
                  Change Plan
                </button>
              </div>
            </div>
          </form>

          {showPlanSelection && (
            <div className="plan-container">
              <h3>Select a New Plan</h3>
              <div className="plan-card" onClick={() => handlePlanSelection("Priority")}>
                <h5>Priority Plan</h5>
                <p>✅ Get your plans featured at the top of the main screen for more visibility.</p>
              </div>
              <div className="plan-card" onClick={() => handlePlanSelection("basic")}>
                <h5>Basic Plan</h5>
                <p>✅ Standard visibility for your packages.</p>
              </div>
              <button onClick={() => confirmPlanSelection(1)}>Select Priority Plan</button>
              <button onClick={() => confirmPlanSelection(2)}>Select Basic Plan</button>
            </div>
          )}

          <div className="form-buttons">
            <button className="custom-btn-yellow" onClick={toggleEdit}>{isEditable ? "Cancel" : "Edit Information"}</button>
            <button className="custom-btn-grey" onClick={handleSave} disabled={!isEditable}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelPersonalInfo;