import React, { useState } from 'react';

export default function AdminDashboard({ children }) {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>Estamos en el AdminDashboard</div>
      <div>contador: {count}</div>
      <button onClick={() => setCount(count + 1)}>Sumar</button>
      <button onClick={() => setCount(count - 1)}>Restar</button>
      <hr />
      <div>{children}</div>
    </>
  );
}
