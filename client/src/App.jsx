import './App.css'
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom'
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './components/UserContext';
import CreatePost from './pages/CreatePost';
import BlogPage from './pages/BlogPage';

function App() {

  return (
    <>
     <UserContextProvider>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element = {<IndexPage />} />
            <Route path={'/login'} element={<LoginPage />} />
            <Route path={'/register'} element={<RegisterPage />} />
            <Route path={'/create'} element={<CreatePost />} />
            <Route path={'/blog/:id'} element={<BlogPage />} />
            <Route path={'/edit/:id'} element={<EditPage />} />
          </Route>
        </Routes>
      </UserContextProvider>
     </>
  )

}

export default App;
