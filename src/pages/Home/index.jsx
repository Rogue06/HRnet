import React, { useState } from 'react';
import logo from '../../assets/logo-hrnet-removebg.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import Modal from '../../components/Modal';
import { useEmployees } from '../../context/EmployeeContext';
import { states } from '../../data/states';
import './Home.css';

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

  // Préparation des options pour React Select
  const stateOptions = states.map(state => ({
    value: state.abbreviation,
    label: state.name
  }));
  
  const departmentOptions = [
    { value: 'Sales', label: 'Sales' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Legal', label: 'Legal' }
  ];

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
    <div className="container home-container">
        <div className="logo-title">
            <img src={logo} alt="logo" className="logo" />
            <h1 className="home-title">HRnet</h1>
        </div>
      <div className="nav-link-container">
      <Link to="/employee-list" className="nav-link">View Current Employees</Link>
      <h2 className="home-title">Create Employee</h2>
      </div>
      
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
        <DatePicker
          id="dateOfBirth"
          selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
          onChange={(date) => {
            setFormData({
              ...formData,
              dateOfBirth: date ? date.toISOString().split('T')[0] : ''
            });
          }}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="form-control"
        />

        <label htmlFor="startDate">Start Date</label>
        <DatePicker
          id="startDate"
          selected={formData.startDate ? new Date(formData.startDate) : null}
          onChange={(date) => {
            setFormData({
              ...formData,
              startDate: date ? date.toISOString().split('T')[0] : ''
            });
          }}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="form-control"
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
          <Select
            inputId="state"
            options={stateOptions}
            value={stateOptions.find(option => option.value === formData.state) || null}
            onChange={(selectedOption) => {
              setFormData({
                ...formData,
                state: selectedOption ? selectedOption.value : ''
              });
            }}
            placeholder="Select State"
            className="react-select-container"
            classNamePrefix="react-select"
          />

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
        <Select
          inputId="department"
          options={departmentOptions}
          value={departmentOptions.find(option => option.value === formData.department) || null}
          onChange={(selectedOption) => {
            setFormData({
              ...formData,
              department: selectedOption ? selectedOption.value : 'Sales'
            });
          }}
          placeholder="Select Department"
          className="react-select-container"
          classNamePrefix="react-select"
        />

        <button type="submit">Save</button>
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        Employee Created!
      </Modal>
    </div>
  );
};

export default Home; 