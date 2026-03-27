import { Link } from "react-router-dom";

function ItemCard({ item }) {
  const status = item.status || "Reported";

  return (
    <article className="item-card">
      <div className="item-card__header">
        <span className="item-card__badge">{status}</span>
        <h3>{item.title}</h3>
      </div>

      <p className="item-card__description">
        {item.description || "No extra description was provided for this item yet."}
      </p>

      <div className="item-card__meta">
        <strong>Location</strong>
        <span>{item.location || "Location not shared"}</span>
      </div>

      <div className="item-card__meta">
        <strong>Contact</strong>
        <span>{item.contact || "Check details to coordinate a return"}</span>
      </div>

      <Link className="button button--primary" to={`/item/${item.id}`}>
        View Details
      </Link>
    </article>
  );
}

export default ItemCard;
