import React from 'react';

const Pagination = ({ table, loading }) => {
  return (
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
  );
};

export default Pagination; 