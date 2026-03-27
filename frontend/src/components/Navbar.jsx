import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
      <Link to="/" style={{ margin: "10px", color: "#fff" }}>
        Home
      </Link>
      <Link to="/add" style={{ margin: "10px", color: "#fff" }}>
        Add Item
      </Link>
      <Link to="/search" style={{ margin: "10px", color: "#fff" }}>
        Search
      </Link>
    </nav>
  );
}

export default Navbar;
