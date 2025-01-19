import React from 'react';
import AdminSidebar from './AdminSidebar'; // Corrected import for AdminSidebar

const AdminPersonalInfo = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Admin Personal Information</h1>
          </div>

          {/* Profile Section */}
          <div className="card mb-4">
            <div className="card-header">Personal Details</div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input type="text" id="firstName" className="form-control" placeholder="Admin's First Name" disabled />
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input type="text" id="lastName" className="form-control" placeholder="Admin's Last Name" disabled />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" id="email" className="form-control" placeholder="Admin's Email" disabled />
                </div>
                <div className="col-md-6">
                  <label htmlFor="role" className="form-label">Role</label>
                  <input type="text" id="role" className="form-control" value="Administrator" disabled />
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="card">
            <div className="card-header">Actions</div>
            <div className="card-body">
              <button className="btn btn-primary me-2">Edit Profile</button>
              <button className="btn btn-danger">Delete Account</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPersonalInfo;
