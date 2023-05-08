import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

const ViewSpot = (props) => {
  const { spotId } = useParams();

  return (
    <h1>View spot component</h1>
  )
};

export default ViewSpot;
