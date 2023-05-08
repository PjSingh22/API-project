import { useEffect, useReducer, useState } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getSpotThunk } from "../../store/spots";
import './ViewSpot.css';

const ViewSpot = (props) => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spotObj = useSelector(state => state.spots.singleSpot);
  const { address, avgStarRating, city, country, description, lat, lng, name, numReviews, User, price, spotImages, state } = spotObj;

  useEffect(() => {
    dispatch(getSpotThunk(spotId))
  }, [dispatch]);

  if(Object.values(spotObj).length === 0) {
    return null;
  }
    return (
      <div className="view-container">
        <div className="spot-header">
          <p className="spot__main-title">{name}</p>
          <p className="spot__header-info">{city}, {state}, {country}</p>
        </div>
        <div className="spot-images">
          <div className="main-img">
            <img src={spotImages[0].url} />
          </div>
          <div className="other-imgs">
            {/* put 4 images here */}
          </div>
        </div>
        <div className="spot-info">
          <div className="spot-info-left"></div>
          <div className="spot-info-right"></div>
        </div>
        <div className="spot-reviews"></div>
      </div>
    )
};

export default ViewSpot;
