import { useEffect, useState } from "react";
import API from "../services/api";
import ItemCard from "../components/ItemCard";

function Profile({ user }) {
  const [items, setItems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setStatus("loading");
        const [itemsRes, responsesRes] = await Promise.all([
          API.get("/items/my"),
          API.get("/response/my"),
        ]);
        setItems(itemsRes.data);
        setResponses(responsesRes.data);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    loadProfileData();
  }, []);

  return (
    <section className="page-stack">
      <section className="hero hero--compact">
        <div className="hero__content">
          <p className="eyebrow">Profile</p>
          <h1>{user?.name || "Campus member"}</h1>
          <p className="hero__text">
            {user?.email || "No email saved"} is signed in and ready to manage
            item reports.
          </p>
        </div>

        <div className="hero__stats">
          <div className="stat-card">
            <span className="stat-card__value">{items.length}</span>
            <span className="stat-card__label">My posted items</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{responses.length}</span>
            <span className="stat-card__label">Responses received</span>
          </div>
        </div>
      </section>

      {status === "loading" && (
        <div className="empty-state">
          <h3>Loading your reports</h3>
          <p>Fetching your items and their response activity from the server.</p>
        </div>
      )}

      {status === "error" && (
        <div className="empty-state empty-state--error">
          <h3>Profile data unavailable</h3>
          <p>The backend could not load your protected profile data right now.</p>
        </div>
      )}

      {status === "success" && items.length === 0 && (
        <div className="empty-state">
          <h3>No reports from you yet</h3>
          <p>Add your first lost or found item and it will show up here.</p>
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
