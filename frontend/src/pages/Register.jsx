import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register({ onRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Complete all fields before creating your account.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      const loginRes = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      onRegister(loginRes.data);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <form className="form-card auth-card" onSubmit={submit}>
        <p className="eyebrow">Create account</p>
        <h1>Start reporting items in seconds</h1>
        <p className="auth-copy">
          Create a real account backed by the server so your items and responses
          stay connected across sessions.
        </p>

        <label className="field">
          <span>Name</span>
          <input
            name="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
          />
        </label>

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
            placeholder="Choose a password"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        {error && <p className="inline-message inline-message--error">{error}</p>}

        <button className="button button--primary" type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>

        <p className="auth-footnote">
          Already have an account? <Link to="/login">Login instead</Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
