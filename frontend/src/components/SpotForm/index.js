import { useState, useEffect } from "react";
import { createSpotThunk } from "../../store/spots";
import "./SpotForm.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';

const CreateSpot = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const owner = useSelector(state => state.session.user);
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");

  // TODO: hanlde error validation especially for images
  useEffect(() => {
    const errorObj = {};
    if(description && description.length < 30) errorObj["desc"] = "Description must be at least 30 characters long"
    if(!name) errorObj["name"] = "needs a name";
    if(!country) errorObj["country"] = "country needs to be provided";
    if(!address) errorObj["address"] = "Address needs to be provided";
    if(!city) errorObj["city"] = "City needs to be provided";
    if((previewImage && !urlValidator(previewImage)) || (img1 && !urlValidator(img1)) || (img2 && !urlValidator(img2)) || (img3 && !urlValidator(img3)) || (img4 && !urlValidator(img4))) errorObj['img'] = "image needs to be in format of either jpg, png, or jpeg";
    if (lng && (lng > 180 || lng < -180)) errorObj['lng'] = "longitude is out of range";
    if (lat && (lat > 90 || lat < -90)) errorObj['lat'] = "latitude is out of range"

    setErrors(errorObj);
  }, [name, address, city, state, lat, lng, description, name, price, previewImage, img1, img2, img3, img4]);

  // const validURL = [".png", ".jpg", ".jpeg"];

  const urlValidator = (url)=> {
    let split = url.split(".");
    if (split.indexOf("jpg") !== -1 || split.indexOf("png") !== -1 || split.indexOf("jpeg") !== -1) {
      return true;
    } else {
      return false
    }
  };

  const handleSubmit = (e) => {
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

    const spotImages = [
      previewImage.trim(),
      img1.trim(),
      img2.trim(),
      img3.trim(),
      img4.trim()
    ]

     dispatch(createSpotThunk(spotData, spotImages, owner.id))
     .then(spotId => history.push(`/spots/${spotId}`))
     .catch(async res => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
     })

    //  if (spot.errors) {
    //   // fix error handling
    //   setErrors(spot.errors);
    //   // console.log('spot errors', spot.errors)
    //  } else {
    //   return history.push(`/spots/${spot}`);
    //  }
  }

  return (
    <div className="form-component" onSubmit={handleSubmit}>
      <h2>Create a New Spot</h2>
      <form>
        <h3>Where's your place located?</h3>
        <p>Guests will only get your exact address once they booked a reservation.</p>
        <label>
          Country
          <input required={true} minLength={3} maxLength={57} type="text" name="country" value={country} onChange={(e) => setCountry(e.target.value)} />
        </label>
        <label>
          Street Address
          <input required={true} minLength={5} maxLength={30} type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <div className="city-state form-seperator">
          <label>
            City
            <input required={true} minLength={2} maxLength={18} type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label>
            State
            <input required={true} minLength={1} maxLength={12} type="text" value={state} onChange={(e) => setState(e.target.value)} />
          </label>
        </div>

        <div className="form-seperator">
          <h3>Describe your place to guests</h3>
          <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
          {errors.desc && <p className="errors">{errors.desc}</p>}
          <textarea minLength={30} required className="form-text-area " rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-seperator">
          <h3>Create a title for your spot</h3>
          <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
          <input required={true} className="title-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name of your spot" />
        </div>

        <div className="form-seperator">
          <h3>Set a base price for your spot</h3>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          $ <input required={true} min={1} className="price-input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price per night (USD)" />
        </div>

        <div className="form-seperator">
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at east one photo to publish your spot.</p>
          <div className="links-container">
            { errors.img && <p className="errors">{errors.img}</p> }
            <input required type="url" placeholder="Preview Image URL" onChange={(e) => setPreviewImage(e.target.value)} />
            <input type="url" placeholder="Image URL" onChange={(e) => setImg1(e.target.value)} />
            <input type="url" placeholder="Image URL" onChange={(e) => setImg2(e.target.value)} />
            <input type="url" placeholder="Image URL" onChange={(e) => setImg3(e.target.value)} />
            <input type="url" placeholder="Image URL" onChange={(e) => setImg4(e.target.value)} />
          </div>
        </div>
        <button className="btn" type="submit">Create Spot</button>
        {errors.errors && <p className="errors">{errors.errors.errors}</p>}
      </form>
    </div>
  )
};

export default CreateSpot;
