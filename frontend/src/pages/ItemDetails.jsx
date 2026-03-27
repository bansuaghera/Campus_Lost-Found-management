import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    <div>
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <p>
        <b>Location:</b> {item.location}
      </p>
      <p>
        <b>Contact:</b> {item.contact}
      </p>
    </div>
  );
}

export default ItemDetails;
