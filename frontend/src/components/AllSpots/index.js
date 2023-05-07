import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSpotsThunk } from "../../store/spots";
import Spot from "../Spot";
import './AllSpots.css';

const AllSpots = (props) => {
  const dispatch = useDispatch();
  const spots = useSelector(state => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(loadSpotsThunk());
  }, [dispatch]);
  return (
    <div className="all-spots">
      {spots.map(spot => (
        <div className="spot-card">
          {spot.previewImage === 'invalid' ? <div className="card-img no-img-text"><p>No photo available</p></div> : <img className="card-img" src={spot.previewImage} alt="preview" />}
          <div className="spot-info">
            <div className="left-half-info">
              <div>
                <div>
                  <span>{spot.city}</span>, <span>{spot.state}</span>
                </div>
                <div>
                  <span>${spot.price}</span> night
                </div>
              </div>
            </div>
            <div className="right-half-info">
              <span>*{spot.avgRating}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
};


export default AllSpots;
