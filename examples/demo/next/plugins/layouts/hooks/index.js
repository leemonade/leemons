import React from 'react';
import AdminDashboard from '../componentes/AdminDashboard';

function useLayout(layoutName) {
  let layout;

  switch (layoutName) {
    case 'admin':
      layout = AdminDashboard;
      break;
    default:
      layout = React.Fragment;
  }

  return layout;
}

export { useLayout };
