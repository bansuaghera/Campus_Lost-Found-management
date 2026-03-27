import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Enter both email and password to continue.");
      return;
    }

    onLogin({
      name: form.email.split("@")[0],
      email: form.email.trim(),
    });

    navigate("/profile");
  };

  return (
    <section className="auth-shell">
      <form className="form-card auth-card" onSubmit={submit}>
        <p className="eyebrow">Welcome back</p>
        <h1>Log in to manage item reports</h1>
        <p className="auth-copy">
          Use a simple local session for now so the frontend remains fully
          usable while backend auth is still being built.
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
            placeholder="Enter any password for local demo mode"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        {error && <p className="inline-message inline-message--error">{error}</p>}

        <button className="button button--primary" type="submit">
          Login
        </button>

        <p className="auth-footnote">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
