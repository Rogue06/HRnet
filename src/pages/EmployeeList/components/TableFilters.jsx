import React from 'react';

const TableFilters = ({ table, globalFilter, setGlobalFilter, loading }) => {
  return (
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
  );
};

export default TableFilters; 