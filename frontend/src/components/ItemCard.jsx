import { Link } from "react-router-dom";

function ItemCard({ item }) {
  return (
    <article className="item-card">
      <div className="item-card__badge">Found Item</div>
      <h3>{item.title}</h3>
      <p className="item-card__description">
        {item.description || "No description has been added yet."}
      </p>
      <div className="item-card__meta">
        <span>{item.location || "Location not shared"}</span>
        <span>{item.contact || "Contact unavailable"}</span>
      </div>

      <Link className="button button--ghost" to={`/item/${item.id}`}>
        View Details
      </Link>
    </article>
  );
}

export default ItemCard;
