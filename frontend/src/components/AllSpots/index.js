import { Link } from 'react-router-dom';
import Spot from '../Spot';
import './AllSpots.css';

const AllSpots = ({spots}) => {
  const defaultImg = "https://www.gannett-cdn.com/presto/2019/10/11/PNAS/adf1101a-0f8c-404f-9df3-5837bf387dfd-1_Exterior_House_Beautiful_Whole_Home_Concept_House_Castle_Homes_Photo_Reed_Brown_Photography.jpg?crop=5619,3161,x0,y104&width=660&height=372&format=pjpg&auto=webp"

  return (
    <div className="all-spots">
      {spots.map(spot => (
        <Spot spot={spot} defaultImg={defaultImg} />
      ))}
    </div>
  )
};


export default AllSpots;
