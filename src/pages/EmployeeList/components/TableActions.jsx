import React from 'react';

const TableActions = ({ resetToMockData, loading }) => {
  return (
    <div className="action-buttons">
      <button 
        onClick={resetToMockData} 
        className="reset-data-btn"
        disabled={loading}
      >
        {loading ? 'Chargement...' : 'Réinitialiser avec données fictives'}
      </button>
    </div>
  );
};

export default TableActions; 