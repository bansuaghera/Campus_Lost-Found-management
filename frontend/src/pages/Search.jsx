import { useState } from "react";
import API from "../services/api";
import ItemCard from "../components/ItemCard";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    API.get(`/search?query=${query}`)
      .then((res) => setResults(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>Search Items</h2>

      <input onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      {results.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
}

export default Search;
