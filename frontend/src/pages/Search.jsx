import { useState } from "react";
import API from "../services/api";
import ItemCard from "../components/ItemCard";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    API.get("/search", {
      params: { query },
    })
      .then((res) => setResults(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <section className="page-stack">
      <section className="search-panel">
        <div>
          <p className="eyebrow">Search directory</p>
          <h1>Look up a lost item by name or keyword</h1>
          <p>
            Try product names, colors, bag types, or anything memorable from
            the item title.
          </p>
        </div>

        <div className="search-bar">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for wallet, bottle, keys..."
          />
          <button className="button button--primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </section>

      {results.length > 0 ? (
        <div className="card-grid">
          {results.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No matching items yet</h3>
          <p>
            Search results will appear here after you enter a title keyword and
            run a search.
          </p>
        </div>
      )}
    </section>
  );
}

export default Search;
