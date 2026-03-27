import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Enter both email and password to continue.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const res = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });
      onLogin(res.data);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <form className="form-card auth-card" onSubmit={submit}>
        <p className="eyebrow">Welcome back</p>
        <h1>Log in to manage item reports</h1>
        <p className="auth-copy">
          Use your registered campus account to add items, review responses, and
          manage your reports.
        </p>

        <label className="field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            placeholder="student@campus.edu"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        {error && <p className="inline-message inline-message--error">{error}</p>}

        <button className="button button--primary" type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        <p className="auth-footnote">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
