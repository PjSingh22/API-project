import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSpotsThunk } from '../../store/spots';
// import { Link } from 'react-router-dom';
import Spot from '../Spot';
import './AllSpots.css';

const AllSpots = () => {
  const dispatch = useDispatch()
  const fetchedSpots = useSelector(state => state.spots.allSpots);
  const spots = Object.values(fetchedSpots);
  const defaultImg = "https://www.gannett-cdn.com/presto/2019/10/11/PNAS/adf1101a-0f8c-404f-9df3-5837bf387dfd-1_Exterior_House_Beautiful_Whole_Home_Concept_House_Castle_Homes_Photo_Reed_Brown_Photography.jpg?crop=5619,3161,x0,y104&width=660&height=372&format=pjpg&auto=webp"

  useEffect(() => {
    dispatch(loadSpotsThunk());
  }, [dispatch])
  return (
    <div className="all-spots">
      {spots.map(spot => (
        <Spot spot={spot} />
      ))}
    </div>
  )
};


export default AllSpots;
