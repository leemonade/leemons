import React from 'react';

export default function AdminDashboard({ children }) {
  return (
    <>
      <div>Estamos en el AdminDashboard</div>
      <div>{children}</div>
    </>
  );
}
