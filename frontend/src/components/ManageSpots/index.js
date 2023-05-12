
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Redirect } from "react-router-dom";
import { currentUserSpotsThunk } from "../../store/spots";
import { Link } from 'react-router-dom';
import DeleteButton from "../DeleteButtonModal";
import OpenModalButton from "../OpenModalButton";
import Spot from "../Spot";
import './ManageSpots.css';

const ManageSpots = (props) => {
  const dispatch = useDispatch();
  const spotsObj = useSelector(state => state.spots.allSpots)
  const spots = Object.values(spotsObj);

  useEffect(() => {
    dispatch(currentUserSpotsThunk());
  }, [dispatch])

  return (
    <div>
      <h2>Manage Spots</h2>
      <Link to="spots/create"><button className="btn create-spot">Create A New Spot</button></Link>
      <div className="manage__container">
        {spots.map(spot => {
          return (
            <div className="manage__spot">
              <Spot spot={spot} />
              <div className="spot-buttons">
                {/* TODO: finish this */}
                <Link to={`/user/spots/${spot.id}`} ><button className="btn open-modal">Update</button></Link>
                <OpenModalButton
                   className="open-modal"
                   buttonText="Delete"
                   modalComponent={<DeleteButton spotId={spot.id} />}
                   />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
};

export default ManageSpots;
