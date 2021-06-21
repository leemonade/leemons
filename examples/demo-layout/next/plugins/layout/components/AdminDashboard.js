import React from 'react';
import PropTypes from 'prop-types';

function AdminDashboard({ persistentState: [state, setState], children }) {
  return (
    <>
      <div>Estamos en el AdminDashboard</div>
      <div>contador: {state.count || 0}</div>
      <div className="py-2">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setState({ count: (state.count || 0) + 1 })}
        >
          Sumar
        </button>
        <button
          type="button"
          className="inline-flex items-center ml-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setState({ count: (state.count || 0) - 1 })}
        >
          Restar
        </button>
      </div>
      <hr />
      <div>{children}</div>
    </>
  );
}

AdminDashboard.propTypes = {
  children: PropTypes.any,
  persistentState: PropTypes.any,
};

export default AdminDashboard;
