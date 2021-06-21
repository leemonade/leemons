import React from 'react';
import AdminDashboard from '../componentes/AdminDashboard';

const LAYOUTS = [
  { name: 'admin', component: AdminDashboard },
  { name: 'none', component: React.Fragment },
];

function registerLayout(layoutName, layout) {}

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
