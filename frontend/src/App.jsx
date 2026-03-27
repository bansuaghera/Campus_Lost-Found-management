import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddItem from "./pages/AddItems";
import Search from "./pages/Search";
import ItemDetails from "./pages/ItemDetails";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Navbar />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddItem />} />
            <Route path="/search" element={<Search />} />
            <Route path="/item/:id" element={<ItemDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
