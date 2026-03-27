import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const { userId, token } = useParams();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.password.trim() || !form.confirmPassword.trim()) {
      setFeedback({ type: "error", text: "Fill in both password fields." });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFeedback({ type: "error", text: "Password and confirm password must match." });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback({ type: "", text: "" });
      const res = await API.post(`/auth/reset-password/${userId}/${token}`, {
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setFeedback({
        type: "success",
        text: res.data?.msg || "Password reset successful. Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.response?.data?.msg || "Unable to reset the password with this link.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <form className="form-card auth-card" onSubmit={submit}>
        <p className="eyebrow">Reset password</p>
        <h1>Choose a new password</h1>
        <p className="auth-copy">
          Enter your new password below and confirm it to finish resetting your
          account.
        </p>

        <label className="field">
          <span>New password</span>
          <input
            name="password"
            type="password"
            placeholder="Enter a new password"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Confirm password</span>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your new password"
            value={form.confirmPassword}
            onChange={handleChange}
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
          {submitting ? "Updating password..." : "Reset Password"}
        </button>

        <p className="auth-footnote">
          Back to <Link to="/login">login</Link>
        </p>
      </form>
    </section>
  );
}

export default ResetPassword;
