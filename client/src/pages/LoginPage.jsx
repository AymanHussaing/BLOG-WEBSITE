import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from "@mui/material/Alert";
import { UserContext } from '../components/UserContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const {user, setUser} = useContext(UserContext)
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/login', credentials, { withCredentials: true });

      const {username}  = response.data;
      setUser(username)
      navigate('/'); // Redirect to home page upon successful login
    } catch (error) {
      console.error('Login failed', error);
      setSnackbar({ open: true, message: 'Login Fail', severity: 'error' });
    }

    setCredentials({ username: '', password: '' });
  };

  return (
    <>
      <div>
        <form className='login' onSubmit={handleLogin}>
          <h1>Login</h1>
          <input
            type='text'
            value={credentials.username}
            placeholder='username'
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <input
            type="password"
            value={credentials.password}
            placeholder='password'
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <button type="submit">Login</button>
        </form>
      </div>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginPage;
