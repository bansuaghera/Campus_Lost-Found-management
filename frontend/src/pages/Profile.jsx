import { useEffect, useState } from "react";
import API from "../services/api";
import ItemCard from "../components/ItemCard";

function Profile({ user }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const loadItems = async () => {
      try {
        setStatus("loading");
        const res = await API.get("/items");
        const filteredItems = res.data.filter((item) =>
          user?.email ? item.contact === user.email : false,
        );
        setItems(filteredItems);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    loadItems();
  }, [user?.email]);

  return (
    <section className="page-stack">
      <section className="hero hero--compact">
        <div className="hero__content">
          <p className="eyebrow">Profile</p>
          <h1>{user?.name || "Campus member"}</h1>
          <p className="hero__text">
            {user?.email || "No email saved"} is currently using the local demo
            session for this frontend.
          </p>
        </div>

        <div className="hero__stats">
          <div className="stat-card">
            <span className="stat-card__value">{items.length}</span>
            <span className="stat-card__label">My posted items</span>
          </div>
        </div>
      </section>

      {status === "loading" && (
        <div className="empty-state">
          <h3>Loading your reports</h3>
          <p>Checking for items tied to your saved contact email.</p>
        </div>
      )}

      {status === "error" && (
        <div className="empty-state empty-state--error">
          <h3>Profile data unavailable</h3>
          <p>The backend item list could not be loaded right now.</p>
        </div>
      )}

      {status === "success" && items.length === 0 && (
        <div className="empty-state">
          <h3>No reports from you yet</h3>
          <p>Add an item using your saved email as contact and it will appear here.</p>
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

export default Profile;
