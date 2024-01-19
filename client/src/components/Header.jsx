import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from './UserContext';

const Header = () => {
  const {user, setUser} = useContext(UserContext)

  function logout() {
    axios.post('http://localhost:4000/logout', {}, {withCredentials : true})
      .then(res => {
           console.log(res.data)
           setUser(null)
      })
      .catch(err => {
        console.log("an error occured while logging out", err)
      })
  }

  useEffect(() => {
    axios.get('http://localhost:4000/profile', { withCredentials: true })
      .then((response) => {
        const { username } = response.data
        setUser(username);
      })
      .catch((err) => {
        console.log("An Error occurred", err);
      });
  }, []);

  

  return (
    <header>
      <Link to='/' className='logo'>A5 BLOG</Link>
      <nav>
        {user ? (
          <>
            <Link to='/create'>{user}</Link>
            <a onClick={logout}>Logout</a>
          </>
        ) : (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

