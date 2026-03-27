import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { ITEM_STATUSES } from "../constants";

function ItemDetails({ auth }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("error");

  useEffect(() => {
    const loadItem = async () => {
      try {
        setStatus("loading");
        const [itemRes, responsesRes] = await Promise.all([
          API.get(`/items/${id}`),
          API.get(`/response/${id}`),
        ]);
        setItem(itemRes.data);
        setResponses(responsesRes.data);
        setStatus("success");
      } catch (err) {
        setFeedbackType("error");
        setFeedback(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to load this item right now.",
        );
        setStatus("error");
      }
    };

    loadItem();
  }, [id]);

  const isOwner = auth?.user?.id === item?.userId;

  const send = async () => {
    if (!auth?.isAuthenticated) {
      setFeedbackType("error");
      setFeedback("Login is required before sending a response.");
      return;
    }

    if (!message.trim()) {
      setFeedbackType("error");
      setFeedback("Write a short handoff note before sending.");
      return;
    }

    try {
      const res = await API.post("/response", {
        itemId: id,
        message: message.trim(),
      });
      setResponses((prev) => [res.data, ...prev]);
      setMessage("");
      setFeedbackType("success");
      setFeedback("Response sent successfully.");
    } catch (err) {
      setFeedbackType("error");
      setFeedback(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.msg ||
          "Unable to send the response right now.",
      );
    }
  };

  const updateStatus = async (nextStatus) => {
    try {
      const res = await API.put(`/items/${id}/status`, { status: nextStatus });
      setItem(res.data);
      setFeedbackType("success");
      setFeedback(`Status updated to ${nextStatus}.`);
    } catch (err) {
      setFeedbackType("error");
      setFeedback(err.response?.data?.message || "Unable to update the status right now.");
    }
  };

  if (status === "loading") {
    return (
      <section className="details-page">
        <div className="empty-state">
          <h3>Loading item details</h3>
          <p>Pulling the latest report information from the server.</p>
        </div>
      </section>
    );
  }

  if (status === "error" || !item) {
    return (
      <section className="details-page">
        <div className="empty-state empty-state--error">
          <h3>Item details unavailable</h3>
          <p>{feedback}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="details-page">
      <article className="details-card">
        <p className="eyebrow">Item detail</p>
        <h1>{item.title}</h1>
        <p className="details-card__description">
          {item.description || "No description was added to this report."}
        </p>

        <div className="details-grid">
          <div className="details-grid__item">
            <span>Report type</span>
            <strong>{item.reportType || "Lost"}</strong>
          </div>
          <div className="details-grid__item">
            <span>Status</span>
            <strong>{item.status || "Reported"}</strong>
          </div>
          <div className="details-grid__item">
            <span>Category</span>
            <strong>{item.category || "Other"}</strong>
          </div>
          <div className="details-grid__item">
            <span>Location</span>
            <strong>{item.location || "Not specified"}</strong>
          </div>
          <div className="details-grid__item">
            <span>Contact</span>
            <strong>{item.contact || "No contact shared"}</strong>
          </div>
          <div className="details-grid__item">
            <span>Reported</span>
            <strong>{item.reportedAt || "Not specified"}</strong>
          </div>
          <div className="details-grid__item">
            <span>Reported by</span>
            <strong>{item.owner?.name || "Campus member"}</strong>
          </div>
        </div>

        {isOwner ? (
          <label className="field">
            <span>Manage item status</span>
            <select value={item.status} onChange={(e) => updateStatus(e.target.value)}>
              {ITEM_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="field">
            <span>Return coordination note</span>
            <textarea
              rows="4"
              placeholder={
                auth?.isAuthenticated
                  ? "Share where the owner can meet you or how to identify the item."
                  : "Login to send a response for this item."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!auth?.isAuthenticated}
            />
          </div>
        )}

        {feedback && (
          <p
            className={`inline-message ${
              feedbackType === "success" ? "inline-message--success" : "inline-message--error"
            }`}
          >
            {feedback}
          </p>
        )}

        {!isOwner && (
          <button
            className="button button--primary"
            onClick={send}
            disabled={!auth?.isAuthenticated}
          >
            Send Claim Note
          </button>
        )}

        <section className="response-list">
          <div className="section-heading">
            <p className="eyebrow">Responses</p>
            <h2>Return follow-up history</h2>
          </div>

          {responses.length === 0 ? (
            <div className="empty-state empty-state--compact">
              <h3>No responses yet</h3>
              <p>Responses from interested campus members will appear here.</p>
            </div>
          ) : (
            responses.map((response) => (
              <div className="response-card" key={response.id}>
                <div className="response-card__topline">
                  <strong>{response.responder?.name || "Campus member"}</strong>
                  <span>{new Date(response.createdAt).toLocaleString()}</span>
                </div>
                <p>{response.message}</p>
                <small>{response.claimStatus}</small>
              </div>
            ))
          )}
        </section>
      </article>
    </section>
  );
}

export default ItemDetails;
