import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSpotsThunk } from "../../store/spots";
import Spot from "../Spot";

const AllSpots = (props) => {
  const dispatch = useDispatch();
  const spots = useSelector(state => Object.values(state.spots.allSpots));
  console.log(spots);

  useEffect(() => {
    dispatch(loadSpotsThunk());
  }, [dispatch]);
  return (
    <div className="all-spots">
      {spots.map(spot => (
        <Spot spot={spot} />
      ))}
    </div>
  )
};


export default AllSpots;
