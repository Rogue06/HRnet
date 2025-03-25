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

  // Rendu des lignes skeleton pour le chargement initial
  const renderSkeletonRows = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      <tr key={`skeleton-${index}`} className="skeleton-row">
        {Array.from({ length: columns.length }).map((_, colIndex) => (
          <td key={`skeleton-cell-${colIndex}`} className="skeleton-cell">
            <div className="skeleton-content"></div>
          </td>
        ))}
      </tr>
    ));
  };

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
        <div className="entries-control">
          <label>
            Show 
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="entries-select"
              disabled={loading}
            >
              {[10, 25].map(pageSize => (
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
              disabled={loading}
            />
          </label>
        </div>
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
                            '▲▼'
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {loading || isInitialLoad ? (
                  renderSkeletonRows()
                ) : useVirtualization ? (
                  // Affichage virtualisé pour les grands ensembles de données
                  <>
                    {/* Espace pour maintenir la taille du tableau pendant le défilement */}
                    <tr className="virtualized-spacer">
                      <td colSpan={columns.length} style={{ height: `${rowVirtualizer.getTotalSize()}px`, padding: 0, border: 'none' }} />
                    </tr>
                    
                    {/* Lignes virtualisées */}
                    {rowVirtualizer.getVirtualItems().map(virtualRow => {
                      const row = rows[virtualRow.index];
                      return (
                        <tr 
                          key={row.id}
                          className="virtualized-row"
                          style={{
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
                            position: 'absolute',
                            width: '100%',
                          }}
                        >
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id} style={{ width: cell.column.columnDef.size }}>
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
                  // Affichage standard pour les petits ensembles de données
                  rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} style={{ width: cell.column.columnDef.size }}>
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
            
            {/* Indicateur de chargement */}
            {loading && !isInitialLoad && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
              </div>
            )}
          </div>
          
          <div className="pagination">
            <span>
              {loading ? 'Chargement...' : `Showing ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )} of ${table.getFilteredRowModel().rows.length} entries`}
            </span>
            
            <div className="pagination-controls">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage() || loading}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, table.getPageCount()) }).map((_, index) => {
                // Afficher un sous-ensemble de boutons de pagination si trop nombreux
                const pageIndex = table.getState().pagination.pageIndex;
                const maxPage = table.getPageCount() - 1;
                let pageToShow;
                
                if (maxPage <= 4) {
                  // Si moins de 5 pages, afficher toutes les pages normalement
                  pageToShow = index;
                } else if (pageIndex <= 2) {
                  // Pour les premières pages, afficher les 5 premières
                  pageToShow = index;
                } else if (pageIndex >= maxPage - 2) {
                  // Pour les dernières pages, afficher les 5 dernières
                  pageToShow = maxPage - 4 + index;
                } else {
                  // Sinon, afficher 2 pages avant et 2 pages après la page actuelle
                  pageToShow = pageIndex - 2 + index;
                }
                
                return (
                  <button
                    key={pageToShow}
                    onClick={() => table.setPageIndex(pageToShow)}
                    className={
                      table.getState().pagination.pageIndex === pageToShow ? 'active' : ''
                    }
                    disabled={loading}
                  >
                    {pageToShow + 1}
                  </button>
                );
              })}
              
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage() || loading}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      
      <div className="action-buttons">
        <Link to="/" className="home-link">Home</Link>
      </div>
    </div>
  );
};

export default EmployeeList; 