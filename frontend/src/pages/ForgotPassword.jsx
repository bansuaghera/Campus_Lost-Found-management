import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setFeedback({ type: "error", text: "Enter your registered email address first." });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback({ type: "", text: "" });
      const res = await API.post("/auth/forgot-password", {
        email: email.trim(),
      });
      setFeedback({
        type: "success",
        text: res.data?.msg || "Password reset link sent to your email.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.response?.data?.msg || "Unable to send the reset email right now.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <form className="form-card auth-card" onSubmit={submit}>
        <p className="eyebrow">Recover account</p>
        <h1>Forgot your password?</h1>
        <p className="auth-copy">
          Enter the email address linked to your account and we will send you a
          password reset link.
        </p>

        <label className="field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            placeholder="student@campus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {feedback.text && (
          <p
            className={`inline-message ${
              feedback.type === "success" ? "inline-message--success" : "inline-message--error"
            }`}
          >
            {feedback.text}
          </p>
        )}

        <button className="button button--primary" type="submit" disabled={submitting}>
          {submitting ? "Sending link..." : "Send Reset Link"}
        </button>

        <p className="auth-footnote">
          Back to <Link to="/login">login</Link>
        </p>
      </form>
    </section>
  );
}

export default ForgotPassword;
