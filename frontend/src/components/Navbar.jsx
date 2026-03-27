import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <NavLink to="/" className="brand">
          <span className="brand__mark">C</span>
          <div>
            <strong>Campus Lost & Found</strong>
            <p>Track, post, and recover student belongings faster.</p>
          </div>
        </NavLink>

        <nav className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-links__item${isActive ? " nav-links__item--active" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              `nav-links__item${isActive ? " nav-links__item--active" : ""}`
            }
          >
            Add Item
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `nav-links__item${isActive ? " nav-links__item--active" : ""}`
            }
          >
            Search
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
