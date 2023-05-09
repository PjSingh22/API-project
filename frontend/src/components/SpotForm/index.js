import { useState, useEffect } from "react";
import { createSpotThunk } from "../../store/spots";
import "./SpotForm.css";
import { useDispatch } from "react-redux";

const CreateSpot = () => {
  const dispatch = useDispatch
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setSerrors] = useState({});
  const [previewImage, setPreviewImage] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");

  // useEffect(() => {

  // }, [name, address, city, state, lat, lng, description, name, price])

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
      previewImage,
      img1,
      img2,
      img3,
      img4
    }

    dispatch(createSpotThunk(formData));
  }

  return (
    <div className="form-component" onSubmit={handleSubmit}>
      <h2>Create your Spot</h2>
      <form>
        <h3>Where's your place located?</h3>
        <p>Guests will only get your exact address once they booked a reservation</p>
        <label>
          Country
          <input type="text" name="country" value={country} onChange={(e) => setCountry(e.target.value)} />
        </label>
        <label>
          Street Address
          <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <div className="city-state form-seperator">
          <label>
            City
            <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label>
            State
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
          </label>
          <label>
            latitude
            <input type="number" value={lat} onChange={(e) => setLat(e.target.value)} />
          </label>
          <label>
            longitude
            <input type="number" value={lng} onChange={(e) => setLng(e.target.value)} />
          </label>
        </div>

        <div className="form-seperator">
          <h3>Describe your place to guests</h3>
          <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood</p>
          <textarea className="form-text-area " rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-seperator">
          <h3>Create a title for your spot</h3>
          <p>Catch guests' attention with a sot title that highlights what makes your place special</p>
          <input className="title-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-seperator">
          <h3>Set a base price for your spot</h3>
          <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
          $ <input className="price-input" type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div className="form-seperator">
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at east one photo to publish your spot</p>
          <div className="links-container">
            <input type="url" placeholder="Preview Image" onChange={(e) => setPreviewImage(e.target.value)} />
            <input type="url" placeholder="Image URL" onChange={(e) => setImg1(e.target.value)} />
            <input type="url" placeholder="Image URL" onChange={(e) => setImg2(e.target.value)} />
            <input type="url" placeholder="Image URL" onChange={(e) => setImg3(e.target.value)} />
            <input type="url" placeholder="Image URL" onChange={(e) => setImg4(e.target.value)} />
          </div>
        </div>

        <button className="btn" type="submit">Create Spot</button>
      </form>
    </div>
  )
};

export default CreateSpot;
