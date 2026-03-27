import { NavLink } from "react-router-dom";

function Navbar({ auth }) {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <div className="brand">
          <div className="brand__mark">LF</div>
          <div>
            <strong>Campus Lost & Found</strong>
            <p>One calm place to report, search, and return belongings.</p>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-links__item ${isActive ? "nav-links__item--active" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `nav-links__item ${isActive ? "nav-links__item--active" : ""}`
            }
          >
            Search
          </NavLink>

          {auth.isAuthenticated ? (
            <>
              <NavLink
                to="/add"
                className={({ isActive }) =>
                  `nav-links__item ${isActive ? "nav-links__item--active" : ""}`
                }
              >
                Add Item
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nav-links__item ${isActive ? "nav-links__item--active" : ""}`
                }
              >
                Profile
              </NavLink>
              <button className="button button--ghost" onClick={auth.logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `nav-links__item ${isActive ? "nav-links__item--active" : ""}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `nav-links__item ${isActive ? "nav-links__item--active" : ""}`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
