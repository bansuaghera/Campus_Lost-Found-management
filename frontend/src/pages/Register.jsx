import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register({ onRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Complete all fields before creating your account.");
      return;
    }

    onRegister({
      name: form.name.trim(),
      email: form.email.trim(),
    });

    navigate("/profile");
  };

  return (
    <section className="auth-shell">
      <form className="form-card auth-card" onSubmit={submit}>
        <p className="eyebrow">Create account</p>
        <h1>Start reporting items in seconds</h1>
        <p className="auth-copy">
          This registration stores a local session so the frontend is usable
          today, even before a dedicated auth API is added.
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
            placeholder="Choose any password for local demo mode"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        {error && <p className="inline-message inline-message--error">{error}</p>}

        <button className="button button--primary" type="submit">
          Register
        </button>

        <p className="auth-footnote">
          Already have a local session? <Link to="/login">Login instead</Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
