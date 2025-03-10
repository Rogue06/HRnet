import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';
import './EmployeeList.css';

const EmployeeList = () => {
  const { employees } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrer les employés en fonction du terme de recherche
  const filteredEmployees = employees.filter((employee) => {
    return Object.values(employee).some(
      (value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);

  // Obtenir les employés pour la page actuelle
  const indexOfLastEmployee = currentPage * entriesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - entriesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h1>Current Employees</h1>
      
      <div className="table-controls">
        <div className="entries-control">
          <label>
            Show 
            <select 
              value={entriesPerPage} 
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1); // Réinitialiser à la première page
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            entries
          </label>
        </div>
        
        <div className="search-control">
          <label>
            Search: 
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Réinitialiser à la première page
              }} 
            />
          </label>
        </div>
      </div>
      
      {employees.length === 0 ? (
        <p>No employees found. <Link to="/">Add some employees</Link></p>
      ) : (
        <>
          <div className="table-container">
            <table id="employee-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Start Date</th>
                  <th>Department</th>
                  <th>Date of Birth</th>
                  <th>Street</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Zip Code</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((employee, index) => (
                  <tr key={index}>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.startDate}</td>
                    <td>{employee.department}</td>
                    <td>{employee.dateOfBirth}</td>
                    <td>{employee.street}</td>
                    <td>{employee.city}</td>
                    <td>{employee.state}</td>
                    <td>{employee.zipCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="pagination">
            <span>
              Showing {indexOfFirstEmployee + 1} to {
                Math.min(indexOfLastEmployee, filteredEmployees.length)
              } of {filteredEmployees.length} entries
            </span>
            
            <div className="pagination-controls">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {/* Afficher les numéros de page */}
              {[...Array(totalPages).keys()].map(number => (
                <button 
                  key={number + 1} 
                  onClick={() => paginate(number + 1)}
                  className={currentPage === number + 1 ? 'active' : ''}
                >
                  {number + 1}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      
      <Link to="/" className="home-link">Home</Link>
    </div>
  );
};

export default EmployeeList; 