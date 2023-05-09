import { useState, useEffect } from "react";
import "./SpotForm.css";

const CreateSpot = () => {
  const [country, setCountry] = useState();
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [description, setDescription] = useState();
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [images, setImages] = useState([]);
  return (
    <div className="form-component">
      <h2>Update your Spot</h2>
    </div>
  )
};

export default CreateSpot;
