import axios from 'axios';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = (event, reason) => {
    console.log("reason")
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  function register(event) {
    event.preventDefault();

    // Make a POST request to the server
    axios.post('http://localhost:4000/register', {
      username: username,
      password: password
    })
    .then(response => {
      // Handle success
      console.log('Registration successful', response.data);
      setSnackbarMessage('Registration successful');
      setSnackbarOpen(true);
    })
    .catch(error => {
      // Handle error
      console.error('Registration failed', error);
      setSnackbarMessage('Registration failed');
      setSnackbarOpen(true);
    });

    setUsername('');
    setPassword('');
  }

  return (
    <div>
      <form className='register' onSubmit={register}>
        <h1>Register</h1>
        <input
          type='text'
          placeholder='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default RegisterPage;
