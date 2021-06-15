import React, { useState } from 'react';

export default function Register() {
  const [state, setState] = useState({ name: '', email: '', password: '' });

  const handleChange = (name, e) => {
    setState((s) => ({ ...s, [name]: e.target.value }));
  };

  const sendForm = (e) => {
    e.preventDefault();
    const { name, email, password } = state;

    fetch('http://localhost:8080/api/user-admin/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((r) => r.json())
      .then(console.log);
  };

  return (
    <div>
      <p>Register</p>
      <form onSubmit={sendForm}>
        <label htmlFor="name">Name</label>
        <input type="name" id="name" onChange={(e) => handleChange('name', e)} />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" onChange={(e) => handleChange('email', e)} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" onChange={(e) => handleChange('password', e)} />

        <button>Send</button>
      </form>
    </div>
  );
}
