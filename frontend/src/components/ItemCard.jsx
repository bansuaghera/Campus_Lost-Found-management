import { Link } from "react-router-dom";
import { STATUS_TONES } from "../constants";

function ItemCard({ item }) {
  const status = item.status || "Reported";
  const reportType = item.reportType || "Lost";
  const responseCount = item.responses?.length || 0;
  const ownerName = item.owner?.name || "Campus member";

  return (
    <article className="item-card">
      <div className="item-card__header">
        <div className="item-card__badge-row">
          <span className={`item-card__badge item-card__badge--${STATUS_TONES[status] || "info"}`}>
            {status}
          </span>
          <span className="item-card__badge item-card__badge--neutral">{reportType} report</span>
        </div>
        <h3>{item.title}</h3>
      </div>

      <p className="item-card__description">
        {item.description || "No extra description was provided for this item yet."}
      </p>

      <div className="item-card__meta-row">
        <div className="item-card__meta">
          <strong>Category</strong>
          <span>{item.category || "Other"}</span>
        </div>
        <div className="item-card__meta">
          <strong>Reported</strong>
          <span>{item.reportedAt || "Not set"}</span>
        </div>
      </div>

      <div className="item-card__meta">
        <strong>Location</strong>
        <span>{item.location || "Location not shared"}</span>
      </div>

      <div className="item-card__meta">
        <strong>Owner</strong>
        <span>{ownerName}</span>
      </div>

      <div className="item-card__meta-row">
        <div className="item-card__meta">
          <strong>Contact</strong>
          <span>{item.contact || "Check details to coordinate a return"}</span>
        </div>
        <div className="item-card__meta">
          <strong>Claims</strong>
          <span>{responseCount}</span>
        </div>
      </div>

      <Link className="button button--primary" to={`/item/${item.id}`}>
        View Details
      </Link>
    </article>
  );
}

export default ItemCard;
