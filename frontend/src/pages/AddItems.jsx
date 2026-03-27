import { useState } from "react";
import API from "../services/api";

function AddItem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    contact: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    API.post("/items", form)
      .then(() => {
        alert("Item added successfully");
        setForm({
          title: "",
          description: "",
          location: "",
          contact: "",
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className="form-layout">
      <div className="form-layout__intro">
        <p className="eyebrow">Report a discovery</p>
        <h1>Add a found item</h1>
        <p>
          Share enough detail that the owner can recognize the item quickly,
          then include where it was found and how they can reach you.
        </p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <label className="field">
          <span>Item title</span>
          <input
            name="title"
            placeholder="Blue water bottle, student ID, calculator..."
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            placeholder="Add distinguishing details like color, brand, stickers, or contents."
            value={form.description}
            onChange={handleChange}
            rows="5"
          />
        </label>

        <label className="field">
          <span>Found location</span>
          <input
            name="location"
            placeholder="Library 2nd floor, cafeteria entrance, lab 3..."
            value={form.location}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Contact info</span>
          <input
            name="contact"
            placeholder="Email, phone number, desk office, or club room"
            value={form.contact}
            onChange={handleChange}
          />
        </label>

        <button className="button button--primary" type="submit">
          Publish Item
        </button>
      </form>
    </section>
  );
}

export default AddItem;
