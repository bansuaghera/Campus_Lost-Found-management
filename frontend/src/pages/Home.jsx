import { useEffect, useState } from "react";
import API from "../services/api";
import ItemCard from "../components/ItemCard";

function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get("/items")
      .then((res) => setItems(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="page-stack">
      <section className="hero">
        <div>
          <p className="eyebrow">Campus recovery desk</p>
          <h1>Help lost belongings find their way back.</h1>
          <p className="hero__text">
            Browse recently reported items, share new finds, and make it easier
            for students to reconnect with what they misplaced.
          </p>
        </div>
        <div className="hero__stats">
          <div className="stat-card">
            <span className="stat-card__value">{items.length}</span>
            <span className="stat-card__label">Items listed</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">24/7</span>
            <span className="stat-card__label">Accessible records</span>
          </div>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Latest reports</p>
          <h2>Recently added found items</h2>
        </div>
      </section>

      {items.length > 0 ? (
        <div className="card-grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No items reported yet</h3>
          <p>
            Once someone adds a found item, it will appear here for the whole
            campus to browse.
          </p>
        </div>
      )}
    </section>
  );
}

export default Home;
