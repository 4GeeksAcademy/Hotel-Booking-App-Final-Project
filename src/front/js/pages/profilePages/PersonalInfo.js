import React, { useState } from 'react';

const PersonalInfo = () => {
  const [isEditable, setIsEditable] = useState(false); // State to manage editability

  const toggleEdit = () => {
    setIsEditable((prevState) => !prevState); // Toggle the edit mode
  };

  return (
    <div className="content container mt-4">
      {/* Header */}
      <h2 className="text-center mb-4">Personal Info</h2>

      {/* Profile Picture */}
      <div className="d-flex justify-content-center mb-4">
        <div
          className="rounded-circle bg-secondary"
          style={{ width: '100px', height: '100px' }}
        ></div>
      </div>

      {/* User Info Form */}
      <form className="w-100" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="John"
              disabled={!isEditable} // Field is editable only when isEditable is true
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Doe"
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
              placeholder="john_doe"
              disabled={!isEditable}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="john.doe@example.com"
              disabled={!isEditable}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Country of Residence</label>
            <input
              type="text"
              className="form-control"
              placeholder="United States"
              disabled={!isEditable}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Language</label>
            <input
              type="text"
              className="form-control"
              placeholder="English"
              disabled={!isEditable}
            />
          </div>
        </div>
      </form>

      {/* Buttons */}
      <div
        className="d-flex justify-content-end mt-4"
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        <button
          className={`btn ${isEditable ? 'btn-secondary' : 'btn-warning'} me-2`}
          onClick={toggleEdit}
        >
          {isEditable ? 'Cancel' : 'Edit Info'}
        </button>
        <button className="btn btn-success" disabled={!isEditable}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
