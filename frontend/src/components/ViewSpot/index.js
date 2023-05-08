import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getSpotThunk } from "../../store/spots";
import './ViewSpot.css';

const ViewSpot = (props) => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spotObj = useSelector(state => state.spots);
  console.log(spotObj);
  useEffect(() => {
    dispatch(getSpotThunk(spotId))
  }, [dispatch]);
  return (
    <h1>View spot component {spotId}</h1>
  )
};

export default ViewSpot;
