import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoPng from '../../assets/logo-hrnet-removebg.png';
import logoWebp from '../../assets/logo-hrnet-removebg.webp';
import { useEmployees } from '../../context/EmployeeContext';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import './EmployeeList.css';

// Composant pour afficher le contrôle de recherche
const SearchControl = ({ globalFilter, onGlobalFilterChange, disabled }) => (
  <div className="search-control">
    <label>
      Search: 
      <input
        value={globalFilter ?? ''}
        onChange={e => onGlobalFilterChange(e.target.value)}
        placeholder="Search all columns..."
        className="search-input"
        disabled={disabled}
      />
    </label>
  </div>
);

// Composant pour afficher les informations de tri
const SortInfo = ({ sorting, columns }) => (
  <div className="sort-info">
    <p>
      {sorting.length > 0 ? (
        <>
          Le tableau est actuellement trié par <strong>
            {sorting.map(sort => {
              const column = columns.find(col => col.accessorKey === sort.id);
              return column ? column.header : sort.id;
            }).join(', ')}
          </strong> en ordre {sorting[0]?.desc ? 'décroissant ▼' : 'croissant ▲'}
        </>
      ) : 'Cliquez sur l\'en-tête d\'une colonne pour trier les données'}
    </p>
    <p className="sort-help">
      Cliquez sur l'en-tête d'une colonne pour trier l'ensemble du tableau selon cette colonne.
    </p>
  </div>
);

// Composant pour les entrées par page
const EntriesControl = ({ pageSize, onPageSizeChange, disabled }) => (
  <div className="entries-control">
    <label>
      Show 
      <select
        value={pageSize}
        onChange={e => onPageSizeChange(Number(e.target.value))}
        className="entries-select"
        disabled={disabled}
      >
        {[10, 25].map(size => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      entries
    </label>
  </div>
);

// Fonction pour rendre les lignes skeleton durant le chargement (imite des lignes de tableau)
const renderSkeletonRows = (columnsCount) => {
  return Array.from({ length: 10 }).map((_, index) => (
    <tr key={`skeleton-${index}`} className="skeleton-row">
      {Array.from({ length: columnsCount }).map((_, colIndex) => (
        <td key={`skeleton-cell-${colIndex}`} className="skeleton-cell">
          <div className="skeleton-content"></div>
        </td>
      ))}
    </tr>
  ));
};

const EmployeeList = () => {
  const { employees, loading, resetToMockData } = useEmployees();
  const [globalFilter, setGlobalFilter] = useState('');
  
  // Référence pour la virtualisation
  const tableContainerRef = useRef(null);
  
  // État pour gérer l'affichage du skeleton loader
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // État pour suivre si on utilise la virtualisation
  const [useVirtualization, setUseVirtualization] = useState(false);
  
  // Effet pour masquer le skeleton loader après le chargement initial
  useEffect(() => {
    if (!loading && isInitialLoad) {
      // Délai court pour assurer une transition fluide
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, isInitialLoad]);
  
  // Définition des colonnes du tableau
  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 140,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 140,
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        size: 140,
      },
      {
        accessorKey: 'department',
        header: 'Department',
        size: 140,
      },
      {
        accessorKey: 'dateOfBirth',
        header: 'Date of Birth',
        size: 140,
      },
      {
        accessorKey: 'street',
        header: 'Street',
        size: 160,
      },
      {
        accessorKey: 'city',
        header: 'City',
        size: 130,
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 130,
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

  // On utilise un effet pour détecter les changements de pagination 
  useEffect(() => {
    // Nous n'utilisons plus la virtualisation puisque nous avons limité les options à 10 et 25
    setUseVirtualization(false);
  }, [table.getState().pagination.pageSize, table.getState().pagination.pageIndex]);

  // Configuration de la virtualisation
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50, // Hauteur estimée de chaque ligne en pixels
    overscan: 10, // Augmenté pour pré-rendre plus de lignes
  });

  return (
    <div className="container employee-list-container">
        <div className="logo-title">
            <picture>
                <source srcSet={logoWebp} type="image/webp" />
                <img src={logoPng} alt="logo" className='logo' width="150" height="75" />
            </picture>
            <h1 className="home-title">Current Employees</h1>
        </div>
      
      <div className="table-controls">
        <EntriesControl 
          pageSize={table.getState().pagination.pageSize}
          onPageSizeChange={table.setPageSize}
          disabled={loading}
        />
        
        <SearchControl 
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          disabled={loading}
        />
      </div>
      
      <div className="action-buttons">
        <button 
          onClick={resetToMockData} 
          className="reset-data-btn"
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Réinitialiser avec données fictives'}
        </button>
      </div>
      
      {employees.length === 0 && !loading ? (
        <p>No employees found. <Link to="/">Add some employees</Link></p>
      ) : (
        <>
          <SortInfo 
            sorting={table.getState().sorting}
            columns={columns}
          />
          
          <div 
            className={`table-container ${loading ? 'loading' : ''}`}
            ref={tableContainerRef}
            style={{ height: '600px' }}
          >
            <table id="employee-table">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th 
                        key={header.id}
                        onClick={!loading ? header.column.getToggleSortingHandler() : undefined}
                        className={
                          header.column.getIsSorted()
                            ? header.column.getIsSorted() === 'asc'
                              ? 'active-sort asc'
                              : 'active-sort desc'
                            : ''
                        }
                        style={{ width: header.column.columnDef.size }}
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
                            ''
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isInitialLoad ? (
                  renderSkeletonRows(columns.length)
                ) : useVirtualization ? (
                  // Mode virtualisé pour beaucoup de données
                  <>
                    <tr style={{ height: `${rowVirtualizer.getTotalSize()}px` }} className="virtual-spacer">
                      <td colSpan={columns.length}></td>
                    </tr>
                    {rowVirtualizer.getVirtualItems().map(virtualRow => {
                      const row = rows[virtualRow.index];
                      return (
                        <tr 
                          key={row.id}
                          style={{
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
                          }}
                          className="virtual-row"
                        >
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  // Mode pagination standard
                  table.getRowModel().rows.map(row => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="pagination-controls">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || loading}
              className="pagination-button first-page-btn"
            >
              {"<<"}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || loading}
              className="pagination-button prev-page-btn"
            >
              {"<"}
            </button>
            
            <span className="pagination-info">
              Page{' '}
              <strong>
                {table.getState().pagination.pageIndex + 1} de{' '}
                {table.getPageCount()}
              </strong>
            </span>
            
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || loading}
              className="pagination-button next-page-btn"
            >
              {">"}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || loading}
              className="pagination-button last-page-btn"
            >
              {">>"}
            </button>
          </div>
        </>
      )}
      
      <div className="nav-link-container">
        <Link to="/" className="nav-link">Retour à l'accueil</Link>
      </div>
    </div>
  );
};

export default EmployeeList; 