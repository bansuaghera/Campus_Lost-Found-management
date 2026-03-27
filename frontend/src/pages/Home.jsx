import { useEffect, useState } from "react";
import API from "../services/api";
import ItemCard from "../components/ItemCard";

function Home() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        setStatus("loading");
        const res = await API.get("/items");
        setItems(res.data);
        setStatus("success");
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Unable to load items right now. Start the backend server and try again.",
        );
        setStatus("error");
      }
    };

    loadItems();
  }, []);

  return (
    <section className="page-stack">
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">Campus recovery desk</p>
          <h1>Help lost items find their way back faster.</h1>
          <p className="hero__text">
            Publish found belongings, search recent reports, and keep handoff
            details organized in one lightweight student-friendly dashboard.
          </p>
        </div>

        <div className="hero__stats">
          <div className="stat-card">
            <span className="stat-card__value">{items.length}</span>
            <span className="stat-card__label">Items listed</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">24/7</span>
            <span className="stat-card__label">Search access</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">1 place</span>
            <span className="stat-card__label">For lost and found teams</span>
          </div>
        </div>
      </section>

      <section className="section-heading">
        <p className="eyebrow">Recent reports</p>
        <h2>Latest submitted items</h2>
      </section>

      {status === "loading" && (
        <div className="empty-state">
          <h3>Loading listings</h3>
          <p>Fetching the latest campus item reports for you.</p>
        </div>
      )}

      {status === "error" && (
        <div className="empty-state empty-state--error">
          <h3>Could not reach the server</h3>
          <p>{error}</p>
        </div>
      )}

      {status === "success" && items.length === 0 && (
        <div className="empty-state">
          <h3>No items reported yet</h3>
          <p>Add the first report to start the lost-and-found board.</p>
        </div>
      )}

      {status === "success" && items.length > 0 && (
        <div className="card-grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;
