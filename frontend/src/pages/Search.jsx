import { useEffect, useState } from "react";
import API from "../services/api";
import ItemCard from "../components/ItemCard";
import { ITEM_CATEGORIES, ITEM_STATUSES, REPORT_TYPES } from "../constants";

function Search() {
  const [filters, setFilters] = useState({
    query: "",
    status: "",
    reportType: "",
    category: "",
    location: "",
  });
  const [results, setResults] = useState([]);
  const [searchState, setSearchState] = useState("loading");
  const [error, setError] = useState("");

  const runSearch = async (params) => {
    try {
      setSearchState("loading");
      setError("");
      const res = await API.get("/items", {
        params,
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

  useEffect(() => {
    const loadInitialResults = async () => {
      await runSearch({});
    };

    loadInitialResults();
  }, []);

  const handleSearch = async () => {
    const params = Object.fromEntries(
      Object.entries(filters)
        .map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
        .filter(([, value]) => value),
    );

    await runSearch(params);
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
            value={filters.query}
            onChange={(e) => setFilters((current) => ({ ...current, query: e.target.value }))}
            placeholder="Search for wallet, bottle, keys..."
          />
          <button className="button button--primary" onClick={handleSearch}>
            {searchState === "loading" ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="filter-grid">
          <label className="field">
            <span>Status</span>
            <select
              value={filters.status}
              onChange={(e) => setFilters((current) => ({ ...current, status: e.target.value }))}
            >
              <option value="">All statuses</option>
              {ITEM_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Report type</span>
            <select
              value={filters.reportType}
              onChange={(e) =>
                setFilters((current) => ({ ...current, reportType: e.target.value }))
              }
            >
              <option value="">All report types</option>
              {REPORT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Category</span>
            <select
              value={filters.category}
              onChange={(e) => setFilters((current) => ({ ...current, category: e.target.value }))}
            >
              <option value="">All categories</option>
              {ITEM_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Location</span>
            <input
              value={filters.location}
              onChange={(e) => setFilters((current) => ({ ...current, location: e.target.value }))}
              placeholder="Library, admin block, lab..."
            />
          </label>
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
              : "Use the filters above to narrow results by status, category, location, or report type."}
          </p>
        </div>
      )}
    </section>
  );
}

export default Search;
