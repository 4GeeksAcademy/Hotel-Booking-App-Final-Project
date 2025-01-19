import React from 'react';
import AdminSidebar from './AdminSidebar'; // Import the AdminSidebar

const AdminExistingUsers = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Existing Users</h1>
          </div>

          {/* Users Table Section */}
          <div className="card mb-4">
            <div className="card-header">List of Users</div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">User Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>User A</td>
                    <td>userA@example.com</td>
                    <td>Admin</td>
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

export default AdminExistingUsers;
