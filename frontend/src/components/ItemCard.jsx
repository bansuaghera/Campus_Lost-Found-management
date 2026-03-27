import { Link } from "react-router-dom";

function ItemCard({ item }) {
  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <p><b>Location:</b> {item.location}</p>

      <Link to={`/item/${item._id}`}>View Details</Link>
    </div>
  );
}

export default ItemCard;