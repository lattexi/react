import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <h1>My App</h1>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Profile">Profile</Link>
            </li>
            <li>
              <Link to="/Upload">Upload</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
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
