import React from 'react';
import AdminSidebar from './AdminSidebar'; // Import the AdminSidebar

const AdminExistingHotels = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Existing Hotels</h1>
          </div>

          {/* Hotels Table Section */}
          <div className="card mb-4">
            <div className="card-header">List of Hotels</div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Hotel Name</th>
                    <th scope="col">Location</th>
                    <th scope="col">Country</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Hotel A</td>
                    <td>Location A</td>
                    <td>Country A</td>
                    <td>
                      <button className="btn btn-warning">Edit</button>
                      <button className="btn btn-danger ms-2">Delete</button>
                    </td>
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminExistingHotels;
