import React, { useState } from 'react';
import Header from './Header';
import HotelSidebar from './HotelSidebar';

const HotelPersonalInfo = () => {
  const [isEditable, setIsEditable] = useState(false); // State to toggle edit mode

  const toggleEdit = () => {
    setIsEditable((prevState) => !prevState); // Toggle edit mode
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <HotelSidebar />
      
      <div className="flex-grow-1">
        <Header title="Datos Personales" />

        <div className="content container mt-4">
          <h2 className="text-center mb-4">Información del Usuario</h2>

          {/* Profile Picture */}
          <div className="d-flex justify-content-center mb-4">
            <div
              className="rounded-circle bg-secondary"
              style={{ width: '150px', height: '150px' }}
            >
              {/* Placeholder for Profile Picture */}
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="img-fluid rounded-circle"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* User Info Form */}
          <form className="w-100" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="John"
                  disabled={!isEditable}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Apellido</label>
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
                <label className="form-label">Usuario</label>
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
                  placeholder="john@example.com"
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Plan de visualización</label>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Plan Activo"
                    disabled={!isEditable}
                  />
                  <a href="#" className="ms-2 text-decoration-none">
                    Cambiar plan
                  </a>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Idioma</label>
                <select
                  className="form-select"
                  disabled={!isEditable}
                >
                  <option selected>Español</option>
                  <option>English</option>
                  <option>Français</option>
                  <option>Deutsch</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">País de residencia</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="España"
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
              {isEditable ? 'Cancelar' : 'Editar Información'}
            </button>
            <button
              className="btn btn-success"
              disabled={!isEditable}
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelPersonalInfo;
