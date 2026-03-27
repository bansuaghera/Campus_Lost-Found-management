import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function ItemDetails({ auth }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [feedback, setFeedback] = useState("");

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

  const send = async () => {
    if (!auth?.isAuthenticated) {
      setFeedback("Login is required before sending a response.");
      return;
    }

    if (!message.trim()) {
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
      setFeedback("Response sent successfully.");
    } catch (err) {
      setFeedback(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.msg ||
          "Unable to send the response right now.",
      );
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
            <span>Status</span>
            <strong>{item.status || "Reported"}</strong>
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
            <span>Item ID</span>
            <strong>#{item.id}</strong>
          </div>
        </div>

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

        {feedback && (
          <p
            className={`inline-message ${
              feedback.includes("successfully")
                ? "inline-message--success"
                : "inline-message--error"
            }`}
          >
            {feedback}
          </p>
        )}

        <button
          className="button button--primary"
          onClick={send}
          disabled={!auth?.isAuthenticated}
        >
          Send Response
        </button>

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
                <p>{response.message}</p>
              </div>
            ))
          )}
        </section>
      </article>
    </section>
  );
}

export default ItemDetails;
