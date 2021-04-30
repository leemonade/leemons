import React, { useState } from 'react';

export default function Login() {
  const [state, setState] = useState({ email: '', password: '' });

  const handleChange = (name, e) => {
    setState((s) => ({ ...s, [name]: e.target.value }));
  };

  const sendForm = (e) => {
    e.preventDefault();
    const { email, password } = state;

    fetch('http://localhost:8080/api/user-admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((r) => r.json())
      .then(console.log);
  };

  return (
    <div>
      <p>Login</p>
      <form onSubmit={sendForm}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" onChange={(e) => handleChange('email', e)} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" onChange={(e) => handleChange('password', e)} />

        <button>Send</button>
      </form>
    </div>
  );
}
