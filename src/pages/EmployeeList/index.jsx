import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';
import './EmployeeList.css';

const EmployeeList = () => {
  const { employees } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // Ajout des états pour la gestion du tri
  const [sortColumn, setSortColumn] = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filtrer les employés en fonction du terme de recherche
  const filteredEmployees = employees.filter((employee) => {
    return Object.values(employee).some(
      (value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Fonction pour trier les employés
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    // Si la valeur est undefined ou vide, la placer à la fin
    if (!a[sortColumn] && !b[sortColumn]) return 0;
    if (!a[sortColumn]) return 1;
    if (!b[sortColumn]) return -1;
    
    // Tri en fonction du type de données
    let comparison = 0;
    
    // Tri pour les dates
    if (sortColumn === 'startDate' || sortColumn === 'dateOfBirth') {
      const dateA = new Date(a[sortColumn]);
      const dateB = new Date(b[sortColumn]);
      comparison = dateA - dateB;
    } 
    // Tri numérique pour le code postal
    else if (sortColumn === 'zipCode') {
      comparison = parseInt(a[sortColumn], 10) - parseInt(b[sortColumn], 10);
    } 
    // Tri alphabétique pour les autres colonnes
    else {
      comparison = a[sortColumn].toString().localeCompare(b[sortColumn].toString());
    }
    
    // Inverser si le tri est descendant
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Fonction pour gérer le clic sur une colonne
  const handleSort = (column) => {
    // Si on clique sur la même colonne, inverser la direction
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Sinon définir la nouvelle colonne et réinitialiser à ascendant
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(sortedEmployees.length / entriesPerPage);

  // Obtenir les employés pour la page actuelle
  const indexOfLastEmployee = currentPage * entriesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - entriesPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fonction pour afficher l'icône de tri
  const renderSortIcon = (column) => {
    if (sortColumn !== column) {
      return <span className="sort-icon">▲▼</span>;
    }
    return sortDirection === 'asc' 
      ? <span className="sort-icon active">▲</span> 
      : <span className="sort-icon active">▼</span>;
  };

  return (
    <div className="container employee-list-container">
      <h1 className="home-title">Current Employees</h1>
      
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
          <div className="sort-info">
            <p>Le tableau est actuellement trié par <strong>{
              sortColumn === 'firstName' ? 'Prénom' :
              sortColumn === 'lastName' ? 'Nom' :
              sortColumn === 'startDate' ? 'Date de début' :
              sortColumn === 'department' ? 'Département' :
              sortColumn === 'dateOfBirth' ? 'Date de naissance' :
              sortColumn === 'street' ? 'Rue' :
              sortColumn === 'city' ? 'Ville' :
              sortColumn === 'state' ? 'État' :
              'Code postal'
            }</strong> en ordre {sortDirection === 'asc' ? 'croissant ▲' : 'décroissant ▼'}</p>
            <p className="sort-help">Cliquez sur l'en-tête d'une colonne pour trier l'ensemble du tableau selon cette colonne.</p>
          </div>
          
          <div className="table-container">
            <table id="employee-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('firstName')} className={sortColumn === 'firstName' ? 'active-sort' : ''}>
                    First Name {renderSortIcon('firstName')}
                  </th>
                  <th onClick={() => handleSort('lastName')} className={sortColumn === 'lastName' ? 'active-sort' : ''}>
                    Last Name {renderSortIcon('lastName')}
                  </th>
                  <th onClick={() => handleSort('startDate')} className={sortColumn === 'startDate' ? 'active-sort' : ''}>
                    Start Date {renderSortIcon('startDate')}
                  </th>
                  <th onClick={() => handleSort('department')} className={sortColumn === 'department' ? 'active-sort' : ''}>
                    Department {renderSortIcon('department')}
                  </th>
                  <th onClick={() => handleSort('dateOfBirth')} className={sortColumn === 'dateOfBirth' ? 'active-sort' : ''}>
                    Date of Birth {renderSortIcon('dateOfBirth')}
                  </th>
                  <th onClick={() => handleSort('street')} className={sortColumn === 'street' ? 'active-sort' : ''}>
                    Street {renderSortIcon('street')}
                  </th>
                  <th onClick={() => handleSort('city')} className={sortColumn === 'city' ? 'active-sort' : ''}>
                    City {renderSortIcon('city')}
                  </th>
                  <th onClick={() => handleSort('state')} className={sortColumn === 'state' ? 'active-sort' : ''}>
                    State {renderSortIcon('state')}
                  </th>
                  <th onClick={() => handleSort('zipCode')} className={sortColumn === 'zipCode' ? 'active-sort' : ''}>
                    Zip Code {renderSortIcon('zipCode')}
                  </th>
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
                Math.min(indexOfLastEmployee, sortedEmployees.length)
              } of {sortedEmployees.length} entries
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