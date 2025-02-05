import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useUserContext } from "../hooks/ContextHooks";

const Layout = () => {
  const { user, handleAutoLogin } = useUserContext();
  useEffect(() => {
    if (!user) handleAutoLogin();
  }, []);
  return (
    <>
      <h1>My App</h1>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/Profile">Profile</Link>
                </li>
                <li>
                  <Link to="/Upload">Upload</Link>
                </li>
                <li>
                  <Link to="/Logout">Logout</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/Login">Login</Link>
                </li>
                <li>
                  <Link to="/Register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <main>
          <Outlet />
        </main>
        <footer>
          <p>&copy; 2025</p>
        </footer>
      </div>
    </>
  );
};

export default Layout;
