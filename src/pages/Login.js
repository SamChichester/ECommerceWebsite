import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();

    const user = {
      username: username,
      password: password
    };

    try {
      const {data} = await axios.post(
        'http://localhost:8000/api/token/', 
        user, 
        { headers: {'Content-Type': 'application/json'} }
      );

      console.log(data)
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
      window.location.href = '/';
    } catch (error) {
      setError(error.response.data.detail);
    }
  }

  return(
    <div className="container mt-5">
      <form onSubmit={submit}>
          <div className="mb-3">
              <h3>Sign In</h3>
          </div>
          <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" placeholder="Enter Username" value={username} required onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" placeholder="Enter Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mb-3">
              {error && <p className="text-danger">{error}</p>}
              <button type="submit" className="btn btn-primary">Submit</button>
          </div>
      </form>
      <Link to='http://localhost:3000/register' className="btn btn-link">Sign Up</Link>
    </div>
  );
};

export default Login;