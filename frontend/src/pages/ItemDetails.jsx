import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState({});

  useEffect(() => {
    API.get(`/items/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <section className="details-page">
      <div className="details-card">
        <p className="eyebrow">Item record</p>
        <h1>{item.title || "Loading item..."}</h1>
        <p className="details-card__description">
          {item.description || "No detailed description was provided for this item."}
        </p>

        <div className="details-grid">
          <div className="details-grid__item">
            <span>Found at</span>
            <strong>{item.location || "Location not shared"}</strong>
          </div>
          <div className="details-grid__item">
            <span>Contact</span>
            <strong>{item.contact || "No contact info available"}</strong>
          </div>
        </div>

        <Link className="button button--ghost" to="/">
          Back to listings
        </Link>
      </div>
    </section>
  );
}

export default ItemDetails;
