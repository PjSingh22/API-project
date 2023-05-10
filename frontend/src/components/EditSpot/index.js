import { useState, useEffect } from "react";
import { getSpotThunk } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router-dom';
import "./EditSpot.css";

const EditSpot = () => {
  const { spotId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const owner = useSelector(state => state.session.user);
  const spot = useSelector(state => state.spots.singleSpot);
  console.log('edit spot', spot)
  const [country, setCountry] = useState(spot.country);
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state || "");
  const [lat, setLat] = useState(spot.lat || "");
  const [lng, setLng] = useState(spot.lng || "");
  const [description, setDescription] = useState(spot.description || "");
  const [name, setName] = useState(spot.name || "");
  const [price, setPrice] = useState(spot.price || "");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getSpotThunk(spotId));
  }, [dispatch])

  // TODO: handle error validation especially for images
  useEffect(() => {
    const errorObj = {};
    if(description && description.length < 10) errorObj["desc"] = "Description must be at least 10 characters long"
    if(!name) errorObj["name"] = "needs a name";
    if(!country) errorObj["country"] = "country needs to be provided";
    if(!address) errorObj["address"] = "Address needs to be provided";
    if(!city) errorObj["city"] = "City needs to be provided";
    // if(previewImage && ) errorObj['img'] = "image needs to be in jpg, png, or jpeg format"

    if (lng && (lng > 180 || lng < -180)) errorObj['lng'] = "longitude is out of range";
    if (lat && (lat > 90 || lat < -90)) errorObj['lat'] = "latitude is out of range"

    setErrors(errorObj)
  }, [name, address, city, state, lat, lng, description, name, price])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const spotData = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
    }

     let spot = await dispatch();

     if (spot.errors) {
      // fix error handling
      setErrors(spot.errors);
      console.log('spot errors', spot.errors)
     } else {
      return history.push(`/spots/${spot}`);
     }
  }

  return (
    <div className="form-component" onSubmit={handleSubmit}>
      <h2>Update your Spot</h2>
      <form>
        <h3>Where's your place located?</h3>
        <p>Guests will only get your exact address once they booked a reservation</p>
        <label>
          Country
          <input required={true} type="text" name="country" value={country} onChange={(e) => setCountry(e.target.value)} />
        </label>
        <label>
          Street Address
          <input required={true} type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <div className="city-state form-seperator">
          <label>
            City
            <input required={true} type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label>
            State
            <input required={true} type="text" value={state} onChange={(e) => setState(e.target.value)} />
          </label>
          <label>
            latitude
            <input type="number" step="0.001" min={-90} max={90} value={lat} onChange={(e) => setLat(e.target.value)} />
          </label>
          <label>
            longitude
            <input type="number" step="0.001" min={-180} max={180} value={lng} onChange={(e) => setLng(e.target.value)} />
          </label>
        </div>

        <div className="form-seperator">
          <h3>Describe your place to guests</h3>
          <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood</p>
          {errors.desc && <p className="errors">{errors.desc}</p>}
          <textarea min={10} required={true} className="form-text-area " rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-seperator">
          <h3>Create a title for your spot</h3>
          <p>Catch guests' attention with a sot title that highlights what makes your place special</p>
          <input required={true} className="title-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-seperator">
          <h3>Set a base price for your spot</h3>
          <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
          $ <input required={true} min={1} className="price-input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <button disabled={Object.values(errors).length} className="btn" type="submit">Update Spot</button>
        {errors.errors && <p className="errors">{errors.errors.errors}</p>}
      </form>
    </div>
  )
};

export default EditSpot;
