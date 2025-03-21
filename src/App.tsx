import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './views/Home';
import Profile from './views/Profile';
import Upload from './views/Upload';
import Layout from './components/Layout';
import Single from './views/Single';
import Login from './views/Login';
import Logout from './views/Logout';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>
          <UserProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />}></Route>
                <Route
                  path="/Profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Upload"
                  element={
                    <ProtectedRoute>
                      <Upload />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route path="/Single" element={<Single />}></Route>
                <Route path="/Login" element={<Login />}></Route>
                <Route path="/Logout" element={<Logout />}></Route>
              </Route>
            </Routes>
          </UserProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
