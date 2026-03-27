import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { ITEM_CATEGORIES, REPORT_TYPES } from "../constants";

function AddItem({ user }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    location: "",
    contact: user?.email || "",
    reportType: "Lost",
    status: "Lost",
    reportedAt: new Date().toISOString().slice(0, 10),
  });
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setForm((current) => ({
        ...current,
        contact: current.contact || user.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "reportType" ? { status: value } : {}),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setFeedback({ type: "", text: "" });
      await API.post("/items", form);
      setFeedback({ type: "success", text: "Item report submitted successfully." });
      navigate("/");
    } catch (err) {
      setFeedback({
        type: "error",
        text:
          err.response?.data?.error ||
          "We could not save the item right now. Please make sure the API server is available.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-layout">
      <div className="form-layout__intro">
        <p className="eyebrow">New report</p>
        <h1>Add a campus item report</h1>
        <p>
          Share enough detail for someone to recognize the item quickly and reach
          the right person for return.
        </p>
      </div>

      <form className="form-card" onSubmit={submit}>
        <label className="field">
          <span>Item title</span>
          <input
            name="title"
            placeholder="Black backpack, blue water bottle..."
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            rows="5"
            placeholder="Add details like brand, stickers, color, or what was inside."
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <div className="field-grid">
          <label className="field">
            <span>Report type</span>
            <select name="reportType" value={form.reportType} onChange={handleChange}>
              {REPORT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Category</span>
            <select name="category" value={form.category} onChange={handleChange}>
              {ITEM_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span>Last seen or found location</span>
          <input
            name="location"
            placeholder="Library desk, C-block corridor, cafeteria..."
            value={form.location}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Date of report</span>
          <input
            name="reportedAt"
            type="date"
            value={form.reportedAt}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Contact</span>
          <input
            name="contact"
            placeholder="Email or phone number"
            value={form.contact}
            onChange={handleChange}
          />
        </label>

        {feedback.text && (
          <p
            className={`inline-message ${
              feedback.type === "error" ? "inline-message--error" : "inline-message--success"
            }`}
          >
            {feedback.text}
          </p>
        )}

        <button className="button button--primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Item"}
        </button>
      </form>
    </section>
  );
}

export default AddItem;
