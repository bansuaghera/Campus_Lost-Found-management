import { useEffect, useState } from "react";
import API from "../services/api";
import ItemCard from "../components/ItemCard";
import { ITEM_STATUSES } from "../constants";

function Profile({ user }) {
  const [items, setItems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [feedback, setFeedback] = useState({ type: "", text: "" });

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

  const updateItemStatus = async (itemId, nextStatus) => {
    try {
      const res = await API.put(`/items/${itemId}/status`, { status: nextStatus });
      setItems((current) => current.map((item) => (item.id === itemId ? res.data : item)));
      setFeedback({ type: "success", text: `Item #${itemId} updated to ${nextStatus}.` });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Could not update the item status.",
      });
    }
  };

  const pendingResponses = responses.filter((response) => response.claimStatus === "Pending");
  const resolvedItems = items.filter((item) => item.status === "Resolved").length;

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
            <span className="stat-card__value">{pendingResponses.length}</span>
            <span className="stat-card__label">Pending claims</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{resolvedItems}</span>
            <span className="stat-card__label">Resolved reports</span>
          </div>
        </div>
      </section>

      {feedback.text && (
        <p
          className={`inline-message ${
            feedback.type === "error" ? "inline-message--error" : "inline-message--success"
          }`}
        >
          {feedback.text}
        </p>
      )}

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
        <>
          <section className="section-heading">
            <p className="eyebrow">Manage reports</p>
            <h2>Your item workflow</h2>
          </section>

          <div className="management-grid">
            {items.map((item) => (
              <div className="management-card" key={item.id}>
                <ItemCard item={item} />
                <label className="field">
                  <span>Update lifecycle stage</span>
                  <select
                    value={item.status}
                    onChange={(e) => updateItemStatus(item.id, e.target.value)}
                  >
                    {ITEM_STATUSES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
          </div>
        </>
      )}

      {status === "success" && responses.length > 0 && (
        <>
          <section className="section-heading">
            <p className="eyebrow">Inbox</p>
            <h2>Recent claim responses</h2>
          </section>

          <div className="response-feed">
            {responses.map((response) => (
              <article className="response-card" key={response.id}>
                <div className="response-card__topline">
                  <strong>{response.responder?.name || "Campus member"}</strong>
                  <span>{response.item?.title || `Item #${response.itemId}`}</span>
                </div>
                <p>{response.message}</p>
                <small>
                  {response.claimStatus} - {new Date(response.createdAt).toLocaleString()}
                </small>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Profile;
