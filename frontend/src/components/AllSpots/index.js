import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSpotsThunk } from "../../store/spots";

const AllSpots = (props) => {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots);
  console.log(spots);
  useEffect(() => {
    dispatch(loadSpotsThunk());
  }, [dispatch]);
  return (
    <div>
      <h1>all spots component</h1>
    </div>
  )
};


export default AllSpots;
