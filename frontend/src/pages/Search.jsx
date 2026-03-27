import { useState } from "react";
import API from "../services/api";
import ItemCard from "../components/ItemCard";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchState, setSearchState] = useState("idle");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      setSearchState("idle");
      setResults([]);
      setError("Enter a keyword like bottle, ID card, headphones, or bag.");
      return;
    }

    try {
      setSearchState("loading");
      setError("");
      const res = await API.get("/search", {
        params: { query: query.trim() },
      });
      setResults(res.data);
      setSearchState("success");
    } catch (err) {
      setResults([]);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Search is unavailable right now. Please confirm the backend is running.",
      );
      setSearchState("error");
    }
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
            {searchState === "loading" ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <p className="inline-message inline-message--error">{error}</p>}
      </section>

      {searchState === "success" && results.length > 0 ? (
        <div className="card-grid">
          {results.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className={`empty-state ${searchState === "error" ? "empty-state--error" : ""}`}>
          <h3>
            {searchState === "loading"
              ? "Looking through item reports"
              : "No matching items yet"}
          </h3>
          <p>
            {searchState === "loading"
              ? "We are checking the campus board for close matches."
              : "Search results will appear here after you enter a title keyword and run a search."}
          </p>
        </div>
      )}
    </section>
  );
}

export default Search;
