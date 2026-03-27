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
      .then(() => alert("Item Added"))
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Found Item</h2>

      <input name="title" placeholder="Title" onChange={handleChange} />
      <br />

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
      />
      <br />

      <input name="location" placeholder="Location" onChange={handleChange} />
      <br />

      <input
        name="contact"
        placeholder="Contact Info"
        onChange={handleChange}
      />
      <br />

      <button type="submit">Add Item</button>
    </form>
  );
}

export default AddItem;
