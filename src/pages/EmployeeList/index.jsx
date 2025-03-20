import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo-hrnet-removebg.png';
import { useEmployees } from '../../context/EmployeeContext';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table';
import './EmployeeList.css';

const EmployeeList = () => {
  const { employees, resetToMockData } = useEmployees();
  const [globalFilter, setGlobalFilter] = useState('');
  
  // Définition des colonnes du tableau
  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 150,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 150,
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        size: 150,
      },
      {
        accessorKey: 'department',
        header: 'Department',
        size: 150,
      },
      {
        accessorKey: 'dateOfBirth',
        header: 'Date of Birth',
        size: 150,
      },
      {
        accessorKey: 'street',
        header: 'Street',
        size: 200,
      },
      {
        accessorKey: 'city',
        header: 'City',
        size: 150,
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 100,
      },
      {
        accessorKey: 'zipCode',
        header: 'Zip Code',
        size: 120,
      },
    ],
    []
  );
  
  // Configuration de la table
  const table = useReactTable({
    data: employees,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    // Limiter à 2 cycles de tri (asc -> desc -> asc)
    enableSortingRemoval: false,
  });

  return (
    <div className="container employee-list-container">
        <div className="logo-title">
            <img src={logo} alt="logo" className='logo' />
            <h1 className="home-title">Current Employees</h1>
        </div>
      
      <div className="table-controls">
        <div className="entries-control">
          <label>
            Show 
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="entries-select"
            >
              {[10, 25, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            entries
          </label>
        </div>
        
        <div className="search-control">
          <label>
            Search: 
            <input
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              className="search-input"
            />
          </label>
        </div>
      </div>
      
      <div className="action-buttons">
        <button onClick={resetToMockData} className="reset-data-btn">
          Réinitialiser avec données fictives
        </button>
      </div>
      
      {employees.length === 0 ? (
        <p>No employees found. <Link to="/">Add some employees</Link></p>
      ) : (
        <>
          <div className="sort-info">
            <p>
              {table.getState().sorting.length > 0 ? (
                <>
                  Le tableau est actuellement trié par <strong>
                    {table.getState().sorting.map(sort => {
                      const column = columns.find(col => col.accessorKey === sort.id);
                      return column ? column.header : sort.id;
                    }).join(', ')}
                  </strong> en ordre {table.getState().sorting[0]?.desc ? 'décroissant ▼' : 'croissant ▲'}
                </>
              ) : 'Cliquez sur l\'en-tête d\'une colonne pour trier les données'}
            </p>
            <p className="sort-help">
              Cliquez sur l'en-tête d'une colonne pour trier l'ensemble du tableau selon cette colonne.
            </p>
          </div>
          
          <div className="table-container">
            <table id="employee-table">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th 
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={
                          header.column.getIsSorted()
                            ? header.column.getIsSorted() === 'asc'
                              ? 'active-sort asc'
                              : 'active-sort desc'
                            : ''
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="sort-icon">
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === 'asc' ? (
                              '▲'
                            ) : (
                              '▼'
                            )
                          ) : (
                            '▲▼'
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="pagination">
            <span>
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} entries
            </span>
            
            <div className="pagination-controls">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
              
              {Array.from({ length: table.getPageCount() }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => table.setPageIndex(index)}
                  className={
                    table.getState().pagination.pageIndex === index ? 'active' : ''
                  }
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
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