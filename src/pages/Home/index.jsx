import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../components/Modal';
import { useEmployees } from '../../context/EmployeeContext';
import { states } from '../../utils/data';

const Home = () => {
  // État local pour le formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    startDate: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    department: 'Sales' // Valeur par défaut
  });

  // État pour la modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // On utilise notre hook personnalisé pour accéder au contexte
  const { addEmployee } = useEmployees();

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ajout de l'employé via notre contexte
    addEmployee(formData);
    
    // Ouverture de la modal de confirmation
    setIsModalOpen(true);
    
    // Réinitialisation du formulaire
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      startDate: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      department: 'Sales'
    });
  };

  return (
    <div className="container">
      <h1>HRnet</h1>
      <Link to="/employee-list">View Current Employees</Link>
      <h2>Create Employee</h2>
      
      <form id="create-employee" onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input 
          type="text" 
          id="firstName" 
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label htmlFor="lastName">Last Name</label>
        <input 
          type="text" 
          id="lastName" 
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label htmlFor="dateOfBirth">Date of Birth</label>
        <input 
          type="date" 
          id="dateOfBirth" 
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />

        <label htmlFor="startDate">Start Date</label>
        <input 
          type="date" 
          id="startDate" 
          value={formData.startDate}
          onChange={handleChange}
          required
        />

        <fieldset className="address">
          <legend>Address</legend>

          <label htmlFor="street">Street</label>
          <input 
            type="text" 
            id="street" 
            value={formData.street}
            onChange={handleChange}
            required
          />

          <label htmlFor="city">City</label>
          <input 
            type="text" 
            id="city" 
            value={formData.city}
            onChange={handleChange}
            required
          />

          <label htmlFor="state">State</label>
          <select 
            id="state" 
            value={formData.state}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.abbreviation} value={state.abbreviation}>
                {state.name}
              </option>
            ))}
          </select>

          <label htmlFor="zipCode">Zip Code</label>
          <input 
            type="number" 
            id="zipCode" 
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
        </fieldset>

        <label htmlFor="department">Department</label>
        <select 
          id="department" 
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="Engineering">Engineering</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Legal">Legal</option>
        </select>

        <button type="submit">Save</button>
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        Employee Created!
      </Modal>
    </div>
  );
};

export default Home; 