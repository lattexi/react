import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useUserContext } from '../hooks/ContextHooks';

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
          <ul className="m-0 flex list-none justify-end bg-stone-600 p-0">
            <li>
              <Link
                className="block p-4 text-center text-xl transition-all duration-500 hover:cursor-pointer hover:bg-stone-700"
                to="/"
              >
                Home
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    className="block p-4 text-center text-xl transition-all duration-500 hover:cursor-pointer hover:bg-stone-700"
                    to="/Profile"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="block p-4 text-center text-xl transition-all duration-500 hover:cursor-pointer hover:bg-stone-700"
                    to="/Upload"
                  >
                    Upload
                  </Link>
                </li>
                <li>
                  <Link
                    className="block p-4 text-center text-xl transition-all duration-500 hover:cursor-pointer hover:bg-stone-700"
                    to="/Logout"
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    className="block p-4 text-center text-xl transition-all duration-500 hover:cursor-pointer hover:bg-stone-700"
                    to="/Login"
                  >
                    Login
                  </Link>
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
