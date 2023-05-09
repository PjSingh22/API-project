
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { currentUserSpotsThunk } from "../../store/spots";
import Spot from "../Spot";
import './ManageSpots.css';

const ManageSpots = (props) => {
  const dispatch = useDispatch();
  const spotsObj = useSelector(state => state.spots.allSpots)
  const spots = Object.values(spotsObj);
  console.log('spotsObj in manage spots',spotsObj)

  useEffect(() => {
    dispatch(currentUserSpotsThunk());
  }, [dispatch])

  return (
    <div className="manage__container">
      {spots.map(spot => {
        return (
          <div>
            <Spot spot={spot} />
            <div className="spot-buttons">
              {/* TODO: finish this */}
              <button className="btn">Edit</button>
              <button className="btn">Delete</button>
            </div>
          </div>
        )
      })}
    </div>
  )
};

export default ManageSpots;
